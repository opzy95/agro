import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminFinancialPage.css';

const AdminFinancialPage = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const stats = [
    {
      title: 'PLATFORM COMMISSION',
      value: '$124,500.00',
      trend: '+12.45 vs last month',
      icon: '💰',
      color: 'default'
    },
    {
      title: 'TOTAL PAYOUTS MTD',
      value: '$842,100.50',
      subtitle: '1,204 transactions completed',
      icon: '💸',
      color: 'default'
    },
    {
      title: 'PENDING BALANCES',
      value: '$45,230.00',
      subtitle: '34 farmers awaiting payout',
      icon: '⏳',
      color: 'warning'
    }
  ];

  const payoutQueue = [
    {
      id: 'FRM-8921',
      farmer: 'Oakridge Farms',
      initials: 'OF',
      balance: '$12,450.00',
      fee: '$622.50 (5%)',
      status: 'Pending',
      action: 'Approve'
    },
    {
      id: 'FRM-4432',
      farmer: 'Valley Veggies',
      initials: 'VV',
      balance: '$8,120.00',
      fee: '$486.00 (5%)',
      status: 'Pending',
      action: 'Approve'
    },
    {
      id: 'FRM-1109',
      farmer: 'Sunrise Orchards',
      initials: 'SO',
      balance: '$4,500.00',
      fee: '$225.00 (5%)',
      status: 'Cleared',
      action: 'Processed'
    }
  ];

  const transactions = [
    {
      id: '#TX-99281',
      date: 'Oct 24, 14:30',
      entity: 'Green Valley Co-op',
      grossAmount: '$2,450.00',
      platformFee: '-$122.50',
      netPayout: '$2,327.50',
      status: 'Complete'
    },
    {
      id: '#TX-99280',
      date: 'Oct 24, 11:15',
      entity: 'Sunny Side Farms',
      grossAmount: '$890.00',
      platformFee: '-$44.50',
      netPayout: '$845.50',
      status: 'Complete'
    },
    {
      id: '#TX-99279',
      date: 'Oct 23, 16:45',
      entity: 'Riverdale Organics',
      grossAmount: '$1,280.00',
      platformFee: '-$60.00',
      netPayout: '$1,140.00',
      status: 'Processing'
    }
  ];

  const chartData = [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 25 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 32 },
    { month: 'May', value: 38 },
    { month: 'Jun', value: 42 }
  ];

  const maxValue = 45;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'complete';
      case 'Processing':
        return 'processing';
      case 'Pending':
        return 'pending';
      case 'Cleared':
        return 'cleared';
      default:
        return '';
    }
  };

  return (
    <AdminLayout activeMenu="financial" showSearch={true}>
      <div className="admin-financial-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Financial Settlement</h1>
            <p className="page-subtitle">Platform revenue and payout management</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">📥 Export CSV</button>
            <button className="btn-primary">✅ Process All Payouts</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <p className="stat-label">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
              {stat.subtitle && (
                <p className="stat-subtitle">{stat.subtitle}</p>
              )}
              {stat.trend && (
                <p className="stat-trend">📈 {stat.trend}</p>
              )}
              <span className="stat-icon">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="financial-grid">
          {/* Payout Queue */}
          <div className="payout-section">
            <div className="section-header">
              <h2 className="section-title">Payout Queue</h2>
              <span className="requires-approval">Requires Approval</span>
            </div>

            <div className="table-wrapper">
              <table className="payout-table">
                <thead>
                  <tr>
                    <th>Farmer/Vendor</th>
                    <th>Available Balance</th>
                    <th>Platform Fee</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutQueue.map((payout, index) => (
                    <tr key={index}>
                      <td className="farmer-cell">
                        <div className="farmer-info">
                          <div className="farmer-avatar">{payout.initials}</div>
                          <div>
                            <p className="farmer-name">{payout.farmer}</p>
                            <p className="farmer-id">ID: {payout.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="balance-cell">{payout.balance}</td>
                      <td className="fee-cell">{payout.fee}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(payout.status)}`}>
                          {payout.status === 'Pending' && '●'} {payout.status}
                        </span>
                      </td>
                      <td className="action-cell">
                        {payout.status === 'Pending' ? (
                          <button className="btn-approve">{payout.action}</button>
                        ) : (
                          <span className="processed-text">{payout.action}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commission Growth Chart */}
          <div className="chart-section">
            <h3 className="section-title">Commission Growth</h3>
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
                <span>$10k</span>
                <span>$20k</span>
                <span>$30k</span>
                <span>$40k</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions & Fee Breakdown</h2>
            <select 
              className="time-filter"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Txn ID</th>
                  <th>Date & Time</th>
                  <th>Entity</th>
                  <th>Gross Amount</th>
                  <th>Platform Fee</th>
                  <th>Net Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td className="txn-id">{txn.id}</td>
                    <td className="date-time">{txn.date}</td>
                    <td className="entity">{txn.entity}</td>
                    <td className="amount">{txn.grossAmount}</td>
                    <td className="fee">{txn.platformFee}</td>
                    <td className="payout-amount">{txn.netPayout}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="view-all-link-wrapper">
              <a href="#" className="view-all-link">View All Transactions →</a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFinancialPage;
