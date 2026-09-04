import React from 'react';
import FarmerLayout from './FarmerLayout';
import './FarmerEarningsPage.css';

const FarmerEarningsPage = () => {
  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: '/api/placeholder/48/48',
    verificationStatus: 'verified' // This would come from the backend/context in real app
  };

  const earningsStats = [
    {
      title: 'Total Revenue',
      amount: '₦850,000',
      icon: '💳',
      color: 'default'
    },
    {
      title: 'Available Balance',
      amount: '₦120,000',
      icon: '💰',
      color: 'primary',
      action: 'Withdraw'
    },
    {
      title: 'Pending Payouts',
      amount: '₦45,000',
      icon: '⏳',
      color: 'warning'
    },
    {
      title: 'Last Payout',
      amount: '₦150,000',
      date: 'Oct 15, 2023',
      icon: '✓',
      color: 'success'
    }
  ];

  const recentPayouts = [
    {
      id: 1,
      type: 'Bank Transfer',
      amount: '₦150,000',
      date: 'Oct 15, 2023',
      status: 'Processed'
    },
    {
      id: 2,
      type: 'Bank Transfer',
      amount: '₦45,000',
      date: 'Oct 28, 2023',
      status: 'Pending'
    },
    {
      id: 3,
      type: 'Bank Transfer',
      amount: '₦210,000',
      date: 'Sep 30, 2023',
      status: 'Processed'
    }
  ];

  const transactionHistory = [
    {
      id: 1,
      date: 'Oct 28, 2023',
      description: 'Sale - Order #HH1004',
      type: 'Credit',
      amount: '+₦45,000'
    },
    {
      id: 2,
      date: 'Oct 15, 2023',
      description: 'Withdrawal - Bank Transfer',
      type: 'Debit',
      amount: '-₦150,000'
    },
    {
      id: 3,
      date: 'Oct 12, 2023',
      description: 'Sale - Order #HH1003',
      type: 'Credit',
      amount: '+₦65,000'
    },
    {
      id: 4,
      date: 'Oct 05, 2023',
      description: 'Sale - Order #HH1002',
      type: 'Credit',
      amount: '+₦120,000'
    }
  ];

  return (
    <FarmerLayout farmer={farmer} showSearch={true}>
      <div className="earnings-page">
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
              {recentPayouts.map((payout) => (
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
            {transactionHistory.map((transaction) => (
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
