import API_URL from './api';

const API_BASE_URL = API_URL;

const getAuthToken = () => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

const buildAuthHeaders = (headers = {}) => {
  const token = getAuthToken();

  if (!token) {
    return headers;
  }

  return {
    ...headers,
    Authorization: `Bearer ${token}`
  };
};

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...buildAuthHeaders(options.headers || {})
    },
    ...options
  });

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => '');

  if (!response.ok) {
    const message = typeof result === 'string' ? result : (result.message || 'The server could not complete the request.');
    const error = new Error(message);
    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const getCurrentUser = async () => {
  return request('/users/profile');
};

export const updateProfile = async (profileData, files = []) => {
  const formData = new FormData();

  Object.entries(profileData || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  files.forEach((file) => {
    formData.append(file.fieldName || 'image', file, file.name);
  });

  return request('/users/profile', {
    method: 'PUT',
    body: formData
  });
};

export const getVerificationStatus = async () => {
  return request('/users/verification-status');
};

export const resubmitDocument = async (file) => {
  const formData = new FormData();
  formData.append('ninDocument', file, file.name);

  return request('/users/resubmit-document', {
    method: 'PUT',
    body: formData
  });
};

export const getMyWallet = async () => {
  return request('/users/wallet');
};

export const getMyBankAccounts = async () => {
  return request('/users/bank-accounts');
};

export const requestWithdrawal = async (amount) => {
  return request('/users/withdrawals', {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
};

export const addBankAccount = async (bankAccountData) => {
  return request('/users/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(bankAccountData)
  });
};

export const deleteBankAccount = async (accountId) => {
  return request(`/users/bank-accounts/${accountId}`, {
    method: 'DELETE'
  });
};

export default {
  getCurrentUser,
  updateProfile,
  getVerificationStatus,
  resubmitDocument,
  getMyWallet,
  getMyBankAccounts,
  requestWithdrawal,
  addBankAccount,
  deleteBankAccount
};
