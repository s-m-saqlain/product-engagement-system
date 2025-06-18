const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/:productId', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'email')
      .populate('productId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = new Review({ userId: req.user.id, productId, rating, comment });
    await review.save();
    res.json({ message: 'Review submitted' });
  } catch (err) {
    res.status(400).json({ message: 'Error submitting review' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    await Review.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { rating, comment, status: 'pending' }
    );
    res.json({ message: 'Review updated' });
  } catch (err) {
    res.status(400).json({ message: 'Error updating review' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting review' });
  }
});

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'email')
      .populate('productId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/moderate/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { action } = req.body;
    await Review.findByIdAndUpdate(req.params.id, { status: action });
    res.json({ message: `Review ${action}ed` });
  } catch (err) {
    res.status(400).json({ message: 'Error moderating review' });
  }
});

module.exports = router;