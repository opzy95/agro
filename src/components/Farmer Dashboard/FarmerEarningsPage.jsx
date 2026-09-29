import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FarmerLayout from './FarmerLayout';
import { getCurrentUser, getMyWallet, getMyBankAccounts, getMyWithdrawals, requestWithdrawal } from '../../services/userService';
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
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalMessage, setWithdrawalMessage] = useState('');
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isBankAccountsLoading, setIsBankAccountsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalHistoryError, setWithdrawalHistoryError] = useState('');

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
    getMyBankAccounts()
      .then((response) => {
        const accounts = response?.bankAccounts || response?.accounts || response?.data?.bankAccounts || response?.data?.accounts || response?.data || response || [];
        setBankAccounts(Array.isArray(accounts) ? accounts : []);
      })
      .catch(() => setBankAccounts([]))
      .finally(() => setIsBankAccountsLoading(false));
    getMyWithdrawals()
      .then((response) => {
        const list = response?.withdrawals || response?.data?.withdrawals || response?.data || response || [];
        setWithdrawals(Array.isArray(list) ? list : []);
      })
      .catch((error) => setWithdrawalHistoryError(error.message || 'Unable to load withdrawal history.'));
  }, []);

  const latestPaidWithdrawal = withdrawals
    .filter((withdrawal) => String(withdrawal.status || '').toLowerCase() === 'paid')
    .sort((left, right) => Date.parse(right.updatedAt || right.createdAt || 0) - Date.parse(left.updatedAt || left.createdAt || 0))[0];
  const earningsStats = [
    { title: 'Total Revenue', amount: `₦${earningsData.totalRevenue.toLocaleString('en-NG')}`, icon: '💳', color: 'default' },
    { title: 'Available Balance', amount: `₦${Number(earningsData.wallet.availableBalance ?? earningsData.wallet.balance ?? 0).toLocaleString('en-NG')}`, icon: '💰', color: 'primary', action: 'Withdraw' },
    { title: 'Pending Payouts', amount: `₦${Number(earningsData.wallet.pendingBalance ?? earningsData.wallet.pendingPayouts ?? 0).toLocaleString('en-NG')}`, icon: '⏳', color: 'warning' },
    { title: 'Last Payout', amount: `₦${Number(latestPaidWithdrawal?.netAmount ?? 0).toLocaleString('en-NG')}`, date: latestPaidWithdrawal?.updatedAt || latestPaidWithdrawal?.createdAt ? new Date(latestPaidWithdrawal.updatedAt || latestPaidWithdrawal.createdAt).toLocaleDateString() : '', icon: '✓', color: 'success' }
  ];
  const availableBalance = Number(earningsData.wallet.availableBalance ?? earningsData.wallet.balance ?? 0);
  const defaultBankAccount = bankAccounts.find((account) => account.isDefault || account.isPrimary || account.primary);
  const requestedAmount = Number(withdrawalAmount);
  const estimatedFee = Number.isFinite(requestedAmount) && requestedAmount > 0 ? requestedAmount * 0.05 : 0;

  const handleWithdrawal = async (event) => {
    event.preventDefault();
    const amount = Number(withdrawalAmount);

    if (!Number.isFinite(amount) || amount <= 0 || amount > availableBalance) {
      setWithdrawalError('Enter an amount greater than zero and no more than your available balance.');
      return;
    }
    if (!defaultBankAccount) {
      setWithdrawalError('Add a default bank account before requesting a withdrawal.');
      return;
    }

    setIsSubmittingWithdrawal(true);
    setWithdrawalError('');
    setWithdrawalMessage('');

    try {
      const response = await requestWithdrawal(amount);
      setShowWithdrawalForm(false);
      setWithdrawalAmount('');
      setWithdrawalMessage(response?.message || 'Your withdrawal request was submitted.');
      getMyWallet()
        .then((walletResponse) => {
          const wallet = walletResponse?.wallet || walletResponse?.data?.wallet || walletResponse?.data || walletResponse || {};
          setEarningsData((current) => ({ ...current, wallet }));
        })
        .catch(() => {});
      getMyWithdrawals()
        .then((historyResponse) => {
          const list = historyResponse?.withdrawals || historyResponse?.data?.withdrawals || historyResponse?.data || historyResponse || [];
          setWithdrawals(Array.isArray(list) ? list : []);
          setWithdrawalHistoryError('');
        })
        .catch(() => {});
    } catch (error) {
      setWithdrawalError(error.message || 'Unable to submit your withdrawal request.');
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  const recentPayouts = (withdrawals.length ? withdrawals : earningsData.wallet.payouts || earningsData.wallet.withdrawals || []).slice(0, 5).map((payout, index) => ({ id: payout._id || payout.id || index, type: payout.type || 'Bank Transfer', amount: `₦${Number(payout.amount || 0).toLocaleString('en-NG')}`, netAmount: payout.netAmount, platformFee: payout.platformFee, bankAccount: payout.bankAccount, rejectionReason: payout.rejectionReason, date: new Date(payout.createdAt || payout.date || Date.now()).toLocaleDateString(), status: String(payout.status || 'Pending').replace(/\b\w/g, (letter) => letter.toUpperCase()) }));

  const transactionHistory = [
    ...earningsData.orders.map((order, index) => ({
      id: order._id || order.id || `order-${index}`,
      timestamp: Date.parse(order.createdAt || 0) || 0,
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
      description: `Sale - Order #${order.orderNumber || order._id || order.id}`,
      type: 'Credit',
      amount: `+₦${Number(order.totalAmount ?? order.total ?? order.grandTotal ?? 0).toLocaleString('en-NG')}`
    })),
    ...withdrawals.map((withdrawal, index) => {
      const status = String(withdrawal.status || 'pending').toLowerCase();
      const isRejected = status === 'rejected';
      const amount = Number(withdrawal.amount || 0);
      const dateValue = withdrawal.updatedAt || withdrawal.createdAt;
      const withdrawalId = withdrawal._id || withdrawal.id || index;
      return {
        id: `withdrawal-${withdrawalId}`,
        timestamp: Date.parse(dateValue || 0) || 0,
        date: dateValue ? new Date(dateValue).toLocaleDateString() : '',
        description: `${isRejected ? 'Withdrawal returned' : 'Payout'} - ${status} #${withdrawalId}`,
        type: isRejected ? 'Credit' : 'Debit',
        amount: `${isRejected ? '+' : '-'}₦${amount.toLocaleString('en-NG')}`
      };
    })
  ].sort((left, right) => right.timestamp - left.timestamp).slice(0, 10);

  return (
    <FarmerLayout farmer={farmer} showSearch={true}>
      <div className="earnings-page">
        {earningsError && <p role="alert" className="checkout-error">{earningsError}</p>}
        {withdrawalMessage && <p role="status" className="withdrawal-message">{withdrawalMessage}</p>}
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
                <button
                  type="button"
                  className="stat-action"
                  onClick={() => {
                    setWithdrawalError('');
                    setWithdrawalMessage('');
                    setWithdrawalAmount('');
                    setShowWithdrawalForm(true);
                  }}
                  disabled={availableBalance <= 0}
                >
                  {stat.action}
                </button>
              )}
            </div>
          ))}
        </div>

        {showWithdrawalForm && (
          <div className="withdrawal-overlay" onClick={() => setShowWithdrawalForm(false)}>
            <form
              className="withdrawal-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="withdrawal-title"
              onClick={(event) => event.stopPropagation()}
              onSubmit={handleWithdrawal}
            >
              <h2 id="withdrawal-title">Request a withdrawal</h2>
              <p>Available balance: ₦{availableBalance.toLocaleString('en-NG')}</p>
              {isBankAccountsLoading ? (
                <p>Checking your bank accounts...</p>
              ) : defaultBankAccount ? (
                <p className="withdrawal-bank">To {defaultBankAccount.bankName || defaultBankAccount.bank || 'Bank'} ending in {(defaultBankAccount.accountNumber || defaultBankAccount.number || '').slice(-4)}</p>
              ) : (
                <p className="withdrawal-bank-warning" role="alert">
                  A default bank account is required. <Link to="/farmer/settings">Manage bank accounts</Link>
                </p>
              )}
              <label htmlFor="withdrawal-amount">Amount (₦)</label>
              <input
                id="withdrawal-amount"
                type="number"
                min="1"
                max={availableBalance}
                step="0.01"
                value={withdrawalAmount}
                onChange={(event) => setWithdrawalAmount(event.target.value)}
                required
                autoFocus
              />
              {requestedAmount > 0 && Number.isFinite(requestedAmount) && (
                <p className="withdrawal-estimate">
                  5% fee: ₦{estimatedFee.toLocaleString('en-NG', { maximumFractionDigits: 2 })} · Estimated payout: ₦{(requestedAmount - estimatedFee).toLocaleString('en-NG', { maximumFractionDigits: 2 })}
                </p>
              )}
              {withdrawalError && <p className="withdrawal-error" role="alert">{withdrawalError}</p>}
              <div className="withdrawal-actions">
                <button type="button" onClick={() => setShowWithdrawalForm(false)} disabled={isSubmittingWithdrawal}>Cancel</button>
                <button type="submit" disabled={isSubmittingWithdrawal || isBankAccountsLoading || !defaultBankAccount}>
                  {isSubmittingWithdrawal ? 'Submitting...' : 'Submit request'}
                </button>
              </div>
            </form>
          </div>
        )}

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
              {withdrawalHistoryError && <p role="alert" className="withdrawal-error">{withdrawalHistoryError}</p>}
              {!isLoading && !withdrawalHistoryError && recentPayouts.length === 0 && <p>No withdrawals yet.</p>}
              {!isLoading && recentPayouts.map((payout) => (
                <div key={payout.id} className="payout-item">
                  <div className="payout-icon">🏦</div>
                  <div className="payout-details">
                    <p className="payout-type">{payout.type}</p>
                    <p className="payout-date">{payout.date}{payout.bankAccount?.accountNumber ? ` · ${payout.bankAccount.bankName || 'Bank'} ending ${payout.bankAccount.accountNumber.slice(-4)}` : ''}</p>
                    {payout.platformFee != null && <p className="payout-date">Fee ₦{Number(payout.platformFee).toLocaleString('en-NG')} · Net ₦{Number(payout.netAmount || 0).toLocaleString('en-NG')}</p>}
                    {payout.rejectionReason && <p className="payout-rejection">{payout.rejectionReason}</p>}
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
