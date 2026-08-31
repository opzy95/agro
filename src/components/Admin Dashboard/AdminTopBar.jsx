import React, { useState } from 'react';
import './AdminTopBar.css';

const AdminTopBar = ({ showSearch = true }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="admin-topbar">
      {/* Search Bar */}
      {showSearch && (
        <div className="search-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Right Section */}
      <div className="topbar-right">
        {/* Notifications */}
        <button className="topbar-icon-btn notification-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notification-badge">3</span>
        </button>

        {/* Help */}
        <button className="topbar-icon-btn help-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>

        {/* Apps */}
        <button className="topbar-icon-btn apps-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </button>

        {/* Profile */}
        <div className="admin-profile">
          <div className="profile-avatar">
            <span>👤</span>
          </div>
          <div className="profile-info">
            <p className="profile-name">Admin User</p>
            <p className="profile-role">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
