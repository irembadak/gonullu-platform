const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  name: {
    type: String,
    required: [true, 'Lütfen isim giriniz'],
    trim: true,
    maxlength: [50, 'İsim 50 karakterden uzun olamaz']
  },
  email: {
    type: String,
    required: [true, 'Lütfen e-posta giriniz'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Geçersiz e-posta'],
    index: true
  },
  password: {
    type: String,
    required: [function() { return !this.firebaseUid; }, 'Firebase dışı kullanıcılar için şifre gereklidir'],
    minlength: [6, 'Şifre en az 6 karakter olmalı'],
    select: false
  },
  // Kural: Herkes teknik olarak 'volunteer' başlar
  role: {
    type: String,
    enum: ['volunteer', 'admin', 'stk'],
    default: 'volunteer'
  },
  // KRİTİK ALAN: Kullanıcının yükselmek istediği rütbe (Örn: 'stk')
  pendingRole: {
    type: String,
    default: null
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      default: [27.1428, 38.4237] 
    },
    city: { type: String, default: 'Belirtilmemiş' },
    district: { type: String, default: 'Belirtilmemiş' }
  },
  skills: [String],
  joinedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  profilePhoto: { type: String, default: '' },
  
  // Sadece Admin onayıyla true olur (STK yetkileri için)
  isVerified: { 
    type: Boolean, 
    default: false 
  },

  interests: {
    type: [String],
    default: []
  },
  fcmTokens: [String],
  organizationName: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('attendedEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'participants'
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);