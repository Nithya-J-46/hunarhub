const router = require('express').Router();
const ServiceRequest = require('../models/ServiceRequest');
const auth = require('../middleware/auth');

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

module.exports = router;
