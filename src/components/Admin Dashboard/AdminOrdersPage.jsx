import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminOrders, updateAdminOrderStatus } from '../../services/adminService';
import './AdminOrdersPage.css';

const statusOptions = ['All Statuses', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const formatCurrency = (amount) => `₦${amount.toLocaleString('en-NG')}`;

const getInitials = (name) => name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const formatOrder = (order, customer = {}, summary = {}) => {
  const customerRecord = order.customer || order.user || customer;
  const customerName = typeof customerRecord === 'string'
    ? customerRecord
    : customerRecord.name || customerRecord.fullName || customerRecord.customerName || `${customerRecord.firstName || ''} ${customerRecord.lastName || ''}`.trim() || 'Customer';
  const items = Array.isArray(order.items) ? order.items : [];

  return {
    ...order,
    id: order.orderNumber || order._id || order.id,
    customer: customerName,
    customerEmail: customerRecord.email || customerRecord.customerEmail || order.customerEmail || '',
    farmers: Array.isArray(summary.farmers)
      ? summary.farmers.map((farmer) => farmer.farmName || `${farmer.firstName || ''} ${farmer.lastName || ''}`.trim() || farmer.email).filter(Boolean)
      : Array.isArray(order.farmers)
        ? order.farmers
      : items.map((item) => item.farmer?.farmName || item.farmer?.name || item.product?.farmer?.farmName || item.product?.farmer?.name).filter(Boolean),
    items: items.map((item) => ({ ...item, name: item.name || item.product?.name || 'Product', quantity: Number(item.quantity || 0) })),
    total: Number(order.totalAmount ?? order.total ?? order.grandTotal ?? summary.totalSpent ?? 0),
    orderCount: Number(summary.totalOrders || 1),
    summaryItemCount: Number(summary.itemsBought || 0),
    date: new Date(order.createdAt || order.date || Date.now()).toLocaleDateString(),
    status: String(order.status || order.orderStatus || 'Pending').replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  };
};

const normalizeAdminOrders = (response) => {
  const data = response?.data || response || {};
  const orders = data.orders || [];
  if (Array.isArray(orders) && orders.length > 0) {
    return orders.map((order) => formatOrder(order));
  }

  return (Array.isArray(data.customers) ? data.customers : []).flatMap((customerEntry) => {
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
    return (Array.isArray(customerOrders) ? customerOrders : [customerOrders])
      .filter(Boolean)
      .map((order) => formatOrder(order.order || order.orderDetails || order, customer, customerEntry));
  });
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  useEffect(() => {
    getAdminOrders()
      .then((response) => {
        setOrders(normalizeAdminOrders(response));
      })
      .catch((error) => setOrdersError(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrders = orders.filter((order) => {
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchValue || [
      order.id,
      order.customer,
      order.customerEmail,
      ...order.farmers,
      ...order.items.map((item) => item.name)
    ].some((value) => String(value || '').toLowerCase().includes(searchValue));
    const matchesStatus = statusFilter === 'All Statuses' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const customerSummaries = useMemo(() => {
    const summaries = new Map();

    filteredOrders.forEach((order) => {
      const existing = summaries.get(order.customer) || {
        name: order.customer,
        email: order.customerEmail,
        orders: [],
        farmers: new Set(),
        totalSpent: 0,
        itemCount: 0,
        orderCount: 0
      };

      existing.orders.push(order);
      order.farmers.forEach((farmer) => existing.farmers.add(farmer));
      existing.totalSpent = order.orderCount > 1 ? order.total : existing.totalSpent + order.total;
      existing.itemCount = order.summaryItemCount || existing.itemCount + order.items.reduce((sum, item) => sum + item.quantity, 0);
      existing.orderCount = Math.max(existing.orderCount + (order.orderCount > 1 ? order.orderCount : 1), order.orderCount || 0);
      summaries.set(order.customer, existing);
    });

    return Array.from(summaries.values());
  }, [filteredOrders]);

  const metrics = [
    { label: 'Total Orders', value: orders.reduce((sum, order) => sum + (order.orderCount || 1), 0), icon: '🛒', tone: 'green' },
    { label: 'Active Orders', value: orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length, icon: '⏳', tone: 'orange' },
    { label: 'Customers Ordering', value: new Set(orders.map((order) => order.customer)).size, icon: '👥', tone: 'blue' },
    { label: 'Order Value', value: formatCurrency(orders.reduce((sum, order) => sum + order.total, 0)), icon: '💰', tone: 'purple' }
  ];

  const updateOrderStatus = async (orderId, status) => {
    try {
      await updateAdminOrderStatus(orderId, status.toLowerCase());
      setOrders((currentOrders) => currentOrders.map((order) => (
        order.id === orderId ? { ...order, status } : order
      )));
    } catch (error) {
      setOrdersError(error.message);
    }
  };

  return (
    <AdminLayout activeMenu="orders" showSearch={true}>
      <div className="admin-orders-page">
        <div className="admin-orders-page-header">
          <div>
            <h1 className="page-title">Order Management</h1>
            <p className="page-subtitle">Track customer purchases and the farmers fulfilling them.</p>
          </div>
            <div className="orders-header-action">{orders.reduce((sum, order) => sum + (order.orderCount || 1), 0)} Total Orders</div>
        </div>

        <div className="order-metrics-grid">
          {metrics.map((metric) => (
            <div className={`order-metric-card ${metric.tone}`} key={metric.label}>
              <div className="order-metric-icon">{metric.icon}</div>
              <div>
                <p>{metric.label}</p>
                <strong>{metric.value}</strong>
              </div>
            </div>
          ))}
        </div>

        <section className="orders-panel">
          <div className="orders-panel-header">
            <div>
              <h2>Customer Orders</h2>
              <p>Each customer is grouped with their order count, spend, and farmer sources.</p>
            </div>
            <div className="orders-result-count">{customerSummaries.length} customers</div>
          </div>

          <div className="orders-filters">
            <label className="orders-search">
              <span>⌕</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search customer, order, farmer..."
                aria-label="Search orders"
              />
            </label>
            <label className="status-filter">
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusOptions.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>

          <div className="orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Total Orders</th>
                  <th>Items Bought</th>
                  <th>Farmers Ordered From</th>
                  <th>Total Spent</th>
                  <th>Latest Order</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {isLoading && <tr><td colSpan="7">Loading orders...</td></tr>}
                {!isLoading && ordersError && <tr><td colSpan="7" role="alert">{ordersError}</td></tr>}
                {customerSummaries.map((summary) => {
                  const isExpanded = expandedCustomer === summary.name;
                  const latestOrder = summary.orders[0];

                  return (
                    <React.Fragment key={summary.name}>
                      <tr className={isExpanded ? 'customer-row expanded' : 'customer-row'}>
                        <td>
                          <div className="customer-cell">
                            <span className="customer-avatar">{getInitials(summary.name)}</span>
                            <span>
                              <strong>{summary.name}</strong>
                              <small>{summary.email}</small>
                            </span>
                          </div>
                        </td>
                        <td><strong className="order-count">{summary.orders.length}</strong></td>
                        <td>{summary.itemCount}</td>
                        <td>
                          <div className="farmer-list">
                            {Array.from(summary.farmers).map((farmer) => <span key={farmer}>{farmer}</span>)}
                          </div>
                        </td>
                        <td><strong>{formatCurrency(summary.totalSpent)}</strong></td>
                        <td>
                          <span className={`status-pill ${latestOrder.status.toLowerCase()}`}>{latestOrder.status}</span>
                          <small className="latest-date">{latestOrder.date}</small>
                        </td>
                        <td>
                          <button
                            className="details-button"
                            onClick={() => setExpandedCustomer(isExpanded ? null : summary.name)}
                            aria-expanded={isExpanded}
                          >
                            {isExpanded ? 'Hide' : 'View'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="details-row">
                          <td colSpan="7">
                            <div className="customer-orders-detail">
                              <div className="detail-heading">
                                <div>
                                  <h3>{summary.name}'s orders</h3>
                                  <p>{summary.orderCount} orders from {summary.farmers.size} farmer{summary.farmers.size === 1 ? '' : 's'}</p>
                                </div>
                                <strong>{formatCurrency(summary.totalSpent)} total</strong>
                              </div>
                              <div className="customer-order-list">
                                {summary.orders.map((order) => (
                                  <div className="customer-order-item" key={order.id}>
                                    <div className="order-item-main">
                                      <strong>{order.id}</strong>
                                      <span>{order.date}</span>
                                      <span>{order.items.length} product{order.items.length === 1 ? '' : 's'}</span>
                                    </div>
                                    <div className="order-item-farmers">
                                      {order.farmers.map((farmer) => <span key={farmer}>{farmer}</span>)}
                                    </div>
                                    <strong>{formatCurrency(order.total)}</strong>
                                    <select
                                      className={`status-select ${order.status.toLowerCase()}`}
                                      value={order.status}
                                      onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                                      aria-label={`Update status for ${order.id}`}
                                    >
                                      {statusOptions.slice(1).map((status) => <option key={status}>{status}</option>)}
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            {customerSummaries.length === 0 && (
              <div className="empty-orders">No orders match the current search and status filter.</div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
