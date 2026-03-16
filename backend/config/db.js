const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10, 
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
    });

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Bağlantı Hatası: ${err.message}`);
    console.log('5 saniye içinde tekrar bağlanmayı deniyor...');
    setTimeout(connectDB, 5000);
  }
};
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose bağlantısı kesildi! Yeniden bağlanmaya çalışılıyor...');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose çalışma zamanı hatası:', err);
});

module.exports = connectDB;