import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllReviews, moderateReview } from '../services/api';

function AdminPanel() {
    const { token } = useContext(AuthContext);
    const [reviews, setReviews ] = useState([]);

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
        <div className="container mx-auto p-6">
            <h2 className="text-2xl mb-4">Admin Review Moderation</h2>
            <div>
                {reviews.map((review) => (
                    <div key={review._id} className="border p-4 mb-2 rounded flex justify-between">
                        <div>
                            <p>{review.rating} Stars - {review.comment}</p>
                            <p className="text-gray-600 text-sm">Product: {review.productId.name}</p>
                            <p className="text-gray-600 text-sm">By: {review.userId.email}</p>
                            <p className="text-gray-600 text-sm">Status: {review.status}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => handleModerate(review._id, 'approve')}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-600 mr-2"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleModerate(review._id, 'reject')}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-600"
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