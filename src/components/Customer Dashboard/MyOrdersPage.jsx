import React from 'react';
import DashboardLayout from './DashboardLayout';
import MyOrders from './MyOrders';

const MyOrdersPage = () => {
  return (
    <DashboardLayout 
      title="My Orders"
      showSearch={false}
      showNotifications={true}
    >
      <MyOrders />
    </DashboardLayout>
  );
};

export default MyOrdersPage;