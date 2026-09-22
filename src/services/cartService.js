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
    const error = new Error(result.message || 'The server could not complete the cart request.');
    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const getCart = async () => request('/cart');

export const addToCart = async (productId, quantity = 1) => {
  return request('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity })
  });
};

export const updateCartItem = async (productId, quantity) => {
  return request(`/cart/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  });
};

export const removeFromCart = async (productId) => {
  return request(`/cart/${productId}`, { method: 'DELETE' });
};

export const clearCart = async () => request('/cart/clear', { method: 'DELETE' });

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};