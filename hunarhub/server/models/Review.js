const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  comment:      String,
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);
