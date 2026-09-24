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
    const error = new Error(result.message || 'The server could not complete the order request.');
    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const createOrder = async ({ items, deliveryMethod, shippingAddress, deliveryFee = 0 }) => {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ items, deliveryMethod, shippingAddress, deliveryFee })
  });
};

export const getMyOrders = async () => {
  return request('/orders/my');
};

export const getFarmerOrders = async () => {
  return request('/orders/farmer');
};

export const updateOrderStatus = async (orderId, productId, status) => {
  return request(`/orders/${orderId}/item-status`, {
    method: 'PUT',
    body: JSON.stringify({
      productId,
      status: String(status).toLowerCase()
    })
  });
};

export const getOrderById = async (orderId) => {
  return request(`/orders/${orderId}`);
};

export const cancelOrder = async (orderId) => {
  return request(`/orders/${orderId}/cancel`, { method: 'PUT' });
};

export const confirmOrderReceived = async (orderId, productId) => {
  return request(`/orders/${orderId}/confirm-delivery`, {
    method: 'PUT',
    body: JSON.stringify({
      productId,
      status: 'processing'
    })
  });
};

export default {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  confirmOrderReceived
};