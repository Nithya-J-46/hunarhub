const mongoose = require('mongoose');

const ProductOrderSchema = new mongoose.Schema({
  customer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'Entrepreneur', required: true },
  product:      { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity:     { type: Number, required: true, default: 1 },
  totalPrice:   { type: Number, required: true },
  status:       { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProductOrder', ProductOrderSchema);
