import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../services/orderService';
import { getCurrentUser } from '../../services/userService';
import { useWishlist } from '../../contexts/WishlistContext';
import './CustomerDashboard.css';

const formatStatus = (status) => String(status || 'pending')
  .replace(/[_-]/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getOrderList = (response) => {
  const orders = response?.orders || response?.data?.orders || response?.data || response || [];
  return Array.isArray(orders) ? orders : [];
};

const getFarmerKey = (item) => {
  const farmer = item?.farmer || item?.product?.farmer || item?.seller || item?.product?.seller;
  if (!farmer) return 'unknown-farmer';
  if (typeof farmer === 'string') return farmer;
  return String(farmer._id || farmer.id || farmer.name || farmer.farmName || 'unknown-farmer');
};

const getFarmerName = (item) => {
  const farmer = item?.farmer || item?.product?.farmer || item?.seller || item?.product?.seller;
  if (typeof farmer === 'string') return farmer;
  return farmer?.farmName || farmer?.businessName || farmer?.name
    || [farmer?.firstName, farmer?.lastName].filter(Boolean).join(' ') || 'Farmer';
};

const getFarmerStatus = (order, farmerKey, items) => {
  const entry = (order.farmerStatuses || []).find((statusEntry) => {
    const farmer = statusEntry.farmer;
    const key = typeof farmer === 'string' ? farmer : farmer?._id || farmer?.id || farmer?.name;
    return String(key || 'unknown-farmer') === farmerKey;
  });
  return formatStatus(entry?.status || items.find((item) => item.status)?.status || 'pending');
};

const mapOrderGroups = (order) => {
  const items = order.items || order.orderItems || order.products || [];
  const groups = new Map();

  items.forEach((item) => {
    const key = getFarmerKey(item);
    const group = groups.get(key) || { farmer: getFarmerName(item), items: [] };
    group.items.push(item);
    groups.set(key, group);
  });

  const orderId = order.orderNumber || order._id || order.id || 'order';
  return Array.from(groups.entries()).map(([farmerKey, group], index) => {
    const firstItem = group.items[0] || {};
    const product = firstItem.product || {};
    const total = group.items.reduce((sum, item) => sum + Number(item.subtotal ?? item.price ?? product.price ?? 0) * Number(item.quantity || 1), 0);
    return {
      id: `${orderId}-${farmerKey}-${index}`,
      orderId,
      product: firstItem.name || product.name || 'Product',
      highlights: group.items.length > 1 ? `+${group.items.length - 1} more items` : '',
      seller: group.farmer,
      date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString(),
      status: getFarmerStatus(order, farmerKey, group.items),
      overallStatus: formatStatus(order.orderStatus || 'pending'),
      expectedTime: order.expectedDeliveryDate || order.deliveryDate || 'Pending confirmation',
      total
    };
  });
};

const CustomerDashboard = () => {
  const { totalItems: wishlistItems } = useWishlist();
  const [profile, setProfile] = useState({});
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    Promise.all([getCurrentUser(), getMyOrders()])
      .then(([profileResponse, ordersResponse]) => {
        setProfile(profileResponse?.user || profileResponse?.data?.user || profileResponse?.data || profileResponse || {});
        setOrders(getOrderList(ordersResponse));
      })
      .catch((error) => setDashboardError(error.message || 'Unable to load your dashboard.'))
      .finally(() => setIsLoading(false));
  }, []);

  const recentOrders = orders.flatMap(mapOrderGroups).slice(0, 5);
  const activeOrders = orders.filter((order) => !['delivered', 'cancelled', 'completed'].includes(String(order.orderStatus || '').toLowerCase())).length;
  const activeDelivery = recentOrders.find((order) => ['Processing', 'Shipped'].includes(order.status));
  const userData = {
    name: profile.firstName || profile.name || 'Customer',
    totalOrders: orders.length,
    activeOrders,
    arrivingToday: 0,
    wishlistItems,
    rewardPoints: Number(profile.rewardPoints || profile.points || 0),
    tier: profile.tier || profile.membershipTier || 'Member Tier'
  };

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
        {isLoading && <p role="status">Loading your dashboard...</p>}
        {dashboardError && <p role="alert" className="checkout-error">{dashboardError}</p>}
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
            {!isLoading && !activeDelivery && <p>No active deliveries.</p>}
            {activeDelivery && (
            <div className="delivery-info">
              <div className="order-reference">
                Order #{activeDelivery.orderId} • {activeDelivery.seller}
              </div>
              <div className="delivery-time">
                <span className="time-label">EXPECTED DELIVERY</span>
                <div className="delivery-eta">{activeDelivery.expectedTime}</div>
              </div>
            </div>
            )}
            
            {/* Delivery Progress */}
            {activeDelivery && <div className="delivery-progress">
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
                <div className="step-label">{activeDelivery.status}</div>
              </div>
              <div className="progress-line"></div>
              
              <div className="progress-step">
                <div className="step-icon">📦</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>}
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
              {!isLoading && recentOrders.map((order) => (
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