import React, { useState } from 'react';
import FarmerSidebar from './FarmerSidebar';
import FarmerTopBar from './FarmerTopBar';
import './FarmerLayout.css';

const FarmerLayout = ({ children, farmer, title, showSearch = true, showNotifications = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <FarmerSidebar farmer={farmer} />
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
            farmer={farmer}
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
