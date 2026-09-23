import API_URL from './api';

const API_BASE_URL = API_URL;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(result.message || 'The server could not complete the request.');
    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const login = async ({ email, password, rememberMe }) => {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (result.token) {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', result.token);

    if (result.user) {
      storage.setItem('user', JSON.stringify(result.user));
    }
  }

  return result;
};

export const register = async ({ userType, ...registrationData }) => {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ role: userType, ...registrationData })
  });
};

export const verifyEmail = async ({ email, code }) => {
  return request('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
};

export const resendVerificationCode = async (email) => {
  return request('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

export const requestPasswordReset = async (email) => {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
};

export const resetPassword = async ({ email, code, password, confirmPassword }) => {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, password, confirmPassword })
  });
};

export const logout = () => {
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
};
