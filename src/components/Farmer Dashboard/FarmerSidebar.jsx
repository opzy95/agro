import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './FarmerSidebar.css';

const FarmerSidebar = ({ farmer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      path: '/farmer/dashboard',
      isActive: location.pathname === '/farmer/dashboard'
    },
    {
      icon: '📦',
      label: 'Products',
      path: '/farmer/products',
      isActive: location.pathname === '/farmer/products'
    },
    {
      icon: '🛒',
      label: 'Orders',
      path: '/farmer/orders',
      isActive: location.pathname === '/farmer/orders'
    },
    {
      icon: '💰',
      label: 'Earnings',
      path: '/farmer/earnings',
      isActive: location.pathname === '/farmer/earnings'
    },
    {
      icon: '📈',
      label: 'Analytics',
      path: '/farmer/analytics',
      isActive: location.pathname === '/farmer/analytics'
    },
    {
      icon: '⚙️',
      label: 'Settings',
      path: '/farmer/settings',
      isActive: location.pathname === '/farmer/settings'
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
    <div className="farmer-sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="logo-link">
          <h2 className="logo-text">AgroFresh</h2>
        </Link>
      </div>

      {/* Farmer Profile */}
      <div className="sidebar-profile">
        <div className="profile-avata">
          <div className="avatar-fallback">👨‍🌾</div>
        </div>
        <div className="profile-info">
          <h3 className="profile-welcome">{farmer?.name || 'Green Valley Farm'}</h3>
          <p className="profile-subtitle">{farmer?.farmName || 'Premium Producer'}</p>
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
                className="sidebar-nav-link"
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
      </div>
    </div>
  );
};

export default FarmerSidebar;
