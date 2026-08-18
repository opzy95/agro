import React from 'react';
import DashboardLayout from './DashboardLayout';
import PaymentMethods from './PaymentMethods';

const PaymentMethodsPage = () => {
  return (
    <DashboardLayout 
      title="Payment Methods"
      showSearch={false}
      showNotifications={true}
    >
      <PaymentMethods />
    </DashboardLayout>
  );
};

export default PaymentMethodsPage;