const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const wishlist = new Wishlist({ userId: req.user.id, productId });
    await wishlist.save();
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(400).json({ message: 'Error adding to wishlist' });
  }
});

router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    await Wishlist.deleteOne({ userId: req.user.id, productId });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(400).json({ message: 'Error removing from wishlist' });
  }
});

module.exports = router;