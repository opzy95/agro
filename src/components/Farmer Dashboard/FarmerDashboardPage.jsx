import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from './FarmerLayout';
import { getFarmerDashboardData } from '../../services/farmerService';
import { getCurrentUser } from '../../services/userService';
import './FarmerDashboardPage.css';

const getFarmerStatus = (order) => {
  const item = order.items?.[0] || {};
  const farmer = item.farmer || item.product?.farmer;
  const farmerKey = typeof farmer === 'string' ? farmer : farmer?._id || farmer?.id || farmer?.name;
  const entry = (order.farmerStatuses || []).find((status) => {
    const statusFarmer = status.farmer;
    const statusKey = typeof statusFarmer === 'string' ? statusFarmer : statusFarmer?._id || statusFarmer?.id || statusFarmer?.name;
    return String(statusKey || '') === String(farmerKey || '');
  });
  return entry?.status || item.status || 'pending';
};

const FarmerDashboardPage = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('1Y');
  const [farmer, setFarmer] = useState({ name: 'Farmer', farmName: 'Farm', avatar: null, verificationStatus: 'not_verified' });
  const [dashboardData, setDashboardData] = useState({ stats: { revenue: 0, orders: 0, activeProducts: 0, pendingOrders: 0 }, topProducts: [], orders: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    Promise.all([getFarmerDashboardData(), getCurrentUser()])
      .then(([data, response]) => {
        const user = response?.user || response?.data?.user || response?.data || response;
        setDashboardData(data);
        setFarmer({ name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Farmer', farmName: user?.farmName || 'Farm', avatar: user?.profileImage || null, verificationStatus: user?.verificationStatus || (user?.isVerified ? 'verified' : 'not_verified') });
      })
      .catch((error) => setDashboardError(error.message || 'Unable to load dashboard data.'))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { title: 'Total Sales', value: `₦${dashboardData.stats.revenue.toLocaleString('en-NG')}`, icon: '💳', color: 'default' },
    { title: 'Total Orders', value: String(dashboardData.stats.orders), icon: '📦', color: 'default' },
    { title: 'Active Products', value: String(dashboardData.stats.activeProducts), icon: '🥘', subtitle: 'In your catalog', color: 'default' },
    { title: 'Pending Orders', value: String(dashboardData.stats.pendingOrders), icon: '⚠️', subtitle: 'Requires attention', color: 'warning' }
  ];

  const topProducts = dashboardData.topProducts;
  const recentOrders = dashboardData.orders.slice(0, 4).map((order) => {
    const customer = order.customer || order.user || order.buyer || {};
    const firstItem = order.items?.[0] || {};
    return { id: order.orderNumber || order._id || order.id, customer: typeof customer === 'string' ? customer : customer.name || customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer', product: firstItem.name || firstItem.product?.name || 'Product', date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString(), amount: `₦${Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0).toLocaleString('en-NG')}`, status: String(getFarmerStatus(order)).replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) };
  });

  return (
    <FarmerLayout farmer={farmer} showSearch={true} showNotifications={true}>
      <div className="farmer-dashboard-page">
        {dashboardError && <p role="alert" className="checkout-error">{dashboardError}</p>}

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
                    <p className="product-sales">{product.sales} Sales</p>
                  </div>
                  <div className="product-price">₦{Number(product.revenue || 0).toLocaleString('en-NG')}</div>
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
                {isLoading && <tr><td colSpan="6">Loading orders...</td></tr>}
                {!isLoading && recentOrders.map((order) => (
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


