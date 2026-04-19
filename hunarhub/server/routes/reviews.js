const router = require('express').Router();
const Review = require('../models/Review');
const Entrepreneur = require('../models/Entrepreneur');
const auth = require('../middleware/auth');

// Get reviews for entrepreneur
router.get('/:entrepreneurId', async (req, res) => {
  try {
    const reviews = await Review.find({ entrepreneur: req.params.entrepreneurId })
      .populate('customer', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a review
router.post('/', auth, async (req, res) => {
  try {
    const { entrepreneur, rating, comment } = req.body;
    const review = await Review.create({ customer: req.user.id, entrepreneur, rating, comment });

    // Update entrepreneur's average rating
    const reviews = await Review.find({ entrepreneur });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Entrepreneur.findByIdAndUpdate(entrepreneur, { rating: avg.toFixed(1), totalReviews: reviews.length });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
