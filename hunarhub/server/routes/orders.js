const router = require('express').Router();
const ServiceRequest = require('../models/ServiceRequest');
const ProductOrder = require('../models/ProductOrder');
const Product = require('../models/Product');
const Entrepreneur = require('../models/Entrepreneur');
const auth = require('../middleware/auth');

// --- SERVICE REQUESTS ---

// Place a service request
router.post('/', auth, async (req, res) => {
  try {
    const request = await ServiceRequest.create({ ...req.body, customer: req.user.id });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get requests made by customer
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user.id })
      .populate('entrepreneur', 'businessName category location');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get requests for a specific entrepreneur
router.get('/entrepreneur/:id', auth, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ entrepreneur: req.params.id })
      .populate('customer', 'name email');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update request status (accept / reject / complete)
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCT ORDERS ---

// Place a product order
router.post('/product', auth, async (req, res) => {
  try {
    const { product: productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ error: 'Product out of stock or insufficient quantity' });
    }
    
    // Reduce stock
    product.stock -= quantity;
    await product.save();

    const totalPrice = product.price * quantity;
    
    const order = await ProductOrder.create({
      customer: req.user.id,
      entrepreneur: product.entrepreneur,
      product: productId,
      quantity,
      totalPrice
    });
    
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product orders for a customer
router.get('/my-product-orders', auth, async (req, res) => {
  try {
    const orders = await ProductOrder.find({ customer: req.user.id })
      .populate('entrepreneur', 'businessName category')
      .populate('product', 'name price image');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product orders for an entrepreneur
router.get('/entrepreneur-products/:id', auth, async (req, res) => {
  try {
    const orders = await ProductOrder.find({ entrepreneur: req.params.id })
      .populate('customer', 'name email')
      .populate('product', 'name price image');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product order status
router.put('/product/:id', auth, async (req, res) => {
  try {
    const order = await ProductOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // If changing to delivered, add to earnings
    if (req.body.status === 'delivered' && order.status !== 'delivered') {
      await Entrepreneur.findByIdAndUpdate(order.entrepreneur, {
        $inc: { earnings: order.totalPrice }
      });
    }

    order.status = req.body.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
