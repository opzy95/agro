import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import { resendVerificationCode, verifyEmail } from '../services/authService';
import './VerifyAccount.css';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState(state?.email || '');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMessage('');

    try {
      setIsSubmitting(true);
      await verifyEmail({ email, code: verificationCode });
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrorMessage('Enter your email address before requesting a new code.');
      return;
    }

    setMessage('');
    setErrorMessage('');

    try {
      setIsResending(true);
      await resendVerificationCode(email);
      setVerificationCode('');
      setMessage('A new verification code has been sent to your email.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to send a new verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="verify-account-container">
      <div className="verify-account-panel">
        <div className="verify-account-logo">
          <span className="verify-account-logo-icon">🚜</span>
          <span>HarvestHub</span>
        </div>

        <div className="verify-account-icon">✉</div>
        <h1>Verify your account</h1>
        <p className="verify-account-subtitle">
          Enter the 6-digit code sent to{email ? ` ${email}` : ' your email address'}.
        </p>

        {!email && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        )}

        <form onSubmit={handleSubmit} className="verify-account-form">
          <label htmlFor="verificationCode">Verification code</label>
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            autoComplete="one-time-code"
            required
          />
          {message && <p className="verify-account-message" role="status">{message}</p>}
          {errorMessage && <p className="verify-account-error" role="alert">{errorMessage}</p>}
          <button type="submit" className="verify-account-button" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify account'}
          </button>
        </form>

        <button type="button" className="verify-account-resend-button" onClick={handleResend} disabled={isResending}>
          {isResending ? 'Sending...' : 'Resend verification email'}
        </button>

        <button type="button" className="verify-account-login-link" onClick={() => navigate(ROUTES.LOGIN)}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyAccount;