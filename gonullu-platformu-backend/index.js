// Gerekli paketleri yükle
require('dotenv').config(); // .env dosyasını okumak için
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Express uygulamasını oluştur
const app = express();

// Middleware'ler (ara yazılımlar)
app.use(cors()); // Frontend'den gelen isteklere izin ver
app.use(express.json()); // Gelen verileri JSON olarak işle

// Route dosyaları
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');

// Route'ları kullan
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gonullu-platformu')
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Basit bir GET endpoint'i (kök dizin)
app.get('/', (req, res) => {
  res.send('Gönüllü Platformu Backend Çalışıyor! 🚀');
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000; // .env'den portu al veya 5000 kullan
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
