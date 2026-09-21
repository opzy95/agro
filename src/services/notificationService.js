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
    throw new Error(result.message || 'The notification request failed.');
  }

  return result;
};

export const getMyNotifications = async () => request('/notifications');

export const markNotificationAsRead = async (notificationId) => request(`/notifications/${notificationId}/read`, {
  method: 'PATCH'
});

export const markAllNotificationsAsRead = async () => request('/notifications/read-all', {
  method: 'PATCH'
});

export default {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
