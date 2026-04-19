const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  name:         { type: String, required: true },
  description:  String,
  price:        { type: Number, required: true },
  image:        { type: String, default: '' },
  category:     String,
  stock:        { type: Number, default: 1 },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
