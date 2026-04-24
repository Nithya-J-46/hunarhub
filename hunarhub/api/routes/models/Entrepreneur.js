const mongoose = require('mongoose');

const EntrepreneurSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  category:     { type: String, enum: ['Cobbler', 'Potter', 'Tailor', 'Artisan', 'Vendor'], required: true },
  skills:       [String],
  location:     { type: String, required: true },
  description:  String,
  pricing:      String,
  gallery:      [String],
  isVerified:   { type: Boolean, default: false },
  availability: { type: Boolean, default: true },
  rating:       { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  earnings:     { type: Number, default: 0 },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entrepreneur', EntrepreneurSchema);
