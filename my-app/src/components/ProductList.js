import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts, addToWishlist, removeFromWishlist } from '../services/api';
import ReviewSection from './ReviewSection';

function ProductList() {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [ratingFilter, token]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts(token, ratingFilter);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleWishlist = async (productId, isWishlisted) => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(token, productId);
      } else {
        await addToWishlist(token, productId);
      }
      fetchProducts();
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Products</h2>
      <div className="mb-6">
        <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Rating
        </label>
        <select
          id="rating-filter"
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="0">All Ratings</option>
          <option value="1">1+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4">
              Average Rating: {product.averageRating.toFixed(2)} ({product.reviews.length} reviews)
            </p>
            <button
              onClick={() => handleWishlist(product._id, product.isWishlisted)}
              className={`w-full p-3 rounded-lg font-semibold text-white transition duration-300 ${
                product.isWishlisted
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {product.isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <ReviewSection
              productId={product._id}
              token={token}
              user={user}
              fetchProducts={fetchProducts}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;