import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  apiClient.defaults.headers['Authorization'] = token ? `Bearer ${token}` : '';
};

export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const register = (email, password) => {
  return apiClient.post('/auth/register', { email, password });
};

export const getUser = (token) => {
  setAuthToken(token);
  return apiClient.get('/auth/me');
};

export const getProducts = (token, ratingFilter) => {
  setAuthToken(token);
  return apiClient.get(`/products?rating=${ratingFilter}`);
};

export const addToWishlist = (token, productId) => {
  setAuthToken(token);
  return apiClient.post('/wishlist/add', { productId });
};

export const removeFromWishlist = (token, productId) => {
  setAuthToken(token);
  return apiClient.post('/wishlist/remove', { productId });
};

export const getReviews = (token, productId) => {
  setAuthToken(token);
  return apiClient.get(`/reviews/${productId}`);
};

export const addReview = (token, { productId, rating, comment }) => {
  setAuthToken(token);
  return apiClient.post('/reviews', { productId, rating, comment });
};

export const updateReview = (token, reviewId, { rating, comment }) => {
  setAuthToken(token);
  return apiClient.put(`/reviews/${reviewId}`, { rating, comment });
};

export const deleteReview = (token, reviewId) => {
  setAuthToken(token);
  return apiClient.delete(`/reviews/${reviewId}`);
};

export const getAllReviews = (token) => {
  setAuthToken(token);
  return apiClient.get('/reviews');
};

export const moderateReview = (token, reviewId, action) => {
  setAuthToken(token);
  return apiClient.put(`/reviews/moderate/${reviewId}`, { action });
};

export default apiClient;