import React, { useEffect, useState } from 'react';
import FarmerLayout from './FarmerLayout';
import { getCurrentUser } from '../../services/userService';
import { getFarmerEarningsData } from '../../services/farmerService';
import './FarmerEarningsPage.css';

const FarmerEarningsPage = () => {
  const [farmer, setFarmer] = useState({
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null,
    verificationStatus: 'not_verified'
  });
  const [earningsData, setEarningsData] = useState({ orders: [], wallet: {}, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [earningsError, setEarningsError] = useState('');

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
    getFarmerEarningsData()
      .then(setEarningsData)
      .catch((error) => setEarningsError(error.message || 'Unable to load earnings.'))
      .finally(() => setIsLoading(false));
  }, []);

  const earningsStats = [
    { title: 'Total Revenue', amount: `₦${earningsData.totalRevenue.toLocaleString('en-NG')}`, icon: '💳', color: 'default' },
    { title: 'Available Balance', amount: `₦${Number(earningsData.wallet.availableBalance ?? earningsData.wallet.balance ?? 0).toLocaleString('en-NG')}`, icon: '💰', color: 'primary', action: 'Withdraw' },
    { title: 'Pending Payouts', amount: `₦${Number(earningsData.wallet.pendingBalance ?? earningsData.wallet.pendingPayouts ?? 0).toLocaleString('en-NG')}`, icon: '⏳', color: 'warning' },
    { title: 'Last Payout', amount: `₦${Number(earningsData.wallet.lastPayout?.amount ?? 0).toLocaleString('en-NG')}`, date: earningsData.wallet.lastPayout?.createdAt ? new Date(earningsData.wallet.lastPayout.createdAt).toLocaleDateString() : '', icon: '✓', color: 'success' }
  ];

  const recentPayouts = (earningsData.wallet.payouts || earningsData.wallet.withdrawals || []).slice(0, 5).map((payout, index) => ({ id: payout._id || payout.id || index, type: payout.type || 'Bank Transfer', amount: `₦${Number(payout.amount || 0).toLocaleString('en-NG')}`, date: new Date(payout.createdAt || payout.date || Date.now()).toLocaleDateString(), status: String(payout.status || 'Pending').replace(/\b\w/g, (letter) => letter.toUpperCase()) }));

  const transactionHistory = earningsData.orders.slice(0, 10).map((order, index) => ({ id: order._id || order.id || index, date: new Date(order.createdAt || Date.now()).toLocaleDateString(), description: `Sale - Order #${order.orderNumber || order._id || order.id}`, type: 'Credit', amount: `+₦${Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0).toLocaleString('en-NG')}` }));

  return (
    <FarmerLayout farmer={farmer} showSearch={true}>
      <div className="earnings-page">
        {earningsError && <p role="alert" className="checkout-error">{earningsError}</p>}
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Earnings</h1>
          <p className="page-subtitle">Track your revenue and payouts</p>
        </div>

        {/* Stats Cards */}
        <div className="earnings-stats">
          {earningsStats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-content">
                <span className="stat-icon">{stat.icon}</span>
                <h3 className="stat-title">{stat.title}</h3>
                <p className="stat-amount">{stat.amount}</p>
                {stat.date && <p className="stat-date">{stat.date}</p>}
              </div>
              {stat.action && (
                <button className="stat-action">{stat.action}</button>
              )}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="earnings-grid">
          {/* Earnings Overview */}
          <div className="earnings-chart">
            <div className="chart-header">
              <h2 className="chart-title">Earnings Overview</h2>
              <div className="chart-controls">
                <button className="chart-period">7D</button>
                <button className="chart-period">30D</button>
                <button className="chart-period active">3M</button>
                <button className="chart-period">1Y</button>
              </div>
            </div>
            <div className="chart-container">
              <div style={{ 
                width: '100%', 
                height: '250px', 
                background: 'linear-gradient(to bottom, rgba(5, 150, 105, 0.1), transparent)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                padding: '1rem'
              }}>
                {[40, 60, 55, 75, 85, 90, 95].map((height, i) => (
                  <div 
                    key={i}
                    style={{
                      height: `${height}%`,
                      width: '12%',
                      background: '#059669',
                      borderRadius: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </div>
          </div>

          {/* Recent Payouts */}
          <div className="recent-payouts">
            <div className="payouts-header">
              <h2 className="payouts-title">Recent Payouts</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="payouts-list">
              {isLoading && <p>Loading payouts...</p>}
              {!isLoading && recentPayouts.map((payout) => (
                <div key={payout.id} className="payout-item">
                  <div className="payout-icon">🏦</div>
                  <div className="payout-details">
                    <p className="payout-type">{payout.type}</p>
                    <p className="payout-date">{payout.date}</p>
                  </div>
                  <div className="payout-amount">{payout.amount}</div>
                  <span className={`payout-status ${payout.status.toLowerCase()}`}>
                    {payout.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transaction-history">
          <div className="history-header">
            <h2 className="history-title">Transaction History</h2>
            <button className="filter-btn">
              <span>⚙️</span> Filter
            </button>
          </div>
          <div className="history-table">
            <div className="table-header">
              <div className="col-date">DATE</div>
              <div className="col-description">DESCRIPTION</div>
              <div className="col-type">TYPE</div>
              <div className="col-amount">AMOUNT</div>
            </div>
            {isLoading && <div className="table-row">Loading transactions...</div>}
            {!isLoading && transactionHistory.map((transaction) => (
              <div key={transaction.id} className="table-row">
                <div className="col-date">{transaction.date}</div>
                <div className="col-description">{transaction.description}</div>
                <div className="col-type">
                  <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                    {transaction.type === 'Credit' ? '↓' : '↑'} {transaction.type}
                  </span>
                </div>
                <div className={`col-amount ${transaction.type.toLowerCase()}`}>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
          <div className="table-footer">
            <span className="pagination-info">Showing 1 to 4 of 24 entries</span>
            <div className="pagination">
              <button className="pagination-btn">Prev</button>
              <button className="pagination-btn">Next</button>
            </div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
};

export default FarmerEarningsPage;
