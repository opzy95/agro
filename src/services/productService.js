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

const formatProductPayload = (productData = {}) => {
  const payload = { ...productData };

  if (payload.shippingMethods && typeof payload.shippingMethods === 'string') {
    try {
      payload.shippingMethods = JSON.parse(payload.shippingMethods);
    } catch (error) {
      payload.shippingMethods = [payload.shippingMethods];
    }
  }

  if (payload.price !== undefined && payload.price !== null && typeof payload.price !== 'number') {
    payload.price = Number(payload.price);
  }

  if (payload.availableQuantity !== undefined && payload.availableQuantity !== null && typeof payload.availableQuantity !== 'number') {
    payload.availableQuantity = Number(payload.availableQuantity);
  }

  if (payload.minimumOrderQuantity !== undefined && payload.minimumOrderQuantity !== null && typeof payload.minimumOrderQuantity !== 'number') {
    payload.minimumOrderQuantity = Number(payload.minimumOrderQuantity);
  }

  return payload;
};

export const getProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return request(`/products${queryString ? `?${queryString}` : ''}`);
};

export const getProductById = async (id) => {
  return request(`/products/${id}`);
};

export const getMyProducts = async () => {
  return request('/products/my');
};

export const createProduct = async (productData, files = []) => {
  const payload = formatProductPayload(productData);

  if (files.length > 0 || payload.image || payload.productImages) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    files.forEach((file, index) => {
      formData.append('images', file, file.name || `product-${index}.jpg`);
    });

    if (payload.image && typeof payload.image !== 'string' && !(payload.image instanceof File)) {
      formData.append('image', payload.image);
    }

    return request('/products', {
      method: 'POST',
      body: formData
    });
  }

  return request('/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const updateProduct = async (id, productData, files = []) => {
  const payload = formatProductPayload(productData);

  if (files.length > 0 || payload.image || payload.productImages) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value) || typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
        return;
      }

      formData.append(key, String(value));
    });

    files.forEach((file, index) => {
      formData.append('images', file, file.name || `product-${index}.jpg`);
    });

    return request(`/products/${id}`, {
      method: 'PUT',
      body: formData
    });
  }

  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
};

export const deleteProduct = async (id) => {
  return request(`/products/${id}`, {
    method: 'DELETE'
  });
};

export default {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
};
