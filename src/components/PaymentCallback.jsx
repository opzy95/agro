import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOrderPayment } from '../services/paymentService';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const reference = params.get('reference') || params.get('trxref');

      console.log('[PaymentCallback] Loaded', {
        url: window.location.href,
        query: location.search,
        reference,
        hasAuthToken: Boolean(
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken')
        )
      });

      if (!reference) {
        setStatus('failed');
        setError('Payment reference was not found.');
        return;
      }

      try {
        const result = await verifyOrderPayment(reference);

        console.log('[PaymentCallback] Verification succeeded', {
          message: result.message,
          hasOrder: Boolean(result.order),
          orderId: result.order?._id
        });

        setStatus('success');

        // Redirect to your order success/orders page
        // after the backend has created the order.
        setTimeout(() => {
          navigate('/customer/orders');
        }, 1500);

      } catch (error) {
        console.error('[PaymentCallback] Verification failed', {
          message: error.message,
          status: error.status,
          response: error.response
        });

        setStatus('failed');
        setError(
          error.message || 'We could not verify your payment.'
        );
      }
    };

    verifyPayment();
  }, [location.search, navigate]);

  if (status === 'verifying') {
    return (
      <div>
        <h2>Verifying your payment...</h2>
        <p>Please wait while we confirm your payment.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div>
        <h2>Payment verification failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Payment successful!</h2>
      <p>Your order has been created.</p>
    </div>
  );
};

export default PaymentCallback;