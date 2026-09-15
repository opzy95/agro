import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import './ForgotPassword.css';

// Import your background images
import backgroundImage from '../assets/Background Image.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setIsSubmitted(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(verificationCode)) {
      setResetError('Enter the 6-digit code sent to your email.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    console.log('Password reset completed for:', email);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-left">
        <div className="forgot-password-background" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="forgot-password-content">
            <h2>Forgot Your Password?</h2>
            <p>No worries. Enter your email address and we'll send you a secure link to reset your password.</p>
            
            <div className="forgot-password-features">
              <div className="forgot-password-feature">
                <span className="feature-icon">🔒</span>
                <span>Secure Password Reset</span>
              </div>
              <div className="forgot-password-feature">
                <span className="feature-icon">⚡</span>
                <span>Quick Recovery</span>
              </div>
              <div className="forgot-password-feature">
                <span className="feature-icon">✓</span>
                <span>Your Account is Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="forgot-password-right">
        <div className="forgot-password-form">
          <div className="form-header">
            <div className="logo">
              <span className="logo-text">HarvestHub</span>
            </div>
            
            {!isSubmitted ? (
              <>
                <h3>Reset Your Password</h3>
                <p className="form-subtitle">
                  Enter the email associated with your account and we'll send an email with instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <span className="input-icon">✉</span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // placeholder="farmer@harvesthub.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Send Reset Link Button */}
                  <button type="submit" className="reset-btn">
                    Send Reset Link
                  </button>

                  {/* Back to Login */}
                  <div className="back-to-login">
                    <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="back-link">
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="success-icon">🔐</div>
                <h3>Reset Your Password</h3>
                <p className="form-subtitle">
                  Enter the 6-digit code sent to <strong>{email}</strong>, then create a new password.
                </p>

                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label htmlFor="verificationCode">Verification Code</label>
                    <div className="input-wrapper">
                      {/* <span className="input-icon">#</span> */}
                      <input
                        type="text"
                        id="verificationCode"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                          setResetError('');
                        }}
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-wrapper">
                      {/* <span className="input-icon">●</span> */}
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setResetError('');
                        }}
                        placeholder="Enter new password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper">
                      {/* <span className="input-icon">●</span> */}
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setResetError('');
                        }}
                        placeholder="Confirm new password"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  {resetError && <p className="form-error">{resetError}</p>}

                  <button type="submit" className="reset-btn">
                    Save New Password
                  </button>

                  <div className="back-to-login">
                    <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="back-link">
                      ← Back to Login
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;