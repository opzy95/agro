import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import './AdminLayout.css';

const AdminLayout = ({ children, activeMenu, showSearch = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-layout-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <AdminSidebar activeMenu={activeMenu} />
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main Content Container */}
      <div className="admin-layout-main">
        {/* TopBar */}
        <div className="admin-layout-topbar">
          <AdminTopBar showSearch={showSearch} />
        </div>

        {/* Page Content */}
        <main className="admin-layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
