import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser, updateProfile } from '../../services/userService';
import './CustomerSettings.css';

const CustomerSettings = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImage: null,
    language: 'English (US)',
    currency: 'USD ($)'
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    marketing: false,
    securityAlerts: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const profileImageInputRef = useRef(null);

  useEffect(() => {
    const fetchCustomerProfile = async () => {
      try {
        const response = await getCurrentUser();
        const user = response?.user || response?.data?.user || response?.data || response || {};

        setFormData((currentData) => ({
          ...currentData,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          profileImage: typeof user.profileImage === 'string'
            ? user.profileImage
            : user.profileImage?.url || user.profileImage?.secure_url || null
        }));
      } catch (error) {
        console.error('Failed to fetch customer profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);

    try {
      const files = profileImageFile ? [{
        fieldName: 'image',
        file: profileImageFile
      }] : [];

      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email
      }, files.map(({ fieldName, file }) => Object.assign(file, { fieldName })));
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Failed to save customer profile:', error);
      alert(error.message || 'Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePhoto = () => {
    profileImageInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((currentData) => ({ ...currentData, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="customer-settings">
      <div className="settings-content">
        {/* Profile Information Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Profile Information</h2>
            <p className="section-subtitle">Update your photo and personal details here.</p>
          </div>

          <div className="profile-form">
            {isLoading && <p className="section-subtitle">Loading your profile...</p>}
            {/* Profile Photo */}
            <div className="photo-section">
              <div className="current-photo">
                {formData.profileImage ? (
                  <img src={formData.profileImage} alt="Profile" className="customer-profile-image" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="photo-icon">📷</span>
                  </div>
                )}
              </div>
              <input
                ref={profileImageInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="customer-photo-input"
              />
              <button type="button" className="change-photo-btn" onClick={handleChangePhoto}>
                Change Photo
              </button>
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input with-icon"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <span className="input-icon">📞</span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input with-icon"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="form-actions">
              <button className="save-btn" onClick={handleSaveChanges} disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Account Preferences Section */}
        <div className="settings-section">
          <div className="section-header">
            <h2 className="section-title">Account Preferences</h2>
          </div>

          <div className="preferences-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                  <option value="GBP (£)">GBP (£)</option>
                  <option value="CAD (C$)">CAD (C$)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="settings-sidebar">
        {/* Notifications Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Notifications</h3>
          
          <div className="notification-item">
            <div className="notification-info">
              <h4 className="notification-name">Order Updates</h4>
              <p className="notification-desc">Email and SMS notifications.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.orderUpdates}
                onChange={() => handleNotificationChange('orderUpdates')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4 className="notification-name">Marketing</h4>
              <p className="notification-desc">Promotions and news via email.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={() => handleNotificationChange('marketing')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notification-item">
            <div className="notification-info">
              <h4 className="notification-name">Security Alerts</h4>
              <p className="notification-desc">Push notifications for security events.</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationChange('securityAlerts')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="sidebar-section">
          <h3 className="sidebar-title">Security</h3>
          
          <div className="security-item">
            <div className="security-icon">🔒</div>
            <div className="security-info">
              <h4 className="security-name">Change Password</h4>
              <p className="security-desc">Last changed 3 months ago</p>
            </div>
            <button className="security-action">›</button>
          </div>

          <div className="security-item">
            <div className="security-icon">🔐</div>
            <div className="security-info">
              <h4 className="security-name">Two-Factor Auth</h4>
              <p className="security-desc">Enabled</p>
            </div>
            <button className="security-action">›</button>
          </div>

          <div className="security-item">
            <div className="security-icon">📱</div>
            <div className="security-info">
              <h4 className="security-name">Active Sessions</h4>
              <p className="security-desc">Manage logged in devices</p>
            </div>
            <button className="security-action">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;