import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DashboardTopBar.css';

const DashboardTopBar = ({ 
  onMobileMenuToggle,
  showSearch = true,
  showNotifications = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #12345 has been delivered',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'promotion',
      title: 'Special Offer',
      message: '20% off on fresh vegetables this week',
      time: '1 hour ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="dashboard-topbar">
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

      {/* Logo */}
      <div className="topbar-logo">
        <Link to="/" className="logo-link">
          <span className="logo-icon">🌱</span>
          <span className="logo-text">HarvestHub</span>
        </Link>
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
              placeholder="Search for products, farmers, or orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}

      {/* Right Actions */}
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

        {/* Wishlist */}
        <Link to="/customer/wishlist" className="action-btn" aria-label="Wishlist">
          <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </Link>

        {/* Cart */}
        <Link to="/customer/cart" className="action-btn" aria-label="Shopping Cart">
          <svg className="action-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </Link>

        {/* Profile */}
        <div className="profile-container">
          <Link to="/customer/settings" className="profile-btn" aria-label="Profile">
            <div className="profile-avatar">
              <img 
                src="/api/placeholder/36/36" 
                alt="Profile" 
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="profile-fallback" style={{ display: 'none' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;