const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
    address: String
  },
  date: { type: Date, required: true },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillsRequired: [String],
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
}, { timestamps: true });

eventSchema.index({ location: '2dsphere' }); // Konum bazlı arama için

module.exports = mongoose.model('Event', eventSchema);