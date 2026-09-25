import React, { useEffect, useState } from 'react';
import FarmerLayout from './FarmerLayout';
import { cancelOrder, getFarmerOrders, updateOrderStatus } from '../../services/orderService';
import { getCurrentUser } from '../../services/userService';
import './FarmerOrdersPage.css';

const formatStatus = (status) => String(status || 'Pending')
  .replace(/[_-]/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getResponseList = (response) => {
  const data = response?.orders || response?.data?.orders || response?.data || response || [];
  return Array.isArray(data) ? data : [];
};

const getEntityKey = (value) => {
  if (!value) return 'unknown-farmer';
  if (typeof value === 'string') return value;
  return String(value._id || value.id || value.farmerId || value.name || 'unknown-farmer');
};

const getProductId = (item) => {
  const product = item?.product;
  return item?.productId || product?._id || product?.id || (typeof product === 'string' ? product : null);
};

const getFarmerStatus = (order, farmerKey, items) => {
  const farmerStatus = (order.farmerStatuses || []).find((entry) => (
    getEntityKey(entry.farmer) === farmerKey
  ));
  return formatStatus(farmerStatus?.status || items.find((item) => item.status)?.status || 'pending');
};

const mapOrder = (order, index) => {
  const customer = order.customer || order.user || order.buyer || {};
  const items = order.items || [];
  const customerName = typeof customer === 'string'
    ? customer
    : customer.name || customer.fullName || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer';
  const deliveryMethod = String(order.deliveryMethod || 'farm_pickup').toLowerCase();
  const shippingAddress = order.shippingAddress;
  const addressText = typeof shippingAddress === 'string'
    ? shippingAddress
    : shippingAddress
      ? [shippingAddress.address, shippingAddress.city, shippingAddress.state, shippingAddress.postalCode].filter(Boolean).join(', ')
      : '';

  const groups = new Map();
  items.forEach((item) => {
    const product = item.product || {};
    const farmerKey = getEntityKey(item.farmer || product.farmer || item.seller || product.seller);
    const group = groups.get(farmerKey) || { farmerKey, items: [] };
    group.items.push({ ...item, product, productId: getProductId(item) });
    groups.set(farmerKey, group);
  });

  return Array.from(groups.values()).map((group, groupIndex) => {
    const firstItem = group.items[0] || {};
    const product = firstItem.product || {};
    const productName = firstItem.name || product.name || 'Product';
    const quantity = group.items.reduce((total, item) => total + Number(item.quantity || 0), 0) || Number(order.quantity || 0);
    const amount = group.items.reduce((total, item) => total + Number(item.subtotal ?? item.price ?? 0) * Number(item.quantity || 1), 0);
    const orderId = order._id || order.id || order.orderNumber || `order-${index}`;
    return {
      id: `${orderId}-${group.farmerKey}-${groupIndex}`,
      orderId,
      productId: firstItem.productId,
      customer: customerName,
      customerInitials: customerName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      farmer: group.farmerKey,
      product: productName,
      products: group.items.map((item) => item.name || item.product?.name || 'Product'),
      date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString(),
      quantity: quantity ? `${quantity} item${quantity === 1 ? '' : 's'}` : 'N/A',
      amount: `₦${Number(amount).toLocaleString()}`,
      status: getFarmerStatus(order, group.farmerKey, group.items),
      deliveryMethodKey: deliveryMethod,
      deliveryMethod: formatStatus(deliveryMethod),
      shippingAddress: deliveryMethod === 'farm_pickup' ? 'Farm pickup location' : addressText || 'Address unavailable',
      searchText: `${customerName} ${group.items.map((item) => item.name || item.product?.name || '').join(' ')} ${order.orderNumber || order._id || order.id || ''}`.toLowerCase()
    };
  });
};

const FarmerOrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const [farmer, setFarmer] = useState({
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null,
    verificationStatus: 'not_verified'
  });

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        const user = response?.user || response?.data?.user || response?.data || response;
     setFarmer({
          name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Green Valley Farm',
          farmName: user?.farmName || 'Premium Producer',
          avatar: user?.profileImage || null,
          verificationStatus: user?.verificationStatus || (user?.isVerified ? 'verified' : 'not_verified')
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getFarmerOrders();
        setOrders(getResponseList(response).flatMap(mapOrder));
      } catch (error) {
        setOrdersError(error.message || 'Unable to load farmer orders.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getNextStatus = (order) => {
    if (order.status === 'Pending') return 'Processing';
    if (order.status === 'Processing' && order.deliveryMethodKey !== 'farm_pickup') return 'Shipped';
    return null;
  };

  const handleUpdateOrderStatus = async (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    const status = order && getNextStatus(order);
    if (!status) return;

    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(order.orderId, status);
      const response = await getFarmerOrders();
      setOrders(getResponseList(response).flatMap(mapOrder));
    } catch (error) {
      setOrdersError(error.message || 'Unable to update the order status.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;

    try {
      setUpdatingOrderId(orderId);
      const order = orders.find((item) => item.id === orderId);
      await cancelOrder(order?.orderId || orderId);
      const response = await getFarmerOrders();
      setOrders(getResponseList(response).flatMap(mapOrder));
    } catch (error) {
      setOrdersError(error.message || 'Unable to cancel the order.');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const orderStats = [
    { title: 'TOTAL ORDERS', value: orders.length, icon: '📊', color: 'total' },
    { title: 'PENDING', value: orders.filter((order) => order.status === 'Pending').length, icon: '⏳', color: 'pending' },
    { title: 'PROCESSING', value: orders.filter((order) => order.status === 'Processing').length, icon: '🚛', color: 'processing' },
    { title: 'COMPLETED', value: orders.filter((order) => ['Completed', 'Delivered'].includes(order.status)).length, icon: '✅', color: 'completed' }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
    { id: 'processing', label: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
    { id: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
    { id: 'cancelled', label: 'Cancelled', count: 0 }
  ];

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === selectedTab);
  const searchedOrders = filteredOrders;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'completed';
      case 'Processing': return 'processing';
      case 'Shipped': return 'shipped';
      case 'Delivered': return 'delivered';
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
                  {stat.color === 'total' && <span className="orders-stat-icon">📊</span>}
                  {stat.color === 'pending' && <span className="orders-stat-icon">⏳</span>}
                  {stat.color === 'processing' && <span className="orders-stat-icon">🚛</span>}
                  {stat.color === 'completed' && <span className="orders-stat-icon">✅</span>}
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
                <th>Delivery Method</th>
                <th>Shipping Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan="10">Loading orders...</td></tr>}
              {!isLoading && ordersError && <tr><td colSpan="10" role="alert">{ordersError}</td></tr>}
              {!isLoading && !ordersError && searchedOrders.length === 0 && <tr><td colSpan="10">No orders found.</td></tr>}
              {!isLoading && !ordersError && searchedOrders.map((order) => (
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
                  <td>{order.products.join(', ')}</td>
                  <td>{order.date}</td>
                  <td>{order.quantity}</td>
                  <td className="amount">{order.amount}</td>
                  <td>{order.deliveryMethod}</td>
                  <td className="shipping-address">{order.shippingAddress}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.status)}`}>
                      {order.status === 'Pending' && '● '}
                      {order.status === 'Processing' && '● '}
                      {order.status === 'Shipped' && '● '}
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div className="order-status-actions">
                      {getNextStatus(order) && (
                        <button
                          type="button"
                          className="advance-status-btn"
                          onClick={() => handleUpdateOrderStatus(order.id)}
                          disabled={updatingOrderId === order.id}
                        >
                          {updatingOrderId === order.id ? 'Updating...' : `Mark ${getNextStatus(order)}`}
                        </button>
                      )}
                      {order.status === 'Pending' && (
                        <button
                          type="button"
                          className="cancel-order-btn"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={updatingOrderId === order.id}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="orders-pagination">
          <div className="pagination-info">
            Showing {searchedOrders.length} of {orders.length} entries
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