import React, { useEffect, useState } from 'react';
import bowlImg from '../../assets/bowl.png';
import { getMyOrders } from '../../services/orderService';
import './MyOrders.css';

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getMyOrders();
        const rawOrders = response?.orders || response?.data?.orders || response?.data || response || [];
        const orderList = Array.isArray(rawOrders) ? rawOrders : [];

        setOrders(orderList.map((order) => ({
          id: order.orderNumber || order._id || order.id,
          datePlaced: new Date(order.createdAt || order.datePlaced || Date.now()).toLocaleDateString(),
          status: formatStatus(order.status || order.orderStatus || 'Processing'),
          total: Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0),
          items: (order.items || []).map((item, index) => {
            const product = item.product || {};
            return {
              id: product._id || product.id || item._id || index,
              name: item.name || product.name || 'Product',
              source: product.farmer?.farmName || product.seller?.name || 'AgroFresh marketplace',
              price: Number(item.price ?? product.price ?? 0),
              quantity: Number(item.quantity || 0),
              image: product.image || product.images?.[0] || bowlImg
            };
          })
        })));
      } catch (error) {
        setOrdersError(error.message || 'Unable to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatStatus = (status) => {
    return String(status)
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const filterOptions = ['All Orders', 'Ongoing', 'Completed', 'Cancelled'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return '✅';
      case 'In Transit':
        return '📦';
      case 'Processing':
        return '⏳';
      case 'Cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'In Transit':
        return 'status-transit';
      case 'Processing':
        return 'status-processing';
      case 'Cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  };

  const getActionButton = (status, orderId) => {
    switch (status) {
      case 'Delivered':
        return (
          <button className="action-btn reorder-btn">
            Reorder
          </button>
        );
      case 'In Transit':
        return (
          <button className="action-btn track-btn">
            Track Order
          </button>
        );
      case 'Processing':
        return (
          <button className="action-btn view-btn">
            View Details
          </button>
        );
      default:
        return (
          <button className="action-btn view-btn">
            View Details
          </button>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === 'All Orders' ||
      (activeFilter === 'Ongoing' && ['In Transit', 'Processing'].includes(order.status)) ||
      (activeFilter === 'Completed' && order.status === 'Delivered') ||
      (activeFilter === 'Cancelled' && order.status === 'Cancelled');
    const searchValue = searchTerm.toLowerCase();
    const matchesSearch =
      !searchValue ||
      order.id.toLowerCase().includes(searchValue) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchValue));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="my-orders">
      {/* Header Section */}
      <div className="orders-header">
        <div className="header-content">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">
            View and manage your recent purchases and active deliveries.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-controls">
        <div className="filter-tabs">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Order ID or Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {isLoading && <p className="orders-empty">Loading your orders...</p>}
        {!isLoading && ordersError && <p className="orders-empty checkout-error" role="alert">{ordersError}</p>}
        {!isLoading && !ordersError && filteredOrders.length === 0 && (
          <p className="orders-empty">You have no orders yet.</p>
        )}
        {!isLoading && !ordersError && filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            {/* Order Header */}
            <div className="order-header">
              <div className="order-info">
                <div className="order-id-section">
                  <span className="order-label">ORDER ID</span>
                  <h3 className="order-id">#{order.id}</h3>
                </div>
                <div className="order-date-section">
                  <span className="date-label">DATE PLACED</span>
                  <p className="order-date">{order.datePlaced}</p>
                </div>
              </div>
              <div className="order-status">
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Order Content */}
            <div className="order-content">
              {/* Items Section */}
              <div className="items-section">
                <h4 className="items-title">ITEMS IN ORDER</h4>
                <div className="items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h5 className="item-name">{item.name}</h5>
                        <p className="item-source">{item.source}</p>
                      </div>
                      <div className="item-pricing">
                        <div className="item-price">${item.price.toFixed(2)}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-content">
                  <div className="total-section">
                    <span className="total-label">ORDER TOTAL</span>
                    <div className="total-price">${order.total.toFixed(2)}</div>
                  </div>
                  
                  <div className="order-actions">
                    {getActionButton(order.status, order.id)}
                    <div className="secondary-actions">
                      <button className="secondary-btn">View Details</button>
                      <button className="secondary-btn">Get Help</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="orders-footer">
        <div className="footer-brand">
          <h3 className="footer-title">HarvestHub</h3>
        </div>
        <div className="footer-links">
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#vendor" className="footer-link">Vendor Portal</a>
          <a href="#sustainability" className="footer-link">Sustainability Report</a>
          <a href="#contact" className="footer-link">Contact Us</a>
        </div>
        <div className="footer-copyright">
          © 2024 HarvestHub Marketplace. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default MyOrders;