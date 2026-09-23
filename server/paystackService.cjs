const PAYSTACK_API_URL = 'https://api.paystack.co';

const getSecretKey = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    const error = new Error('Paystack is not configured. Set PAYSTACK_SECRET_KEY.');
    error.statusCode = 500;
    throw error;
  }

  return process.env.PAYSTACK_SECRET_KEY;
};

const requestPaystack = async (path, options = {}) => {
  const response = await fetch(`${PAYSTACK_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.status) {
    const error = new Error(result.message || 'Paystack request failed');
    error.statusCode = 502;
    throw error;
  }

  return result.data;
};

const initializeTransaction = ({ email, amount, metadata }) =>
  (() => {
    const callbackUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/callback`;

    console.log('[Paystack] Initializing transaction', {
      email,
      amount,
      callbackUrl,
      hasMetadata: Boolean(metadata)
    });

    return requestPaystack('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      currency: 'NGN',
      callback_url: callbackUrl,
      metadata
    })
    }).then((payment) => {
      console.log('[Paystack] Transaction initialized', {
        reference: payment.reference,
        authorizationUrl: payment.authorization_url,
        accessCode: payment.access_code ? '[present]' : '[missing]'
      });

      return payment;
    });
  })();

const verifyTransaction = async (reference) => {
  console.log('[Paystack] Verifying transaction', { reference });

  const payment = await requestPaystack(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );

  console.log('[Paystack] Transaction verification result', {
    reference: payment.reference,
    status: payment.status,
    amount: payment.amount,
    currency: payment.currency
  });

  return payment;
};

module.exports = {
  initializeTransaction,
  verifyTransaction
};