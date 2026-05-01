const router = require('express').Router();
const Entrepreneur = require('../models/Entrepreneur');
const auth = require('../middleware/auth');

// Get all verified entrepreneurs (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, location, skills, pricing } = req.query;
    let query = { isVerified: true };
    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (skills) query.skills = new RegExp(skills, 'i');
    if (pricing) query.pricing = new RegExp(pricing, 'i');
    const list = await Entrepreneur.find(query).populate('user', 'name email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single entrepreneur
router.get('/:id', async (req, res) => {
  try {
    const e = await Entrepreneur.findById(req.params.id).populate('user', 'name email');
    if (!e) return res.status(404).json({ error: 'Not found' });
    res.json(e);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get entrepreneur profile by user id
router.get('/by-user/:userId', auth, async (req, res) => {
  try {
    const e = await Entrepreneur.findOne({ user: req.params.userId });
    res.json(e);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create entrepreneur profile
router.post('/', auth, async (req, res) => {
  try {
    const profile = await Entrepreneur.create({ ...req.body, user: req.user.id });
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update entrepreneur profile
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Entrepreneur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
