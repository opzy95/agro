import React, { useState, useEffect } from 'react';
import FarmerSidebar from './FarmerSidebar';
import FarmerTopBar from './FarmerTopBar';
import { getCurrentUser } from '../../services/userService';
import './FarmerLayout.css';

const FarmerLayout = ({ children, farmer, title, showSearch = true, showNotifications = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response?.user || response || null);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const normalizedUser = currentUser || {};
  const fullName = [normalizedUser.firstName, normalizedUser.lastName].filter(Boolean).join(' ') || normalizedUser.name || 'Green Valley Farm';
  const farmName = normalizedUser.farmName || normalizedUser.businessName || normalizedUser.location || 'Premium Producer';

  const layoutFarmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    verificationStatus: 'verified',
    ...farmer,
    ...normalizedUser,
    name: fullName,
    farmName: farmName,
    verificationStatus: normalizedUser.verificationStatus || 'verified'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar */}
      <aside className={`farmer-layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <FarmerSidebar farmer={layoutFarmer} />
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main Content Container */}
      <div className="farmer-layout-main">
        {/* TopBar */}
        <div className="farmer-layout-topbar">
          <FarmerTopBar 
            onMobileMenuToggle={toggleSidebar}
            showSearch={showSearch}
            showNotifications={showNotifications}
            farmer={layoutFarmer}
          />
        </div>

        {/* Page Content - Children Render Here */}
        <main className="farmer-layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;
