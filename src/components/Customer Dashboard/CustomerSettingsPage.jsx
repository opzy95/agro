import React from 'react';
import DashboardLayout from './DashboardLayout';
import CustomerSettings from './CustomerSettings';

const CustomerSettingsPage = () => {
  return (
    <DashboardLayout 
      title="Settings"
      showSearch={true}
      showNotifications={true}
    >
      <CustomerSettings />
    </DashboardLayout>
  );
};

export default CustomerSettingsPage;