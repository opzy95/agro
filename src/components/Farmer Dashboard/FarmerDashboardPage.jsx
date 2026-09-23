import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from './FarmerLayout';
import './FarmerDashboardPage.css';

const FarmerDashboardPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('1Y');

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null
  };

  const stats = [
    {
      title: 'Total Sales',
      value: '₦245,000',
      icon: '💳',
      trend: '+112% from last month',
      color: 'default'
    },
    {
      title: 'Total Orders',
      value: '42',
      icon: '📦',
      trend: '+48% from last week',
      color: 'default'
    },
    {
      title: 'Active Products',
      value: '18',
      icon: '🥘',
      subtitle: 'In your catalog',
      color: 'default'
    },
    {
      title: 'Pending Orders',
      value: '7',
      icon: '⚠️',
      subtitle: 'Requires attention',
      color: 'warning'
    }
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: '₦11,600',
      sales: '124 Sales',
      image: '🍅'
    },
    {
      id: 2,
      name: 'Yam Tubers',
      price: '₦106,800',
      sales: '89 Sales',
      image: '🍠'
    },
    {
      id: 3,
      name: 'Maize (White)',
      price: '₦12,320',
      sales: '56 Sales',
      image: '🌽'
    },
    {
      id: 4,
      name: 'Ofada Rice',
      price: '₦48,720',
      sales: '42 Sales',
      image: '🍚'
    }
  ];

  const recentOrders = [
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

  return (
    <FarmerLayout farmer={farmer} showSearch={true} showNotifications={true}>
      <div className="farmer-dashboard-page">

        {/* Welcome Section */}
        <div className="welcome-section">
          {/* <h1>hello</h1> */}
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome back, Farmer! 👋</h1>
            <p className="welcome-subtitle">Here's what's happening with your farm business today.</p>
          </div>
          <div className="welcome-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/farmer/orders')}
            >
              <span className="btn-icon"></span> View Orders
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/farmer/products')}
            >
              <span className="btn-icon">➕</span> Add Product
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-header">
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
              {stat.trend && <p className="stat-trend">📈 {stat.trend}</p>}
              {stat.subtitle && <p className="stat-subtitle">{stat.subtitle}</p>}
            </div>
          ))}
        </div>

        {/* Charts and Products Grid */}
        <div className="dashboard-grid">
          {/* Sales Overview */}
          <div className="chart-section">
            <div className="section-header">
              <h2 className="section-title">Sales Overview</h2>
              <div className="time-controls">
                <button 
                  className={`time-btn ${timeRange === '7D' ? 'active' : ''}`}
                  onClick={() => setTimeRange('7D')}
                >
                  7D
                </button>
                <button 
                  className={`time-btn ${timeRange === '30D' ? 'active' : ''}`}
                  onClick={() => setTimeRange('30D')}
                >
                  30D
                </button>
                <button 
                  className={`time-btn ${timeRange === '3M' ? 'active' : ''}`}
                  onClick={() => setTimeRange('3M')}
                >
                  3M
                </button>
                <button 
                  className={`time-btn ${timeRange === '1Y' ? 'active' : ''}`}
                  onClick={() => setTimeRange('1Y')}
                >
                  1Y
                </button>
              </div>
            </div>
            <div className="chart-container">
              <div className="bar-chart">
                {[40, 55, 50, 70, 65, 85, 95].map((height, i) => (
                  <div 
                    key={i}
                    className="bar"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">Top Selling Products</h2>
            </div>
            <div className="products-list">
              {topProducts.map((product) => (
                <div key={product.id} className="product-item">
                  {/* <div className="product-image">{product.image}</div> */}
                  <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="product-sales">{product.sales}</p>
                  </div>
                  <div className="product-price">{product.price}</div>
                </div>
              ))}
              <button className="manage-btn">Manage Products</button>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="orders-section">
          <div className="section-header">
            <h2 className="section-title">Recent Orders</h2>
            <a 
              href="#" 
              className="view-all-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/farmer/orders');
              }}
            >
              View All
            </a>
          </div>
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>DATE</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{order.date}</td>
                    <td className="amount">{order.amount}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
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

export default FarmerDashboardPage;


