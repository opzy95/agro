import React, { useEffect, useState } from 'react';
import bowlImg from '../../assets/bowl.png';
import { confirmOrderReceived, getMyOrders } from '../../services/orderService';
import './MyOrders.css';

const MyOrders = () => {
  const [activeFilter, setActiveFilter] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [confirmingOrderId, setConfirmingOrderId] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const normalizeDeliveryMethod = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[ -]+/g, '_');

  const getFarmName = (item, product) => {
    const farmer = item.farmer || product.farmer || item.seller || product.seller || {};
    if (typeof farmer === 'string') return farmer;
    return farmer.farmName
      || farmer.businessName
      || farmer.farm_name
      || farmer.name
      || [farmer.firstName, farmer.lastName].filter(Boolean).join(' ')
      || 'Farmer';
  };

  const getProductId = (order) => {
    const item = order?.items?.[0] || order?.orderItems?.[0] || order?.products?.[0];
    const product = item?.product;
    return order?.productId
      || order?.productID
      || item?.productId
      || item?.productID
      || product?._id
      || product?.id
      || (typeof product === 'string' ? product : null);
  };

  const getItemProductId = (item) => {
    const product = item?.product;
    return item?.productId
      || item?.productID
      || product?._id
      || product?.id
      || (typeof product === 'string' ? product : null);
  };

  const getFarmerKey = (item, product) => {
    const farmer = item?.farmer || product?.farmer || item?.seller || product?.seller;
    if (!farmer) return 'unknown-farmer';
    if (typeof farmer === 'string') return farmer;
    return String(farmer._id || farmer.id || getFarmName(item, product));
  };

  const getFarmerStatus = (order, farmerKey, items) => {
    const statusEntry = (order.farmerStatuses || []).find((entry) => {
      const farmer = entry.farmer;
      const key = typeof farmer === 'string' ? farmer : farmer?._id || farmer?.id || farmer?.name;
      return String(key || 'unknown-farmer') === farmerKey;
    });
    return formatStatus(statusEntry?.status || items.find((item) => item.status)?.status || 'pending');
  };

  const getConfirmablePickupItem = (order) => {
    const items = order?.items || order?.orderItems || order?.products || [];
    return items.find((item) => {
      const status = String(item.status || item.itemStatus || item.fulfillmentStatus || item.deliveryStatus || '').toLowerCase();
      const method = normalizeDeliveryMethod(item.deliveryMethod || item.deliveryType || item.shippingMethod || order.deliveryMethod || order.delivery?.method);
      return status === 'processing' && method === 'farm_pickup';
    });
  };

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const response = await getMyOrders();
        const rawOrders = response?.orders || response?.data?.orders || response?.data || response || [];
        const orderList = Array.isArray(rawOrders) ? rawOrders : [];

        setOrders(orderList.flatMap((order) => {
          const rawItems = order.items || order.orderItems || order.products || [];
          const mappedItems = rawItems.map((item, index) => {
            const product = item.product || {};
            return {
              id: product._id || product.id || item.productId || item._id || index,
              productId: getItemProductId(item),
              name: item.name || product.name || 'Product',
              source: getFarmName(item, product),
              price: Number(item.price ?? product.price ?? 0),
              quantity: Number(item.quantity || 0),
              status: formatStatus(item.status || item.itemStatus || item.fulfillmentStatus || item.deliveryStatus || ''),
              image: product.image || product.images?.[0] || bowlImg
            };
          });
          const groups = new Map();
          mappedItems.forEach((item, index) => {
            const rawItem = rawItems[index] || {};
            const product = rawItem.product || {};
            const key = getFarmerKey(rawItem, product);
            const group = groups.get(key) || { items: [], farmer: item.source };
            group.items.push({ ...item, deliveryMethod: normalizeDeliveryMethod(rawItem.deliveryMethod || rawItem.deliveryType || rawItem.shippingMethod || order.deliveryMethod || order.delivery?.method || 'farm_pickup') });
            groups.set(key, group);
          });

          const orderId = order.orderNumber || order._id || order.id;
          return Array.from(groups.values()).map((group, groupIndex) => {
            const groupItems = group.items;
            const deliveredCount = groupItems.filter((item) => item.status === 'Delivered').length;
            const status = getFarmerStatus(order, getFarmerKey(groupItems[0], rawItems[0]?.product), groupItems);
            const pickupItem = groupItems.find((item) => item.status === 'Processing' && item.deliveryMethod === 'farm_pickup');

            return {
              id: `${orderId}-${getFarmerKey(groupItems[0], rawItems[0]?.product)}-${groupIndex}`,
              orderId,
              farmer: group.farmer,
              overallStatus: formatStatus(order.orderStatus || 'pending'),
              productId: groupItems[0]?.productId || getProductId(order),
              productIds: groupItems.map((item) => item.productId).filter(Boolean),
              datePlaced: new Date(order.createdAt || order.datePlaced || Date.now()).toLocaleDateString(),
              status,
              itemStatus: pickupItem?.status || status,
              itemDeliveryMethod: pickupItem?.deliveryMethod || groupItems[0]?.deliveryMethod,
              confirmablePickupProductId: pickupItem?.productId,
              deliveryMethod: groupItems[0]?.deliveryMethod || 'farm_pickup',
              total: groupItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
              items: groupItems
            };
          });
        }));
      } catch (error) {
        setOrdersError(error.message || 'Unable to load your orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [reloadKey]);

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
      case 'Shipped':
        return null;
      case 'In Transit':
        return <button className="action-btn track-btn">Track Order</button>;
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

  const handleConfirmReceived = async (orderId) => {
    try {
      setOrdersError('');
      setConfirmingOrderId(orderId);
      const order = orders.find((item) => item.id === orderId);
      if (!order?.productId) {
        throw new Error('This order is missing its product ID, so delivery cannot be confirmed.');
      }

      await confirmOrderReceived(order.orderId, order.productId);
      setReloadKey((value) => value + 1);
    } catch (error) {
      setOrdersError(error.message || 'Unable to confirm that this order was received.');
    } finally {
      setConfirmingOrderId('');
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
                <span className={`status-badge ${getStatusClass(order.overallStatus)}`}>
                  Overall: {order.overallStatus}
                </span>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  {order.farmer}: {order.status}
                </span>
                {((order.status === 'Shipped' && order.deliveryMethod !== 'farm_pickup') ||
                  (order.confirmablePickupProductId && order.itemStatus === 'Processing' && order.itemDeliveryMethod === 'farm_pickup')) && (
                  <button
                    className="delivered-btn"
                    onClick={() => handleConfirmReceived(order.id)}
                    disabled={confirmingOrderId === order.id}
                  >
                    {confirmingOrderId === order.id
                      ? 'Confirming...'
                      : order.deliveryMethod === 'farm_pickup' ? 'Confirm Pickup' : 'Mark Delivered'}
                  </button>
                )}
              </div>
            </div>

            {/* Order Content */}
            <div className="order-content">
              {/* Items Section */}
              <div className="items-section">
                <h4 className="items-title">ITEMS FROM {order.farmer}</h4>
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