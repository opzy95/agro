import API_URL from './api';

const getAuthToken = () => localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

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
    throw new Error(result.message || 'Unable to load admin data.');
  }
  return result;
};

export const getAdminOverview = () => request('/admin/overview');
export const getAdminProducts = () => request('/admin/products');
export const getAdminOrders = () => request('/admin/orders');
export const getAdminUsers = () => request('/admin/users');
export const getAdminUserProfile = (userId) => request(`/admin/users/${userId}`);
export const getAdminFinancials = (range) => request(`/admin/financials?range=${encodeURIComponent(range)}`);
export const getAdminSettings = () => request('/admin/settings');
export const updateAdminSettings = (settings) => request('/admin/settings', {
  method: 'PUT',
  body: JSON.stringify(settings)
});
export const updateAdminOrderStatus = (orderId, status) => request(`/admin/orders/${orderId}/status`, {
  method: 'PUT',
  body: JSON.stringify({ status })
});
export const updateAdminUserVerification = (userId, action) => request(`/admin/farmers/${userId}/verify`, {
  method: 'PUT',
  body: JSON.stringify({ action })
});

export default {
  getAdminOverview,
  getAdminProducts,
  getAdminOrders,
  getAdminUsers,
  getAdminUserProfile,
  getAdminFinancials,
  getAdminSettings,
  updateAdminSettings,
  updateAdminOrderStatus,
  updateAdminUserVerification
};
