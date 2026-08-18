import React from 'react';
import DashboardLayout from './DashboardLayout';
import CustomerDashboard from './CustomerDashboard';

const CustomerDashboardPage = () => {
  return (
    <DashboardLayout 
      title="Dashboard"
      showSearch={true}
      showNotifications={true}
    >
      <CustomerDashboard />
    </DashboardLayout>
  );
};

export default CustomerDashboardPage;