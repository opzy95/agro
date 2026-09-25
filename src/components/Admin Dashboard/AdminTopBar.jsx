import React, { useEffect, useState } from 'react';
import { getMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../../services/notificationService';
import './AdminTopBar.css';

const AdminTopBar = ({ onMobileMenuToggle, showSearch = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getMyNotifications()
      .then((response) => {
        const list = response?.notifications || response?.data?.notifications || response?.data || response || [];
        const notificationList = Array.isArray(list) ? list : [];
        setNotifications(notificationList);
        setUnreadCount(Number(response?.unreadCount ?? response?.data?.unreadCount ?? notificationList.filter((item) => !item.readAt).length));
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  }, []);

  const handleNotificationClick = async (notification) => {
    if (notification.readAt) return;
    const notificationId = notification._id || notification.id;
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((items) => items.map((item) => (
        (item._id || item.id) === notificationId ? { ...item, readAt: new Date().toISOString() } : item
      )));
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Keep the notification open when the read request fails.
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((items) => items.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() })));
      setUnreadCount(0);
    } catch {
      // The badge remains unchanged when the request fails.
    }
  };

  return (
    <div className="admin-topbar">
      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={onMobileMenuToggle}
        aria-label="Toggle admin menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

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
        <div className="admin-notification-container">
          <button
            type="button"
            className="topbar-icon-btn notification-btn"
            onClick={() => setShowNotifications((isOpen) => !isOpen)}
            aria-label="Notifications"
            aria-expanded={showNotifications}
          >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <>
              <div className="admin-notification-dropdown">
                <div className="admin-notification-header">
                  <h3>Notifications</h3>
                  <button type="button" onClick={handleMarkAllAsRead}>Mark all read</button>
                </div>
                <div className="admin-notification-list">
                  {notifications.length === 0 && <p className="admin-notification-empty">No notifications yet.</p>}
                  {notifications.map((notification) => (
                    <button
                      type="button"
                      key={notification._id || notification.id}
                      className={`admin-notification-item ${!notification.readAt ? 'unread' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <strong>{notification.title || 'Notification'}</strong>
                      <span>{notification.message || ''}</span>
                      <small>{notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}</small>
                    </button>
                  ))}
                </div>
              </div>
              <button type="button" className="admin-notification-overlay" aria-label="Close notifications" onClick={() => setShowNotifications(false)} />
            </>
          )}
        </div>

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
