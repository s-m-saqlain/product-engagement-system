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
    <div className="mt-4">
      <h4 className="text-center text-lg mb-2">Reviews</h4>
      <form onSubmit={handleReviewSubmit} className="mb-4">
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="p-2 border rounded mr-2"
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
          className="p-2 border rounded w-1/2"
        />
        <button
          type="submit"
          className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {editingReviewId ? 'Update Review' : 'Submit Review'}
        </button>
      </form>
      <div>
        {reviews.map((review) => (
          <div key={review._id} className="border-b py-2">
            <p>
              {review.rating} Stars - {review.comment}
            </p>
            <p className="text-sm text-gray-600">By {review.userId.email}</p>
            {user._id === review.userId._id && (
              <div className="mt-1">
                <button
                  onClick={() => handleEdit(review)}
                  className="text-blue-500 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;