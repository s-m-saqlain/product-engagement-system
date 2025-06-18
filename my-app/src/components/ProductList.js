import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts, addToWishlist, removeFromWishlist } from '../services/api';
import ReviewSection from './ReviewSection';

function ProductList() {
  const { token, user } = useContext(AuthContext); // Fixed: Use AuthContext for user
  const [products, setProducts] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [ratingFilter, token]); // Added token to dependencies

  const fetchProducts = async () => { // Fixed: Correct function declaration
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
    <div className="container mx-auto p-6">
      <h2 className="text-center text-2xl mb-4">Products</h2>
      <select
        onChange={(e) => setRatingFilter(Number(e.target.value))}
        className="mb-4 p-2 border rounded" // Fixed: Removed redundant p-4
      >
        <option value="0">All Ratings</option>
        <option value="1">1+ Stars</option>
        <option value="2">2+ Stars</option>
        <option value="3">3+ Stars</option> {/* Fixed: Corrected value */}
        <option value="4">4+ Stars</option>
        <option value="5">5 Stars</option>
      </select>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h3 className="text-xl">{product.name}</h3>
            <p>
              Average Rating: {product.averageRating.toFixed(2)} ({product.reviews.length} reviews)
            </p>
            <button
              onClick={() => handleWishlist(product._id, product.isWishlisted)}
              className={`mt-2 w-full text-white p-2 rounded ${
                product.isWishlisted
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`} // Fixed: Simplified and consistent classes
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