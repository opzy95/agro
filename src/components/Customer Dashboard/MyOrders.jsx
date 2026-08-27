import React, { useState } from 'react';
import tomatoImg from '../../assets/tomato.png';
import bowlImg from '../../assets/bowl.png';
import './MyOrders.css';

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data
  const orders = [
    {
      id: 'HH-8923',
      datePlaced: 'Oct 12, 2024',
      status: 'Delivered',
      total: 102.50,
      items: [
        {
          id: 1,
          name: 'Premium Hass Avocados (Box)',
          source: 'Sourced from Valley Farms',
          price: 42.00,
          quantity: 2,
          image: bowlImg
        },
        {
          id: 2,
          name: 'Heirloom Tomatoes Mix',
          source: 'Sourced from Sunrise Acres',
          price: 18.50,
          quantity: 1,
          image: tomatoImg
        }
      ]
    },
    {
      id: 'HH-9041',
      datePlaced: 'Oct 24, 2024',
      status: 'In Transit',
      total: 135.00,
      items: [
        {
          id: 1,
          name: 'Artisanal Coffee Beans (5kg)',
          source: 'Sourced from Highland Roasters',
          price: 120.00,
          quantity: 1,
          image: bowlImg
        }
      ]
    },
    {
      id: 'HH-9102',
      datePlaced: 'Oct 26, 2024',
      status: 'Processing',
      total: 55.00,
      items: [
        {
          id: 1,
          name: 'Bulk Organic Romaine',
          source: 'Sourced from Green Leaf Farms',
          price: 45.00,
          quantity: 3,
          image: tomatoImg
        }
      ]
    },
    {
      id: 'HH-9158',
      datePlaced: 'Oct 28, 2024',
      status: 'Cancelled',
      total: 28.00,
      items: [
        {
          id: 1,
          name: 'Fresh Garden Produce Box',
          source: 'Sourced from Green Leaf Farms',
          price: 28.00,
          quantity: 1,
          image: bowlImg
        }
      ]
    }
  ];

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
        {filteredOrders.map((order) => (
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