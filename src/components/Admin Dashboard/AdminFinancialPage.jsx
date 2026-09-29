import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  approveAdminWithdrawal,
  getAdminFinancials,
  getAdminWithdrawals,
  rejectAdminWithdrawal
} from '../../services/adminService';
import './AdminFinancialPage.css';


const getPersonName = (person) => {
  if (!person) return 'Unknown farmer';
  if (typeof person === 'string') return person;
  return person.name
    || person.fullName
    || `${person.firstName || ''} ${person.lastName || ''}`.trim()
    || person.email
    || 'Unknown farmer';
};

const getInitials = (name) => String(name || 'UF')
  .split(' ')
  .filter(Boolean)
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const AdminFinancialPage = () => {
  const [timeRange, setTimeRange] = useState('7days');

  const [financialData, setFinancialData] = useState({ stats: [], transactions: [], chartData: [] });
  const [payoutQueue, setPayoutQueue] = useState([]);
  const [payoutLoading, setPayoutLoading] = useState(true);
  const [payoutError, setPayoutError] = useState('');
  const [payoutActionId, setPayoutActionId] = useState('');
  const [payoutRefreshKey, setPayoutRefreshKey] = useState(0);

  useEffect(() => {
    getAdminFinancials(timeRange).then((response) => {
      const data = response?.data || response || {};
      setFinancialData({ stats: data.stats || [], transactions: data.transactions || [], chartData: data.chartData || [] });
    }).catch(() => setFinancialData({ stats: [], transactions: [], chartData: [] }));
  }, [timeRange]);

  useEffect(() => {
    let active = true;
    setPayoutLoading(true);
    getAdminWithdrawals().then((response) => {
      if (!active) return;
      const data = response?.data || response || {};
      setPayoutQueue(Array.isArray(data.withdrawals) ? data.withdrawals : []);
      setPayoutError('');
    }).catch((error) => {
      if (!active) return;
      setPayoutQueue([]);
      setPayoutError(error.message || 'Unable to load withdrawals.');
    }).finally(() => {
      if (active) setPayoutLoading(false);
    });
    return () => { active = false; };
  }, [payoutRefreshKey]);

  const { stats, transactions, chartData } = financialData;
  /*
  const legacyPayoutQueue = [
    {
      id: 'FRM-8921',
      farmer: 'Oakridge Farms',
      initials: 'OF',
      bankName: 'GreenField Bank',
      accountNumber: '**** 8921',
      balance: '$12,450.00',
      fee: '$622.50 (5%)',
      status: 'Pending',
      action: 'Approve'
    },
    {
      id: 'FRM-4432',
      farmer: 'Valley Veggies',
      initials: 'VV',
      bankName: 'Harvest Trust',
      accountNumber: '**** 4432',
      balance: '$8,120.00',
      fee: '$486.00 (5%)',
      status: 'Pending',
      action: 'Approve'
    },
    {
      id: 'FRM-1109',
      farmer: 'Sunrise Orchards',
      initials: 'SO',
      bankName: 'Farmers First Bank',
      accountNumber: '**** 1109',
      balance: '$4,500.00',
      fee: '$225.00 (5%)',
      status: 'Cleared',
      action: 'Processed'
    }
  ];

  const legacyTransactions = [
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

  const legacyChartData = [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 25 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 32 },
    { month: 'May', value: 38 },
    { month: 'Jun', value: 42 }
  ];

  ]; */

  const maxValue = Math.max(...chartData.map((data) => data.value), 1);

  const getStatusColor = (status) => {
    switch (String(status || '').toLowerCase()) {
      case 'complete':
      case 'paid':
        return 'complete';
      case 'processing':
        return 'processing';
      case 'pending':
        return 'pending';
      case 'cleared':
        return 'cleared';
      case 'rejected':
        return 'rejected';
      default:
        return '';
    }
  };

  const handleWithdrawalAction = async (withdrawal, action) => {
    const withdrawalId = withdrawal._id || withdrawal.id;
    if (!withdrawalId || payoutActionId) return;

    let rejectionReason = '';
    if (action === 'reject') {
      rejectionReason = window.prompt('Enter a reason for rejecting this withdrawal:')?.trim() || '';
      if (!rejectionReason) return;
    } else if (!window.confirm('Approve and mark this withdrawal as paid?')) {
      return;
    }

    setPayoutActionId(withdrawalId);
    setPayoutError('');
    try {
      if (action === 'approve') await approveAdminWithdrawal(withdrawalId);
      else await rejectAdminWithdrawal(withdrawalId, rejectionReason);
      setPayoutRefreshKey((current) => current + 1);
    } catch (error) {
      setPayoutError(error.message || `Unable to ${action} withdrawal.`);
    } finally {
      setPayoutActionId('');
    }
  };

  const formatMoney = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG')}`;

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
                    <th>Bank Name</th>
                    <th>Account Number</th>
                    <th>Amount</th>
                    <th>Platform Fee</th>
                    <th>Net Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutLoading && <tr><td colSpan="8">Loading withdrawal requests...</td></tr>}
                  {!payoutLoading && payoutError && <tr><td colSpan="8">{payoutError}</td></tr>}
                  {!payoutLoading && !payoutError && payoutQueue.length === 0 && <tr><td colSpan="8">No withdrawal requests found.</td></tr>}
                  {!payoutLoading && payoutQueue.map((payout) => {
                    const bankAccount = payout.bankAccount || {};
                    const status = String(payout.status || 'pending').toLowerCase();
                    const withdrawalId = payout._id || payout.id;
                    return (
                    <tr key={withdrawalId}>
                      <td className="farmer-cell">
                        <div className="farmer-info">
                          <div className="farmer-avatar">{getInitials(getPersonName(payout.farmer || payout.user))}</div>
                          <div>
                            <p className="farmer-name">{getPersonName(payout.farmer || payout.user)}</p>
                            <p className="farmer-id">ID: {withdrawalId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="bank-cell">{bankAccount.bankName || 'Not provided'}</td>
                      <td className="account-cell">{bankAccount.accountNumber || 'Not provided'}</td>
                      <td className="balance-cell">{formatMoney(payout.amount)}</td>
                      <td className="fee-cell">{formatMoney(payout.platformFee)}</td>
                      <td className="balance-cell">{formatMoney(payout.netAmount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(status)}`}>
                          {status === 'pending' && '●'} {status}
                        </span>
                      </td>
                      <td className="action-cell">
                        {status === 'pending' ? (
                          <div className="withdrawal-actions">
                            <button className="btn-approve" disabled={Boolean(payoutActionId)} onClick={() => handleWithdrawalAction(payout, 'approve')}>
                              {payoutActionId === withdrawalId ? 'Working...' : 'Approve'}
                            </button>
                            <button className="btn-reject" disabled={Boolean(payoutActionId)} onClick={() => handleWithdrawalAction(payout, 'reject')}>
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="processed-text">{status}</span>
                        )}
                      </td>
                    </tr>
                  );})}
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
