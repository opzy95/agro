import API_URL from './api';

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const request = async (path, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || 'The wishlist request failed.');
    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const getWishlist = async () => request('/wishlist');

export const addToWishlist = async (productId) => request('/wishlist', {
  method: 'POST',
  body: JSON.stringify({ productId })
});

export const checkWishlist = async (productId) => request(`/wishlist/check/${productId}`);

export const removeFromWishlist = async (productId) => request(`/wishlist/${productId}`, {
  method: 'DELETE'
});

export const clearWishlist = async () => request('/wishlist', {
  method: 'DELETE'
});

export default {
  getWishlist,
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
  clearWishlist
};
