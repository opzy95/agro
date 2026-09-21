import React, { useEffect, useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import { getCurrentUser } from '../../services/userService';
import './DashboardLayout.css';

const DashboardLayout = ({ 
  children, 
  title = "Dashboard",
  showSearch = true,
  showNotifications = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        const profile = response?.user || response?.data?.user || response?.data || response || {};
        const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.name || 'Customer';
        const avatar = typeof profile.profileImage === 'string'
          ? profile.profileImage
          : profile.profileImage?.url
            || profile.profileImage?.secure_url
            || profile.profileImageUrl
            || profile.image
            || null;

        setUser({ ...profile, name, avatar });
      } catch (error) {
        console.error('Failed to fetch customer dashboard user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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
          user={user}
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