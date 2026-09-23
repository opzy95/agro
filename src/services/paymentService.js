import API_URL from './api';

const getAuthToken = () => {
  return (
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken')
  );
};

export const initializeOrderPayment = async (orderData) => {
  const token = getAuthToken();

  console.log('[PaymentService] Sending payment initialization request', {
    itemCount: orderData.items?.length,
    amount: orderData.deliveryFee,
    hasShippingAddress: Boolean(orderData.shippingAddress),
    hasAuthToken: Boolean(token)
  });

  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json().catch(() => ({}));

  console.log('[PaymentService] Payment initialization response', {
    status: response.status,
    ok: response.ok,
    message: result.message,
    authorizationUrl:
      result.payment?.authorizationUrl || result.authorizationUrl,
    reference: result.payment?.reference || result.reference
  });

  if (!response.ok) {
    const error = new Error(
      result.message || 'Unable to initialize payment.'
    );

    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const verifyOrderPayment = async (reference) => {
  const token = getAuthToken();

  console.log('[PaymentService] Sending payment verification request', {
    reference,
    hasAuthToken: Boolean(token)
  });

  const response = await fetch(
    `${API_URL}/orders/payment/verify`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reference })
    }
  );

  const result = await response.json().catch(() => ({}));

  console.log('[PaymentService] Payment verification response', {
    status: response.status,
    ok: response.ok,
    message: result.message,
    hasOrder: Boolean(result.order)
  });

  if (!response.ok) {
    const error = new Error(
      result.message || 'Unable to verify payment.'
    );

    Object.assign(error, result);
    throw error;
  }

  return result;
};

export const initializePayment = initializeOrderPayment;
export const verifyPayment = verifyOrderPayment;