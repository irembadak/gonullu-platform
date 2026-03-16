const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  name: { 
    type: String, 
    required: [true, 'Kurum adı zorunludur'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Kurum açıklaması boş bırakılamaz'] 
  },
  logo: { type: String, default: '' },
  website: { type: String, trim: true },
  phone: { type: String, required: [true, 'İletişim numarası gereklidir'] },
  address: String,

  verificationDocuments: [{
    title: String, 
    url: String   
  }],
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'], 
    default: 'pending' 
  },
  
  category: {
    type: [String],
    enum: ['eğitim', 'sağlık', 'çevre', 'afet', 'insani-yardım'],
    default: ['genel']
  }
}, { timestamps: true });
organizationSchema.index({ name: 'text', status: 1 });

module.exports = mongoose.model('Organization', organizationSchema);