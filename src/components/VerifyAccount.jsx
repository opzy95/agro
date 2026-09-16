import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import './VerifyAccount.css';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Account verification requested:', {
      email: state?.email,
      verificationCode
    });
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
          Enter the 6-digit code sent to{state?.email ? ` ${state.email}` : ' your email address'}.
        </p>

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
          <button type="submit" className="verify-account-button">
            Verify account
          </button>
        </form>

        <button type="button" className="verify-account-login-link" onClick={() => navigate(ROUTES.LOGIN)}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyAccount;