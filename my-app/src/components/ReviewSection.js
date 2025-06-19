import { useState, useEffect } from 'react';
import { getReviews, addReview, updateReview, deleteReview } from '../services/api';

function ReviewSection({ productId, token, fetchProducts, user }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getReviews(token, productId);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        await updateReview(token, editingReviewId, { rating, comment });
        setEditingReviewId(null);
      } else {
        await addReview(token, { productId, rating, comment });
      }
      setRating(0);
      setComment('');
      fetchReviews();
      fetchProducts();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview(token, reviewId);
        fetchReviews();
        fetchProducts();
      } catch (err) {
        console.error('Error deleting review:', err);
      }
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Reviews</h4>
      <form onSubmit={handleReviewSubmit} className="space-y-4 mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Select rating"
          >
            <option value="0">Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} Star{r > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Write a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {editingReviewId ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b py-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-800">
                <span className="font-semibold">{review.rating} Stars</span> - {review.comment}
              </p>
              {user._id === review.userId._id && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">By {review.userId.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;