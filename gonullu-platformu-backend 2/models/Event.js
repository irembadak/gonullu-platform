// Event.js - Son halini bununla değiştir
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Etkinlik başlığı zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakteri geçemez']
  },
  firebaseId: { 
    type: String, 
    unique: true,
    sparse: true, 
    index: true   
  },
  description: { 
    type: String, 
    required: [true, 'Açıklama alanı boş bırakılamaz'] 
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { 
      type: [Number], 
      required: [true, 'Konum koordinatları gereklidir'] 
    },
    address: String
  },
  category: { 
    type: String,
    required: true,
    enum: ['Çevre', 'Eğitim', 'Sağlık', 'Hayvan Hakları', 'Teknoloji', 'Sosyal Yardım', 'Genel'],
    default: 'Genel'
  },
  startDate: { type: Date, required: [true, 'Başlangıç tarihi belirtilmelidir'] },
  endDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.startDate;
      },
      message: 'Bitiş tarihi başlangıç tarihinden önce olamaz'
    }
  },
  maxParticipants: {
    type: Number,
    default: 0
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  emergencyRelated: { type: mongoose.Schema.Types.ObjectId, ref: 'Emergency', default: null },
  organization: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  requiredSkills: [String],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'active', 'completed'], 
    default: 'pending' 
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('participantsCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

eventSchema.virtual('remainingCapacity').get(function() {
  if (this.maxParticipants === 0) return 999; 
  return this.maxParticipants - this.participants.length;
});

eventSchema.index({ location: '2dsphere' });
eventSchema.index({ category: 1, status: 1 }); 

// KRİTİK DEĞİŞİKLİK: 'events' parametresini ekleyerek koleksiyon adını sabitledik
module.exports = mongoose.model('Event', eventSchema, 'events');