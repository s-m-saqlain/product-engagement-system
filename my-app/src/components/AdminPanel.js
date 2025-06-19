import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllReviews, moderateReview } from '../services/api';

function AdminPanel() {
  const { token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await getAllReviews(token);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleModerate = async (reviewId, action) => {
    try {
      await moderateReview(token, reviewId, action);
      fetchReviews();
    } catch (err) {
      console.error('Error moderating review:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Review Moderation</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-gray-800">
                <span className="font-semibold">{review.rating} Stars</span> - {review.comment}
              </p>
              <p className="text-sm text-gray-600">Product: {review.productId.name}</p>
              <p className="text-sm text-gray-600">By: {review.userId.email}</p>
              <p className="text-sm text-gray-600">
                Status: <span className="capitalize">{review.status}</span>
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleModerate(review._id, 'approved')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Approve
              </button>
              <button
                onClick={() => handleModerate(review._id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;