import React, { useState } from 'react';
import VerificationBadge from '../VerificationBadge';
import './FarmerTopBar.css';

const FarmerTopBar = ({ 
  onMobileMenuToggle,
  showSearch = true,
  showNotifications = true,
  farmer = {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'New Order',
      message: 'You have received a new order from a customer',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      title: 'Customer Message',
      message: 'A customer has sent you a message',
      time: '1 hour ago',
      unread: false
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'Your payout has been processed',
      time: '2 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="farmer-topbar">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={onMobileMenuToggle}
        aria-label="Toggle mobile menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Page Title */}
      <div className="topbar-title">
        <h2 className="title-text">Farmer Dashboard</h2>
      </div>

      {/* Center Search Bar */}
      {showSearch && (
        <div className="topbar-search">
          <div className="search-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search orders, products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Right Actions - Only Notifications */}
      <div className="topbar-actions">
        {/* Notifications */}
        {showNotifications && (
          <div className="notification-container">
            <button 
              className="action-btn notification-btn"
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              aria-label="Notifications"
            >
              <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <>
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3 className="notification-title">Notifications</h3>
                    <button 
                      className="mark-all-read"
                      onClick={() => setShowNotificationDropdown(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                      >
                        {notification.unread && <div className="notification-dot"></div>}
                        <div className="notification-content">
                          <h4 className="notification-item-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <button className="view-all-notifications">
                      View All Notifications
                    </button>
                  </div>
                </div>
                <div 
                  className="dropdown-overlay" 
                  onClick={() => setShowNotificationDropdown(false)}
                />
              </>
            )}
          </div>
        )}

        {/* Profile Avatar */}
        <div className="profile-container">
          <button 
            className="profile-btn"
            aria-label="User profile"
            title="Profile"
          >
            <div className="profile-avatar">
              <span className="profile-fallback">👨‍🌾</span>
            </div>
            <div className="profile-details">
              <span className="profile-name">{farmer?.name || 'Green Valley Farm'}</span>
              <VerificationBadge status={farmer?.verificationStatus || 'not_verified'} size="small" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default FarmerTopBar;
