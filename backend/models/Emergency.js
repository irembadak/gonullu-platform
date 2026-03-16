const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
  emergencyType: {
    type: String,
    required: [true, 'Lütfen acil durum tipini seçiniz'],
    enum: ['sağlık', 'yangın', 'deprem', 'sel', 'diğer']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Cihaz konum bilgisi gereklidir']
    },
    address: String 
  },
  description: {
    type: String,
    required: [true, 'Lütfen durumla ilgili kısa bir açıklama giriniz']
  },
  contactNumber: {
    type: String,
    required: [true, 'Ulaşılabilir bir telefon numarası giriniz']
  },
  peopleCount: {
    type: Number,
    default: 1,
    min: [1, 'En az 1 kişi belirtilmelidir']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'resolved'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});
EmergencySchema.index({ location: '2dsphere' });
EmergencySchema.index({ status: 1, priority: -1 });

module.exports = mongoose.model('Emergency', EmergencySchema);