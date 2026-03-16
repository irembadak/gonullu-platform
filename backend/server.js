require('dotenv').config();
const http = require('http');
const app = require('./backendApp');
const connectDB = require('./config/db');
const admin = require('firebase-admin');
const { syncFirebaseToMongo } = require('./services/syncService');
const chalk = require('chalk');

// Port ve Host Ayarları
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// Firebase Admin Başlatma
const firebaseConfig = process.env.FIREBASE_PRIVATE_KEY 
  ? {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    }
  : {
      credential: admin.credential.cert(require('./serviceAccountKey.json')),
      databaseURL: process.env.FIREBASE_DATABASE_URL || `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    };

if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
  console.log(chalk.green('✔ Firebase Admin başarıyla başlatıldı'));
}

const startServer = async () => {
  try {
    // 1. Veritabanı bağlantısını sağla (Önce veritabanı, sonra sunucu)
    await connectDB();
    console.log(chalk.green('✔ MongoDB bağlantısı başarılı.'));

    // 2. HTTP Sunucusunu Oluştur
    const server = http.createServer(app);

    server.listen(PORT, HOST, () => {
      console.log('\n' + chalk.bold.bgGreen.black(' SİSTEM AKTİF ') + '\n');
      console.log(chalk.bold.cyan(`🚀 Backend: http://localhost:${PORT}`));
      console.log(chalk.gray('-------------------------------------------') + '\n');
      
      // 3. Senkronizasyon Servisi (Sadece eksik kullanıcılar için - Mevcutları BOZMAZ)
      console.log(chalk.blue('ℹ Senkronizasyon kontrol ediliyor...'));
      syncFirebaseToMongo()
        .then(() => console.log(chalk.blue('✔ Senkronizasyon işlemi tamamlandı.')))
        .catch(err => {
            // Hata olsa bile sunucu çalışmaya devam eder
            console.warn(chalk.yellow('⚠ Senkronizasyon uyarısı: Veri tabanında çakışma olabilir ama sistem çalışıyor.'));
        });
        
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(chalk.red(`❌ HATA: ${PORT} portu meşgul! Lütfen diğer terminali kapat.`));
        process.exit(1);
      } else {
        console.error(chalk.red('❌ Sunucu başlatma hatası:'), err);
      }
    });

  } catch (startupError) {
    console.error(chalk.bgRed('❌ KRİTİK HATA: Sunucu başlatılamadı:'), startupError);
    process.exit(1);
  }
};

// Hata yönetimi
process.on('unhandledRejection', (err) => {
  console.error(chalk.red(`Beklenmedik Hata: ${err.message}`));
});

startServer();