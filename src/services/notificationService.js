import API_URL from './api';
import { authenticatedFetch } from './authenticatedFetch';

const request = async (path, options = {}) => {
  const response = await authenticatedFetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
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
