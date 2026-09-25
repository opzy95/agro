import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminFinancials, getAdminOrders, getAdminProducts, getAdminUsers } from '../../services/adminService';
import './AdminOverviewPage.css';

const getPayload = (response) => response?.data || response || {};

const getList = (response, key) => {
  const payload = getPayload(response);
  const list = payload?.[key] || response?.[key] || payload;
  return Array.isArray(list) ? list : [];
};

const getOrders = (response) => {
  const payload = getPayload(response);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.orders)) return payload.orders;

  const customerEntries = Array.isArray(payload.customers) ? payload.customers : [];
  return customerEntries.flatMap((customerEntry) => {
    const customer = customerEntry.customer || customerEntry.user || customerEntry;
    const customerOrders = customerEntry.orders
      || customer?.orders
      || customerEntry.orderDetails
      || customerEntry.orderList
      || customerEntry.purchases
      || customerEntry.order
      || customerEntry.customerOrders
      || (customerEntry.latestOrder ? [customerEntry.latestOrder] : [])
      || (customerEntry.orderId || customerEntry.orderNumber || customerEntry.totalAmount || customerEntry.total ? [customerEntry] : []);

    return Array.isArray(customerOrders) ? customerOrders : [customerOrders];
  }).filter(Boolean);
};

const getStatus = (value) => String(value || '').toLowerCase().replace(/[_-]/g, ' ');

const AdminOverviewPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [dashboardData, setDashboardData] = useState({ metrics: [], quickActions: [], activities: [], chartData: [] });

  useEffect(() => {
    Promise.all([getAdminUsers(), getAdminProducts(), getAdminOrders(), getAdminFinancials('monthly')]).then(([usersResponse, productsResponse, ordersResponse, financialsResponse]) => {
      const users = getList(usersResponse, 'users');
      const products = getList(productsResponse, 'products');
      const orders = getOrders(ordersResponse);
      const financials = getPayload(financialsResponse);
      const activeProducts = products.filter((product) => ['published', 'active'].includes(getStatus(product.status)));
      const pendingFarmers = users.filter((user) => {
        const role = getStatus(user.role);
        const verification = getStatus(user.verificationStatus);
        return role === 'farmer' && ['pending', 'not verified', 'not_verified'].includes(verification);
      });
      const lowStockProducts = products.filter((product) => {
        const quantity = Number(product.availableQuantity ?? product.quantity ?? product.stock ?? 0);
        return quantity > 0 && quantity <= 5;
      });
      const recentOrders = orders.slice(-4).reverse();

      setDashboardData({
        metrics: [
          { title: 'TOTAL USERS', value: users.length, icon: '👥', subtitle: `${users.filter((user) => getStatus(user.role) === 'farmer').length} farmers` },
          { title: 'ACTIVE PRODUCTS', value: activeProducts.length, icon: '📦', subtitle: `${products.length} total listings` },
          { title: 'TOTAL ORDERS', value: orders.length, icon: '🛒', subtitle: 'All customer orders' },
          { title: 'PENDING FARMER REVIEWS', value: pendingFarmers.length, icon: '⏳', subtitle: 'Verification required' }
        ],
        quickActions: [
          { title: 'Farmer verification', subtitle: `${pendingFarmers.length} pending review`, icon: '✓', color: 'orange' },
          { title: 'Low stock products', subtitle: `${lowStockProducts.length} need attention`, icon: '!', color: 'red' }
        ],
        activities: recentOrders.map((order) => ({
          title: `Order ${order.orderNumber || order._id || order.id || ''}`,
          description: getStatus(order.orderStatus || order.status || 'pending'),
          time: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent',
          icon: '🛒',
          color: 'green'
        })),
        chartData: financials.chartData || financials.sales || []
      });
    }).catch(() => setDashboardData({ metrics: [], quickActions: [], activities: [], chartData: [] }));
  }, []);

  const { metrics, quickActions, activities: platformActivities, chartData } = dashboardData;

  const maxValue = Math.max(1, ...chartData.map(d => Number(d.value || d.amount || 0)));

  return (
    <AdminLayout activeMenu="overview" showSearch={true}>
      <div className="admin-overview-page">
        {/* Page Header */}
        <div className="overview-header">
          <div>
            <h1 className="page-title">Overview</h1>
            <p className="page-subtitle">Key metrics and platform activity for today.</p>
          </div>
          <button className="date-range-btn">
            📅 Last 30 Days
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-icon">{metric.icon}</div>
              <p className="metric-label">{metric.title}</p>
              <p className="metric-value">{metric.value}</p>
              {metric.subtitle && (
                <p className="metric-subtitle">{metric.subtitle}</p>
              )}
              {metric.trend && (
                <p className={`metric-trend ${metric.positive ? 'positive' : 'negative'}`}>
                  {metric.positive ? '📈' : '📉'} {metric.trend}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="overview-grid">
          {/* Sales Trends */}
          <div className="sales-section">
            <div className="section-header">
              <h2 className="section-title">Sales Trends</h2>
              <div className="time-toggle">
                <button 
                  className={`toggle-btn ${timeRange === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeRange('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`toggle-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-bars">
                {chartData.map((data, index) => (
                  <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                      <div 
                        className={`bar ${index === chartData.length - 1 ? 'active' : ''}`}
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      />
                    </div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-axis">
                <span>$0</span>
                <span>$50k</span>
                <span>$100k</span>
                <span>$150k</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="overview-sidebar">
            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3 className="section-title">Quick Actions</h3>
              <div className="actions-list">
                {quickActions.map((action, index) => (
                  <div key={index} className={`action-item action-${action.color}`}>
                    <span className="action-icon">{action.icon}</span>
                    <div className="action-content">
                      <p className="action-title">{action.title}</p>
                      <p className="action-subtitle">{action.subtitle}</p>
                    </div>
                    <span className="action-arrow">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Activity */}
            <div className="platform-activity-section">
              <div className="activity-header">
                <h3 className="section-title">Platform Activity</h3>
                <a href="#" className="view-all-link">View All</a>
              </div>
              <div className="activity-list">
                {platformActivities.map((activity, index) => (
                  <div key={index} className={`activity-item activity-${activity.color}`}>
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <p className="activity-title">{activity.title}</p>
                      <p className="activity-description">{activity.description}</p>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverviewPage;
