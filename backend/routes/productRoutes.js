const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rating = Number(req.query.rating) || 0;
    const userId = req.user.id;
    const products = await Product.find().lean();
    for (let product of products) {
      const reviews = await Review.find({ productId: product._id, status: 'approved' });
      product.reviews = reviews;
      product.averageRating = reviews.length
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      product.isWishlisted = await Wishlist.exists({ userId, productId: product._id });
    }
    const filteredProducts = products.filter((p) => p.averageRating >= rating);
    res.json(filteredProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;