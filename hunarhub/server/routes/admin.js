const router = require('express').Router();
const Entrepreneur = require('../models/Entrepreneur');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Middleware: admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access only' });
  next();
};

// Get platform stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [users, entrepreneurs, requests, products] = await Promise.all([
      User.countDocuments(),
      Entrepreneur.countDocuments(),
      ServiceRequest.countDocuments(),
      Product.countDocuments()
    ]);
    res.json({ users, entrepreneurs, requests, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all entrepreneurs (including unverified)
router.get('/entrepreneurs', auth, adminOnly, async (req, res) => {
  try {
    const list = await Entrepreneur.find().populate('user', 'name email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify / unverify entrepreneur
router.put('/verify/:id', auth, adminOnly, async (req, res) => {
  try {
    const updated = await Entrepreneur.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all service requests
router.get('/requests', auth, adminOnly, async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate('customer', 'name email')
      .populate('entrepreneur', 'businessName');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a user
router.delete('/user/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
