import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';

const FarmerOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null
  };

  const orders = [
    {
      id: '#ORD-092',
      customer: 'Amina Bello',
      product: 'Fresh Tomatoes (50kg)',
      date: 'Today, 10:42 AM',
      amount: '₦45,000',
      status: 'Completed'
    },
    {
      id: '#ORD-091',
      customer: 'Chukwudi Eze',
      product: 'Yam Tubers (100 pcs)',
      date: 'Yesterday, 14:15 PM',
      amount: '₦120,000',
      status: 'Processing'
    },
    {
      id: '#ORD-090',
      customer: 'Fatima Yusuf',
      product: 'Maize (Bag)',
      date: 'Oct 24, 2023',
      amount: '₦22,000',
      status: 'Pending'
    },
    {
      id: '#ORD-089',
      customer: 'Oluwaseun Ade',
      product: 'Ofada Rice (50kg)',
      date: 'Oct 22, 2023',
      amount: '₦58,000',
      status: 'Cancelled'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
  ];

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === selectedTab);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'Processing': return 'processing';
      case 'Pending': return 'pending';
      case 'Cancelled': return 'cancelled';
      default: return '';
    }
  };

  return (
    <FarmerLayout farmer={farmer} showSearch={true} showNotifications={true}>
      <div style={{ 
        background: '#f9fafb',
        padding: '2rem',
        minHeight: 'calc(100vh - 80px)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#111827',
              margin: 0
            }}>Orders</h1>
            <p style={{
              color: '#6b7280',
              margin: '0.5rem 0 0 0'
            }}>Manage your customer orders</p>
          </div>
          <button style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Export Orders
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  padding: '1rem 1.5rem',
                  border: 'none',
                  background: selectedTab === tab.id ? '#ecfdf5' : 'transparent',
                  color: selectedTab === tab.id ? '#059669' : '#6b7280',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderBottom: selectedTab === tab.id ? '2px solid #059669' : 'none',
                  borderRadius: '12px 12px 0 0'
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                background: '#f9fafb',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <tr>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>ORDER ID</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>CUSTOMER</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>PRODUCT</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>DATE</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>AMOUNT</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#111827'
                    }}>{order.id}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{order.customer}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{order.product}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{order.date}</td>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#111827'
                    }}>{order.amount}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        background: order.status === 'Completed' ? '#d1fae5' : 
                                   order.status === 'Processing' ? '#fef3c7' :
                                   order.status === 'Pending' ? '#fecaca' : '#e5e7eb',
                        color: order.status === 'Completed' ? '#065f46' :
                               order.status === 'Processing' ? '#92400e' :
                               order.status === 'Pending' ? '#991b1b' : '#374151'
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default FarmerOrdersPage;