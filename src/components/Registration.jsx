import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import './Registration.css';

const Registration = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    receiveMarketing: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    console.log('Registration data:', { userType, ...formData });
    
    // Simulate successful registration - replace with actual registration logic
    // For now, we'll just navigate to dashboard immediately
    // In real app, you'd send registration data to server first
    
    // Redirect to customer dashboard on successful registration
    navigate('/customer/dashboard');
  };

  return (
    <div className="registration-container">
      <div className="registration-left">
        <div className="registration-info">
          <h2>Join the HarvestHub Community</h2>
          <p>
            Connect with trusted farmers, discover fresh agricultural 
            products, or grow your business by selling directly to 
            customers.
          </p>
          
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🌱</span>
              <span>Fresh Farm Produce</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Verified Sellers</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure Transactions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="registration-right">
        <div className="registration-form">
          <div className="form-header">
            <div className="logo">
              <span className="logo-icon">🚜</span>
              <span className="logo-text">HarvestHub</span>
            </div>
            <h3>Create Your Account</h3>
          </div>

          {/* User Type Selection */}
          <div className="user-type-selection">
            <div 
              className={`user-type-card ${userType === 'customer' ? 'selected' : ''}`}
              onClick={() => setUserType('customer')}
            >
              <div className="user-type-icon">🛒</div>
              <div className="user-type-content">
                <h4>Customer</h4>
                <p>Buy fresh produce directly.</p>
              </div>
              {userType === 'customer' && <div className="selected-indicator">✓</div>}
            </div>
            
            <div 
              className={`user-type-card ${userType === 'farmer' ? 'selected' : ''}`}
              onClick={() => setUserType('farmer')}
            >
              <div className="user-type-icon">🚜</div>
              <div className="user-type-content">
                <h4>Farmer / Seller</h4>
                <p>Sell your agricultural products.</p>
              </div>
              {userType === 'farmer' && <div className="selected-indicator">✓</div>}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jane"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg className="eye-icon eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg className="eye-icon eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                />
                <span className="checkbox-custom"></span>
                I agree to the <a href="#terms" className="link">Terms of Service</a> and <a href="#privacy" className="link">Privacy Policy</a>.
              </label>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="receiveMarketing"
                  checked={formData.receiveMarketing}
                  onChange={handleInputChange}
                />
                <span className="checkbox-custom"></span>
                I want to receive marketing emails and harvest updates. (Optional)
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="create-account-btn">
              Create Account →
            </button>

            {/* Social Login */}
            <div className="social-login">
              <div className="divider">
                <span>OR CONTINUE WITH</span>
              </div>
              
              <div className="social-buttons">
                <button type="button" className="social-btn google-btn">
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                
                <button type="button" className="social-btn apple-btn">
                  <svg className="social-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="sign-in-link">
              Already have an account? <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="link-btn">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;