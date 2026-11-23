import API_URL from './api';
import { ROUTES } from '../routes/routeUtils';

let refreshPromise = null;

const getTokenStorage = () => {
  if (localStorage.getItem('authToken')) return localStorage;
  if (sessionStorage.getItem('authToken')) return sessionStorage;
  return null;
};

export const getAccessToken = () => getTokenStorage()?.getItem('authToken') || null;

export const getRefreshToken = () => (
  localStorage.getItem('refreshToken') ||
  sessionStorage.getItem('refreshToken') ||
  null
);

export const saveAuthTokens = ({ token, refreshToken }, rememberMe = false) => {
  if (typeof token !== 'string' || !token || typeof refreshToken !== 'string' || !refreshToken) {
    throw new Error('The server returned an incomplete authentication session.');
  }

  clearAuthTokens();
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem('authToken', token);
  storage.setItem('refreshToken', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('refreshToken');
};

const redirectToLogin = () => {
  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.assign(ROUTES.LOGIN);
  }
};

const refreshAccessToken = async (rejectedToken) => {
  const currentToken = getAccessToken();
  if (currentToken && currentToken !== rejectedToken) {
    return currentToken;
  }

  if (!refreshPromise) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      redirectToLogin();
      throw new Error('Your session has expired. Please log in again.');
    }

    refreshPromise = (async () => {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(result.message || 'Unable to refresh your session.');
        error.status = response.status;

        if (response.status === 401 && getRefreshToken() === refreshToken) {
          clearAuthTokens();
          redirectToLogin();
        }

        throw error;
      }

      if (getRefreshToken() !== refreshToken) {
        throw new Error('Your session changed while it was being refreshed.');
      }

      saveAuthTokens(result, Boolean(getTokenStorage() === localStorage));
      return result.token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

export const authenticatedFetch = async (input, options = {}) => {
  const token = getAccessToken();
  const send = (accessToken) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return fetch(input, { ...options, headers });
  };

  const response = await send(token);
  if (response.status !== 401 || !token) {
    return response;
  }

  const currentToken = getAccessToken();
  const refreshedToken = currentToken && currentToken !== token
    ? currentToken
    : await refreshAccessToken(token);

  return send(refreshedToken);
};
