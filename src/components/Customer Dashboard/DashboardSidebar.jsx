import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes/routeUtils';
import './DashboardSidebar.css';

const DashboardSidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const profileName = user?.name || 'Customer';
  const profileInitials = profileName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    // Clear any session/auth data if needed
    // For now, just navigate to login
    navigate(ROUTES.LOGIN);
  };

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      path: '/customer/dashboard',
      isActive: location.pathname === '/customer/dashboard'
    },
    {
      icon: '📦',
      label: 'My Orders',
      path: '/customer/orders',
      isActive: location.pathname === '/customer/orders'
    },
    {
      icon: '💝',
      label: 'Wishlist',
      path: '/customer/wishlist',
      isActive: location.pathname === '/customer/wishlist'
    },
    {
      icon: '💳',
      label: 'Payment Methods',
      path: '/customer/payment-methods',
      isActive: location.pathname === '/customer/payment-methods'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      path: '/customer/settings',
      isActive: location.pathname === '/customer/settings'
    }
  ];

  const bottomMenuItems = [
    {
      icon: '❓',
      label: 'Help Center',
      path: '/help',
      isActive: false
    }
  ];

  return (
    <div className="dashboard-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="logo-link">
          <h2 className="logo-text">HarvestHub</h2>
        </Link>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {user?.avatar && !user.avatar.includes('/api/placeholder/') ? (
            <img
              src={user.avatar}
              alt={`${profileName}'s avatar`}
              className="sidebar-avatar-image"
            />
          ) : (
            <span className="sidebar-avatar-initials">{profileInitials}</span>
          )}
        </div>
        <div className="profile-info">
          <h3 className="profile-welcome">Welcome back</h3>
          <p className="profile-subtitle">{profileName}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className="sidebar-nav-item">
              <Link 
                to={item.path} 
                className={`sidebar-nav-link ${item.isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="sidebar-bottom">
        <ul className="sidebar-nav-list">
          {bottomMenuItems.map((item, index) => (
            <li key={index} className="sidebar-nav-item">
              <Link 
                to={item.path} 
                className={`sidebar-nav-link ${item.isLogout ? 'logout-link' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
          {/* Logout Button */}
          <li className="sidebar-nav-item">
            <button 
              onClick={handleLogout}
              className="sidebar-nav-link logout-link logout-btn"
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-label">Logout</span>
            </button>
          </li>
        </ul>

        {/* Go to Shop Button */}
        <Link to="/customer/shop" className="shop-button">
          Go to Shop
        </Link>
      </div>
    </div>
  );
};

export default DashboardSidebar;