import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  // Mock data
  const userData = {
    name: 'Sarah',
    totalOrders: 12,
    activeOrders: 2,
    arrivingToday: 1,
    wishlistItems: 8,
    rewardPoints: 450,
    tier: 'Gold Tier'
  };

  const activeDelivery = {
    orderId: 'HH-8923',
    seller: 'Sunrise Orchards',
    expectedTime: 'Today, 2:00 PM',
    status: 'Out for Delivery'
  };

  const recentOrders = [
    {
      id: 'HH-8923',
      product: 'Heirloom Tomatoes',
      highlights: '+2 more items',
      seller: 'Sunrise Orchards',
      date: 'Oct 24, 2023',
      status: 'Shipped',
      total: 42.50
    },
    {
      id: 'HH-8812',
      product: 'Organic Raw Honey',
      highlights: '',
      seller: 'BeeHappy Farms',
      date: 'Oct 18, 2023',
      status: 'Delivered',
      total: 18.00
    }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="customer-dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          Welcome back, {userData.name}! 
          <span className="wave-emoji">🌱</span>
        </h1>
        <p className="welcome-subtitle">
          Here's what's happening with your HarvestHub account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{userData.totalOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <div className="stat-label">Active Orders</div>
            <div className="stat-value">{userData.activeOrders}</div>
            <div className="stat-detail">+{userData.arrivingToday} arriving today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💝</div>
          <div className="stat-content">
            <div className="stat-label">Wishlist Items</div>
            <div className="stat-value">{userData.wishlistItems}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Reward Points</div>
            <div className="stat-value">{userData.rewardPoints}</div>
            <div className="stat-detail">{userData.tier}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Active Delivery */}
        <div className="dashboard-card active-delivery-card">
          <div className="card-header">
            <h3 className="card-title">Active Delivery</h3>
          </div>
          <div className="delivery-content">
            <div className="delivery-info">
              <div className="order-reference">
                Order #{activeDelivery.orderId} • {activeDelivery.seller}
              </div>
              <div className="delivery-time">
                <span className="time-label">EXPECTED DELIVERY</span>
                <div className="delivery-eta">{activeDelivery.expectedTime}</div>
              </div>
            </div>
            
            {/* Delivery Progress */}
            <div className="delivery-progress">
              <div className="progress-step completed">
                <div className="step-icon">✓</div>
                <div className="step-label">Confirmed</div>
              </div>
              <div className="progress-line completed"></div>
              
              <div className="progress-step completed">
                <div className="step-icon">✓</div>
                <div className="step-label">Packed</div>
              </div>
              <div className="progress-line completed"></div>
              
              <div className="progress-step active">
                <div className="step-icon">🚚</div>
                <div className="step-label">Out for Delivery</div>
              </div>
              <div className="progress-line"></div>
              
              <div className="progress-step">
                <div className="step-icon">📦</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card recent-orders-card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <Link to="/customer/orders" className="view-all-link">View All</Link>
          </div>
          
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Product Highlights</div>
              <div className="header-cell">Seller</div>
              <div className="header-cell">Date</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Total</div>
              <div className="header-cell">Action</div>
            </div>
            
            <div className="table-body">
              {recentOrders.map((order) => (
                <div key={order.id} className="table-row">
                  <div className="table-cell">
                    <span className="order-id">#{order.id}</span>
                  </div>
                  <div className="table-cell">
                    <div className="product-info">
                      <span className="product-name">{order.product}</span>
                      {order.highlights && (
                        <span className="product-highlights">{order.highlights}</span>
                      )}
                    </div>
                  </div>
                  <div className="table-cell">
                    <span className="seller-name">{order.seller}</span>
                  </div>
                  <div className="table-cell">
                    <span className="order-date">{order.date}</span>
                  </div>
                  <div className="table-cell">
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="table-cell">
                    <span className="order-total">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="table-cell">
                    <button className="action-menu-btn">⋯</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;