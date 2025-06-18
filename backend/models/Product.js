const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);