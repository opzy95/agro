import API_URL from './api';

export const testBackendConnection = async () => {
  try {
    const healthPath = import.meta.env.VITE_API_HEALTH_PATH || '/';
    const response = await fetch(`${API_URL}${healthPath}`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json().catch(() => ({}));

    console.log('Backend connected:', data);

    return true;
  } catch (error) {
    console.warn('Backend health check failed:', error.message);
    return false;
  }
};