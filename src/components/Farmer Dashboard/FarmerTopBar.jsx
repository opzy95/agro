import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerificationBadge from '../VerificationBadge';
import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../services/notificationService';
import './FarmerTopBar.css';

const FarmerTopBar = ({ 
  onMobileMenuToggle,
  showSearch = true,
  showNotifications = true,
  farmer = {} 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getMyNotifications();
        setNotifications(response?.notifications || response?.data?.notifications || []);
        setUnreadCount(Number(response?.unreadCount || response?.data?.unreadCount || 0));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const formatNotificationTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString();
  };

  const handleNotificationClick = async (notification) => {
    if (notification.readAt) return;

    try {
      await markNotificationAsRead(notification._id || notification.id);
      setNotifications((items) => items.map((item) => (
        (item._id || item.id) === (notification._id || notification.id)
          ? { ...item, readAt: new Date().toISOString() }
          : item
      )));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

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
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification._id || notification.id}
                        className={`notification-item ${!notification.readAt ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {!notification.readAt && <div className="notification-dot"></div>}
                        <div className="notification-content">
                          <h4 className="notification-item-title">{notification.title}</h4>
                          <p className="notification-message">{notification.message}</p>
                          <span className="notification-time">{formatNotificationTime(notification.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <button className="view-all-notifications" onClick={() => setShowNotificationDropdown(false)}>
                      Close Notifications
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
            onClick={() => navigate('/farmer/settings')}
            aria-label="User profile"
            title="Open Settings"
          >
            <div className="profile-avatar">
              {farmer?.profileImage || farmer?.avatar ? (
                <img
                  src={farmer.profileImage || farmer.avatar}
                  alt="Farmer profile"
                  className="profile-avatar-img"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                    event.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span className="profile-fallback" style={{ display: farmer?.profileImage || farmer?.avatar ? 'none' : 'flex' }}>👨‍🌾</span>
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
