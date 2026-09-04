import React, { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { orders as initialOrders } from '../../data/orders';
import './AdminOrdersPage.css';

const statusOptions = ['All Statuses', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const formatCurrency = (amount) => `₦${amount.toLocaleString('en-NG')}`;

const getInitials = (name) => name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [expandedCustomer, setExpandedCustomer] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const searchValue = searchTerm.trim().toLowerCase();
    const matchesSearch = !searchValue || [
      order.id,
      order.customer,
      order.customerEmail,
      ...order.farmers,
      ...order.items.map((item) => item.name)
    ].some((value) => value.toLowerCase().includes(searchValue));
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
        itemCount: 0
      };

      existing.orders.push(order);
      order.farmers.forEach((farmer) => existing.farmers.add(farmer));
      existing.totalSpent += order.total;
      existing.itemCount += order.items.reduce((sum, item) => sum + item.quantity, 0);
      summaries.set(order.customer, existing);
    });

    return Array.from(summaries.values());
  }, [filteredOrders]);

  const metrics = [
    { label: 'Total Orders', value: orders.length, icon: '🛒', tone: 'green' },
    { label: 'Active Orders', value: orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length, icon: '⏳', tone: 'orange' },
    { label: 'Customers Ordering', value: new Set(orders.map((order) => order.customer)).size, icon: '👥', tone: 'blue' },
    { label: 'Order Value', value: formatCurrency(orders.reduce((sum, order) => sum + order.total, 0)), icon: '💰', tone: 'purple' }
  ];

  const updateOrderStatus = (orderId, status) => {
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId ? { ...order, status } : order
    )));
  };

  return (
    <AdminLayout activeMenu="orders" showSearch={true}>
      <div className="admin-orders-page">
        <div className="admin-orders-page-header">
          <div>
            <h1 className="page-title">Order Management</h1>
            <p className="page-subtitle">Track customer purchases and the farmers fulfilling them.</p>
          </div>
          <div className="orders-header-action">{orders.length} Total Orders</div>
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
                                  <p>{summary.orders.length} orders from {summary.farmers.size} farmer{summary.farmers.size === 1 ? '' : 's'}</p>
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
