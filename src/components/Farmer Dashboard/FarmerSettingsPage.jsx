import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';
import './FarmerSettingsPage.css';

const FarmerSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [farmInfo, setFarmInfo] = useState({
    firstName: 'Samuel',
    lastName: 'Green',
    farmName: 'Green Valley Farm',
    description: 'Premium Producer',
    location: 'Lagos, Nigeria',
    phone: '+234 801 234 5678',
    email: 'samuel.green@farm.com',
    bio: 'Experienced farmer with over 15 years in sustainable agriculture',
    website: 'www.greenvalleyfarm.ng',
    profileImage: null,
    nin: '12345678901',
    ninDocument: null
  });

  const [bankAccounts, setBankAccounts] = useState([
    {
      id: 1,
      bankName: 'First Bank of Nigeria',
      accountNumber: '3085672341',
      accountName: 'Samuel Green',
      isDefault: true,
      dateAdded: '2023-01-15'
    },
    {
      id: 2,
      bankName: 'Guaranty Trust Bank',
      accountNumber: '0123456789',
      accountName: 'Green Valley Farm Ltd',
      isDefault: false,
      dateAdded: '2023-03-22'
    },
    {
      id: 3,
      bankName: 'United Bank for Africa',
      accountNumber: '2087654321',
      accountName: 'Samuel Green',
      isDefault: false,
      dateAdded: '2023-05-10'
    }
  ]);

  const [newBankAccount, setNewBankAccount] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null
  };

  const tabs = [
    { id: 'profile', label: 'Farm Profile', icon: '👨‍🌾' },
    { id: 'account', label: 'Account Settings', icon: '⚙️' },
    { id: 'banking', label: 'Bank Accounts', icon: '🏦' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  const handleSave = () => {
    console.log('Settings saved:', farmInfo);
    alert('Settings saved successfully!');
  };

  const setDefaultAccount = (accountId) => {
    setBankAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isDefault: account.id === accountId
      }))
    );
  };

  const deleteBankAccount = (accountId) => {
    if (window.confirm('Are you sure you want to remove this bank account?')) {
      setBankAccounts(accounts => accounts.filter(account => account.id !== accountId));
    }
  };

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber && newBankAccount.accountName) {
      const newAccount = {
        id: Date.now(),
        ...newBankAccount,
        isDefault: bankAccounts.length === 0,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setBankAccounts([...bankAccounts, newAccount]);
      setNewBankAccount({ bankName: '', accountNumber: '', accountName: '' });
      setShowAddBankModal(false);
    }
  };

  return (
    <FarmerLayout farmer={farmer} showSearch={true} showNotifications={true}>
      <div style={{ 
        background: '#f9fafb',
        padding: '2rem',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#111827',
            margin: 0
          }}>Settings</h1>
          <p style={{
            color: '#6b7280',
            margin: '0.5rem 0 0 0'
          }}>Manage your farm profile and account preferences</p>
        </div>

        <div className="settings-container">
          {/* Sidebar Tabs */}
          <div className="settings-sidebar">
            <div className="settings-profile-card">
              <div className="profile-avatar-large">
                {farmInfo.profileImage ? (
                  <img src={farmInfo.profileImage} alt="Profile" className="profile-image-displayed" />
                ) : (
                  <span>👨‍🌾</span>
                )}
              </div>
              <input
                type="file"
                id="sidebarProfileImageInput"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFarmInfo({...farmInfo, profileImage: reader.result});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="sidebar-profile-image-input"
              />
              <label htmlFor="sidebarProfileImageInput" className="change-image-button">
                Change Photo
              </label>
              <div className="profile-info">
                <h3>{farmInfo.firstName} {farmInfo.lastName}</h3>
                <p>{farmInfo.farmName}</p>
                <div className="verified-badge">
                  <span className="checkmark">✓</span>
                  Verified Farmer
                </div>
              </div>
            </div>
            
            <nav className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                >
                  <span className="nav-icon">{tab.icon}</span>
                  <span className="nav-label">{tab.label}</span>
                  {activeTab === tab.id && <div className="nav-indicator"></div>}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Farm Profile</h2>
                  <p>Manage your farm information and public profile</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={farmInfo.firstName}
                        onChange={(e) => setFarmInfo({...farmInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={farmInfo.lastName}
                        onChange={(e) => setFarmInfo({...farmInfo, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Farm Name</label>
                    <input
                      type="text"
                      value={farmInfo.farmName}
                      onChange={(e) => setFarmInfo({...farmInfo, farmName: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio/Description</label>
                    <textarea
                      value={farmInfo.bio}
                      onChange={(e) => setFarmInfo({...farmInfo, bio: e.target.value})}
                      rows="4"
                      placeholder="Tell customers about your farm and experience..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={farmInfo.location}
                        onChange={(e) => setFarmInfo({...farmInfo, location: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Website (Optional)</label>
                      <input
                        type="url"
                        value={farmInfo.website}
                        onChange={(e) => setFarmInfo({...farmInfo, website: e.target.value})}
                        placeholder="https://your-farm-website.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>NIN (National Identification Number)</label>
                    <input
                      type="text"
                      value={farmInfo.nin}
                      onChange={(e) => setFarmInfo({...farmInfo, nin: e.target.value})}
                      placeholder="Enter your 11-digit NIN"
                      maxLength="11"
                    />
                    <small style={{ color: '#9ca3af', marginTop: '0.5rem', display: 'block' }}>
                      Your NIN must be 11 digits for verification purposes
                    </small>
                  </div>

                  <div className="form-group">
                    <label>NIN Document (Photo/Image)</label>
                    <div className="document-upload">
                      <div className="document-preview">
                        {farmInfo.ninDocument ? (
                          <>
                            <img src={farmInfo.ninDocument} alt="NIN Document" className="document-image" />
                            <div className="document-overlay">
                              <button 
                                className="change-document-btn"
                                onClick={() => document.getElementById('ninDocumentInput').click()}
                              >
                                Change
                              </button>
                              <button 
                                className="remove-document-btn"
                                onClick={() => setFarmInfo({...farmInfo, ninDocument: null})}
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="document-placeholder">
                              <span>📄</span>
                              <p>No document uploaded</p>
                              <small>Upload a clear image of your NIN</small>
                            </div>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        id="ninDocumentInput"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFarmInfo({...farmInfo, ninDocument: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="document-input"
                      />
                      <label htmlFor="ninDocumentInput" className="upload-document-button">
                        Upload NIN Document
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={farmInfo.phone}
                        onChange={(e) => setFarmInfo({...farmInfo, phone: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={farmInfo.email}
                        onChange={(e) => setFarmInfo({...farmInfo, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={farmInfo.location}
                        onChange={(e) => setFarmInfo({...farmInfo, location: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Website (Optional)</label>
                      <input
                        type="url"
                        value={farmInfo.website}
                        onChange={(e) => setFarmInfo({...farmInfo, website: e.target.value})}
                        placeholder="https://your-farm-website.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'banking' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Bank Accounts</h2>
                  <p>Manage your payment accounts for receiving earnings</p>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowAddBankModal(true)}
                  >
                    <span>+</span> Add Bank Account
                  </button>
                </div>

                <div className="bank-accounts-list">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className={`bank-card ${account.isDefault ? 'default' : ''}`}>
                      <div className="bank-header">
                        <div className="bank-info">
                          <h3>{account.bankName}</h3>
                          <p className="account-number">
                            •••• •••• •••• {account.accountNumber.slice(-4)}
                          </p>
                          <p className="account-name">{account.accountName}</p>
                        </div>
                        <div className="bank-actions">
                          {account.isDefault ? (
                            <span className="default-badge">Default</span>
                          ) : (
                            <button 
                              className="btn-outline"
                              onClick={() => setDefaultAccount(account.id)}
                            >
                              Set as Default
                            </button>
                          )}
                          <button 
                            className="btn-danger-outline"
                            onClick={() => deleteBankAccount(account.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="bank-footer">
                        <span className="date-added">Added {new Date(account.dateAdded).toLocaleDateString()}</span>
                        {account.isDefault && (
                          <span className="primary-account">
                            <span className="checkmark">✓</span>
                            Primary Account
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {bankAccounts.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">🏦</div>
                    <h3>No Bank Accounts Added</h3>
                    <p>Add your first bank account to start receiving payments</p>
                    <button 
                      className="btn-primary"
                      onClick={() => setShowAddBankModal(true)}
                    >
                      Add Your First Account
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Account Settings</h2>
                  <p>Manage your account security and preferences</p>
                </div>
                
                <div className="settings-cards">
                  <div className="settings-card">
                    <div className="card-icon">🔐</div>
                    <div className="card-content">
                      <h3>Password</h3>
                      <p>Update your password to keep your account secure</p>
                      <button className="btn-outline">Change Password</button>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="card-icon">📱</div>
                    <div className="card-content">
                      <h3>Two-Factor Authentication</h3>
                      <p>Add an extra layer of security to your account</p>
                      <button className="btn-outline">Enable 2FA</button>
                    </div>
                  </div>

                  <div className="settings-card">
                    <div className="card-icon">📧</div>
                    <div className="card-content">
                      <h3>Email Verification</h3>
                      <p>Verify your email address for account security</p>
                      <span className="status-badge verified">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Notification Preferences</h2>
                  <p>Choose what notifications you want to receive</p>
                </div>
                
                <div className="notification-settings">
                  {[
                    { 
                      title: 'New Orders', 
                      desc: 'Get notified when you receive new orders',
                      enabled: true 
                    },
                    { 
                      title: 'Order Updates', 
                      desc: 'Updates on order status changes',
                      enabled: true 
                    },
                    { 
                      title: 'Payment Received', 
                      desc: 'When payments are processed to your account',
                      enabled: true 
                    },
                    { 
                      title: 'Product Reviews', 
                      desc: 'When customers review your products',
                      enabled: false 
                    },
                    { 
                      title: 'Marketing Updates', 
                      desc: 'Platform updates and promotional offers',
                      enabled: false 
                    }
                  ].map((item, index) => (
                    <div key={index} className="notification-item">
                      <div className="notification-info">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <label className="switch">
                        <input type="checkbox" defaultChecked={item.enabled} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Security & Privacy</h2>
                  <p>Control your account security and data privacy</p>
                </div>

                <div className="security-overview">
                  <div className="security-score">
                    <div className="score-circle">
                      <span className="score">85</span>
                      <span className="score-label">Security Score</span>
                    </div>
                    <div className="score-details">
                      <h3>Good Security</h3>
                      <p>Your account has good security. Consider enabling 2FA for better protection.</p>
                    </div>
                  </div>
                </div>

                <div className="security-settings">
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Login Activity</h4>
                      <p>Monitor recent login attempts and sessions</p>
                    </div>
                    <button className="btn-outline">View Activity</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h4>Data Export</h4>
                      <p>Download a copy of your account data</p>
                    </div>
                    <button className="btn-outline">Export Data</button>
                  </div>

                  <div className="security-item danger">
                    <div className="security-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button className="btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="settings-actions">
              <button className="btn-outline">Cancel</button>
              <button className="btn-primary" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Add Bank Account Modal */}
        {showAddBankModal && (
          <div className="modal-overlay" onClick={() => setShowAddBankModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Bank Account</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowAddBankModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Bank Name</label>
                  <select
                    value={newBankAccount.bankName}
                    onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                  >
                    <option value="">Select Bank</option>
                    <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                    <option value="Guaranty Trust Bank">Guaranty Trust Bank</option>
                    <option value="United Bank for Africa">United Bank for Africa</option>
                    <option value="Access Bank">Access Bank</option>
                    <option value="Zenith Bank">Zenith Bank</option>
                    <option value="Fidelity Bank">Fidelity Bank</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={newBankAccount.accountNumber}
                    onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                    placeholder="Enter 10-digit account number"
                    maxLength="10"
                  />
                </div>
                <div className="form-group">
                  <label>Account Name</label>
                  <input
                    type="text"
                    value={newBankAccount.accountName}
                    onChange={(e) => setNewBankAccount({...newBankAccount, accountName: e.target.value})}
                    placeholder="Account holder name"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-outline"
                  onClick={() => setShowAddBankModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={addBankAccount}
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
};

export default FarmerSettingsPage;