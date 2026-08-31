import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = ({ activeMenu }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/admin/overview' },
    { id: 'users', label: 'User Management', icon: '👥', path: '/admin/users' },
    { id: 'inventory', label: 'Inventory Control', icon: '📦', path: '/admin/inventory' },
    { id: 'financial', label: 'Financial Settlement', icon: '💰', path: '/admin/financial' },
    { id: 'settings', label: 'System Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <aside className="admin-sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <h2 className="logo-text">HarvestHub</h2>
        <p className="logo-subtitle">Admin Console</p>
      </div>

      {/* Main Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="sidebar-bottom">
        <button className="menu-item generate-report">
          <span className="menu-icon">📄</span>
          <span className="menu-label">Generate Report</span>
        </button>
        <button className="menu-item support">
          <span className="menu-icon">❓</span>
          <span className="menu-label">Support</span>
        </button>
        <button className="menu-item logout">
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
