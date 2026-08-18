import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DashboardSidebar.css';

const DashboardSidebar = ({ user }) => {
  const location = useLocation();

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
    },
    {
      icon: '🚪',
      label: 'Logout',
      path: '/logout',
      isActive: false,
      isLogout: true
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
        <div className="profile-avatar">
          <img 
            src={user?.avatar || "/api/placeholder/48/48"} 
            alt="User Avatar" 
            className="avatar-image"
          />
        </div>
        <div className="profile-info">
          <h3 className="profile-welcome">Welcome back</h3>
          <p className="profile-subtitle">Manage your harvest</p>
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