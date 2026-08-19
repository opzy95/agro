import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';

const FarmerAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30D');

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null
  };

  const analytics = [
    {
      title: 'Total Revenue',
      value: '₦1,245,000',
      trend: '+15.2%',
      icon: '💰',
      color: 'success'
    },
    {
      title: 'Orders',
      value: '342',
      trend: '+8.1%',
      icon: '📦',
      color: 'info'
    },
    {
      title: 'Customers',
      value: '156',
      trend: '+12.3%',
      icon: '👥',
      color: 'primary'
    },
    {
      title: 'Products Sold',
      value: '2,847',
      trend: '+22.5%',
      icon: '🛒',
      color: 'warning'
    }
  ];

  const topProducts = [
    { name: 'Roma Tomatoes', revenue: '₦185,000', orders: 45 },
    { name: 'White Yams', revenue: '₦142,000', orders: 32 },
    { name: 'Sweet Maize', revenue: '₦98,000', orders: 28 },
    { name: 'Ofada Rice', revenue: '₦76,000', orders: 24 }
  ];

  const topCustomers = [
    { name: 'Amina Bello', orders: 12, spent: '₦85,000' },
    { name: 'Chukwudi Eze', orders: 8, spent: '₦72,000' },
    { name: 'Fatima Yusuf', orders: 10, spent: '₦68,000' },
    { name: 'Oluwaseun Ade', orders: 6, spent: '₦54,000' }
  ];

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
            }}>Analytics</h1>
            <p style={{
              color: '#6b7280',
              margin: '0.5rem 0 0 0'
            }}>Track your farm business performance</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['7D', '30D', '3M', '1Y'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  background: timeRange === range ? '#059669' : 'white',
                  color: timeRange === range ? 'white' : '#6b7280',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {analytics.map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                <div>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    margin: 0,
                    fontWeight: 500
                  }}>{stat.title}</p>
                  <p style={{
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: '#111827',
                    margin: 0
                  }}>{stat.value}</p>
                </div>
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: '#059669',
                margin: 0
              }}>📈 {stat.trend} from last period</p>
            </div>
          ))}
        </div>

        {/* Charts and Tables Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Revenue Chart */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>Revenue Trend</h3>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              height: '200px',
              gap: '0.5rem',
              padding: '1rem',
              background: 'linear-gradient(to bottom, rgba(5, 150, 105, 0.05), transparent)',
              borderRadius: '8px'
            }}>
              {[65, 45, 78, 52, 90, 67, 85, 72, 95, 58, 82, 88].map((height, i) => (
                <div
                  key={i}
                  style={{
                    width: '8%',
                    height: `${height}%`,
                    background: 'linear-gradient(to top, #059669, #6ee7b7)',
                    borderRadius: '4px 4px 0 0',
                    boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)'
                  }}
                />
              ))}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '1rem'
            }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>Top Products</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topProducts.map((product, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: '#f9fafb',
                  borderRadius: '8px'
                }}>
                  <div>
                    <p style={{
                      fontWeight: 600,
                      color: '#111827',
                      margin: 0,
                      fontSize: '0.9rem'
                    }}>{product.name}</p>
                    <p style={{
                      color: '#6b7280',
                      margin: 0,
                      fontSize: '0.8rem'
                    }}>{product.orders} orders</p>
                  </div>
                  <p style={{
                    fontWeight: 700,
                    color: '#059669',
                    margin: 0
                  }}>{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 1.5rem 0'
          }}>Top Customers</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
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
                  }}>ORDERS</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>TOTAL SPENT</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#111827'
                    }}>{customer.name}</td>
                    <td style={{
                      padding: '1rem',
                      color: '#374151'
                    }}>{customer.orders}</td>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#059669'
                    }}>{customer.spent}</td>
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

export default FarmerAnalyticsPage;