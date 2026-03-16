const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  type: {
    type: String,
    enum: ['offer', 'request'],
    required: true
  },
  category: {
    type: String,
    enum: ['person', 'material', 'both'],
    default: 'person'
  },
  from: {
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] 
    }
  },
  to: {
    address: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] 
    }
  },

  departureTime: {
    type: Date,
    required: [true, 'Tarih ve saat gereklidir.'],
    index: true
  },

  seats: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  status: {
    type: String,
    enum: ['active', 'full', 'completed', 'cancelled'],
    default: 'active',
    index: true
  },

  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Açıklama 200 karakterden fazla olamaz.']
  }
}, { timestamps: true });

TransportSchema.index({ "from.location": '2dsphere' });
TransportSchema.index({ "to.location": '2dsphere' });

module.exports = mongoose.model('Transport', TransportSchema);