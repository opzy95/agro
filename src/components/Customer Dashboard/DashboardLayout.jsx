import React, { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import './DashboardLayout.css';

const DashboardLayout = ({ 
  children, 
  title = "Dashboard",
  showSearch = true,
  showNotifications = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock user data - replace with actual user data from context/state
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: '/api/placeholder/48/48'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className={`dashboard-sidebar-container ${sidebarOpen ? 'mobile-open' : ''}`}>
        <DashboardSidebar user={user} />
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Bar */}
        <DashboardTopBar 
          title={title}
          onMobileMenuToggle={toggleSidebar}
          showSearch={showSearch}
          showNotifications={showNotifications}
        />

        {/* Page Content */}
        <div className="dashboard-content">
          <div className="content-container">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;