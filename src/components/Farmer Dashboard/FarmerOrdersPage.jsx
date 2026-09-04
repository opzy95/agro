import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';
import './FarmerOrdersPage.css';

const FarmerOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null,
    verificationStatus: 'verified' // This would come from the backend/context in real app
  };

  // Order stats
  const orderStats = [
    {
      title: 'TOTAL ORDERS',
      value: '42',
      icon: '📊',
      color: 'total'
    },
    {
      title: 'PENDING',
      value: '7',
      icon: '⏳',
      color: 'pending'
    },
    {
      title: 'PROCESSING',
      value: '12',
      icon: '🚛',
      color: 'processing'
    },
    {
      title: 'COMPLETED',
      value: '23',
      icon: '✅',
      color: 'completed'
    }
  ];

  const orders = [
    {
      id: '#HH1001',
      customer: 'John Ade',
      customerInitials: 'JA',
      product: 'Fresh Tomatoes',
      date: '11 Aug 2026',
      quantity: '5 baskets',
      amount: '₦42,500',
      status: 'Pending'
    },
    {
      id: '#HH1002',
      customer: 'Mary James',
      customerInitials: 'MJ',
      product: 'Yam',
      date: '10 Aug 2026',
      quantity: '10 tubers',
      amount: '₦35,000',
      status: 'Processing'
    },
    {
      id: '#HH1003',
      customer: 'David Cole',
      customerInitials: 'DC',
      product: 'Rice',
      date: '9 Aug 2026',
      quantity: '3 bags',
      amount: '₦78,000',
      status: 'Completed'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'Completed').length },
    { id: 'cancelled', label: 'Cancelled', count: 0 }
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
      <div className="farmer-orders-page">
        {/* Header */}
        <div className="orders-header">
          <div className="header-content">
            <h1>Orders</h1>
            <p>Manage and track orders from your customers.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="order-stats-grid">
          {orderStats.map((stat, index) => (
            <div key={index} className={`order-stat-card ${stat.color}`}>
              <div className="stat-icon-wrapper">
                <span className="stat-icon-bg">
                  {stat.color === 'total' && <span className="stat-icon">📊</span>}
                  {stat.color === 'pending' && <span className="stat-icon">⏳</span>}
                  {stat.color === 'processing' && <span className="stat-icon">🚛</span>}
                  {stat.color === 'completed' && <span className="stat-icon">✅</span>}
                </span>
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Controls */}
        <div className="orders-controls">
          <div className="orders-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`tab-button ${selectedTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* <div className="orders-actions">
            <button className="action-btn">
              📅 <span>Date</span>
            </button>
            <button className="action-btn">
              ⚙️ <span>Sort</span>
            </button>
          </div> */}
        </div>

        {/* Orders Table */}
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Date</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td className="customer-cell">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.customerInitials}
                      </div>
                      <span>{order.customer}</span>
                    </div>
                  </td>
                  <td>{order.product}</td>
                  <td>{order.date}</td>
                  <td>{order.quantity}</td>
                  <td className="amount">{order.amount}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status === 'Pending' && '● '}
                      {order.status === 'Processing' && '● '}
                      {order.status === 'Completed' && '● '}
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="orders-pagination">
          <div className="pagination-info">
            Showing 1 to 3 of 42 entries
          </div>
          <div className="pagination-controls">
            <button className="pagination-btn" disabled>
              ❮
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">❯</button>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default FarmerOrdersPage;