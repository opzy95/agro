import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminSettingsPage.css';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({
    marketplaceFee: 12.5,
    globalTaxRate: 8.0,
    minimumPayoutThreshold: 50.00,
    maintenanceMode: false
  });

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Super Admin',
      lastActive: 'Today, 10:42 AM',
      email: 'sarah@harvesthub.com'
    },
    {
      id: 2,
      name: 'Michael Chang',
      role: 'Financial Admin',
      lastActive: 'Yesterday, 4:15 PM',
      email: 'michael@harvesthub.com'
    }
  ]);

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Admin' });
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const recentChanges = [
    {
      id: 1,
      user: 'Sarah Jenkins',
      action: 'updated Marketplace Fee to 12.5%.',
      timestamp: '2 hours ago',
      icon: '✓'
    },
    {
      id: 2,
      user: 'System',
      action: 'initiated automated backup.',
      timestamp: 'Yesterday, 11:00 PM',
      icon: '✓'
    }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      setAdmins([
        ...admins,
        {
          id: admins.length + 1,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          lastActive: 'Just now'
        }
      ]);
      setNewAdmin({ name: '', email: '', role: 'Admin' });
      setShowAddAdmin(false);
    }
  };

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };

  const handleSaveChanges = () => {
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <AdminLayout activeMenu="settings" showSearch={true}>
      <div className="admin-settings-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">System Settings</h1>
            <p className="page-subtitle">Configure platform-wide parameters and access controls.</p>
          </div>
          <button className="btn-save-changes" onClick={handleSaveChanges}>
            💾 Save Changes
          </button>
        </div>

        {/* Main Grid */}
        <div className="settings-grid">
          {/* Left Column - Financial Configuration & Admins */}
          <div className="left-column">
            {/* Financial Configuration Section */}
            <div className="settings-card">
              <div className="card-header">
                <h2 className="card-title">📋 Financial Configuration</h2>
              </div>

              <div className="form-group">
                <label className="form-label">Marketplace Fee (%)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.marketplaceFee}
                    onChange={(e) => handleSettingChange('marketplaceFee', parseFloat(e.target.value))}
                    className="form-input"
                  />
                  <span className="input-suffix">%</span>
                </div>
                <p className="input-hint">Default fee applied to all marketplace transactions.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Global Tax Rate (%)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.globalTaxRate}
                    onChange={(e) => handleSettingChange('globalTaxRate', parseFloat(e.target.value))}
                    className="form-input"
                  />
                  <span className="input-suffix">%</span>
                </div>
                <p className="input-hint">Tax rate applied to all transactions.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Payout Threshold ($)</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.minimumPayoutThreshold}
                    onChange={(e) => handleSettingChange('minimumPayoutThreshold', parseFloat(e.target.value))}
                    className="form-input"
                  />
                </div>
                <p className="input-hint">Minimum balance required to trigger a payout.</p>
              </div>
            </div>

            {/* Administrators Section */}
            <div className="settings-card">
              <div className="card-header">
                <h2 className="card-title">👥 Administrators</h2>
                <button 
                  className="btn-add-admin"
                  onClick={() => setShowAddAdmin(!showAddAdmin)}
                >
                  + Add Admin
                </button>
              </div>

              {/* Add Admin Form */}
              {showAddAdmin && (
                <div className="add-admin-form">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      className="form-input"
                      placeholder="Full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="form-input"
                      placeholder="Email address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      value={newAdmin.role}
                      onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                      className="form-select"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Financial Admin">Financial Admin</option>
                      <option value="Inventory Admin">Inventory Admin</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-cancel"
                      onClick={() => setShowAddAdmin(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn-add"
                      onClick={handleAddAdmin}
                    >
                      Add Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Admins Table */}
              <div className="table-wrapper">
                <table className="admins-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="user-cell">
                          <div className="user-info">
                            <div className="user-avatar">
                              {admin.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="user-name">{admin.name}</p>
                              <p className="user-email">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${admin.role.toLowerCase().replace(' ', '-')}`}>
                            {admin.role}
                          </span>
                        </td>
                        <td className="last-active">{admin.lastActive}</td>
                        <td className="actions-cell">
                          <button className="action-btn edit-btn" title="Edit">✏️</button>
                          <button 
                            className="action-btn delete-btn" 
                            title="Delete"
                            onClick={() => handleDeleteAdmin(admin.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Configuration Changes */}
            <div className="settings-card">
              <div className="card-header">
                <h2 className="card-title">📝 Recent Configuration Changes</h2>
              </div>

              <div className="changes-list">
                {recentChanges.map((change) => (
                  <div key={change.id} className="change-item">
                    <div className="change-icon">
                      <span className="checkmark">{change.icon}</span>
                    </div>
                    <div className="change-content">
                      <p className="change-text">
                        <span className="change-user">{change.user}</span> {change.action}
                      </p>
                      <p className="change-timestamp">{change.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Platform Status */}
          <div className="right-column">
            <div className="settings-card platform-status">
              <div className="card-header">
                <h2 className="card-title">🟡 Platform Status</h2>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="status-item">
                <div className="status-info">
                  <p className="status-label">Maintenance Mode</p>
                  <p className="status-description">Disable public access.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* System Status Info */}
              <div className="status-info-box">
                <div className="status-icon">ℹ️</div>
                <div className="status-message">
                  <p className="status-title">System is currently operating normally</p>
                  <p className="status-description">Next scheduled maintenance is Oct 15.</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat-item">
                  <span className="stat-label">Database Size</span>
                  <span className="stat-value">2.4 GB</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">API Response Time</span>
                  <span className="stat-value">145ms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Server Uptime</span>
                  <span className="stat-value">99.95%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="status-actions">
                <button className="action-btn-secondary">🔄 Restart System</button>
                <button className="action-btn-secondary">💾 Backup Database</button>
                <button className="action-btn-secondary">📊 View Logs</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
