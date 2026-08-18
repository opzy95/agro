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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
    // Handle password reset logic here
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
                        placeholder="farmer@harvesthub.com"
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
                <div className="success-icon">📧</div>
                <h3>Check Your Email</h3>
                <p className="form-subtitle">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your email and follow the instructions to reset your password.
                </p>
                
                <div className="success-actions">
                  <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="reset-btn">
                    Back to Login
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => setIsSubmitted(false)} 
                    className="try-again-link"
                  >
                    Try another email
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;