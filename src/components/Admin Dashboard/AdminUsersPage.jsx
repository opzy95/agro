import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([
    {
      id: 1,
      initials: 'OO',
      name: 'Oluwaseun Oba',
      email: 'olu.o@example.com',
      role: 'Farmer',
      nin: 'NIN -8932145',
      status: 'Verified',
      verificationStatus: 'verified',
      dateJoined: 'Oct 12, 2023'
    },
    {
      id: 2,
      initials: 'AI',
      name: 'Aisha Ibrahim',
      email: 'a.ibrahim@farmnet.ng',
      role: 'Farmer',
      nin: 'BVN - Pending',
      status: 'Pending Review',
      verificationStatus: 'not_verified',
      dateJoined: 'Nov 02, 2023'
    },
    {
      id: 3,
      initials: 'CO',
      name: 'Chidi Okeke',
      email: 'chidi.logistics@mail.com',
      role: 'Customer (B2B)',
      nin: '-',
      status: 'Active',
      verificationStatus: 'verified',
      dateJoined: 'Aug 15, 2023'
    },
    {
      id: 4,
      initials: 'FB',
      name: 'Femi Balogun',
      email: 'femi.b@example.com',
      role: 'Farmer',
      nin: 'NIN - 4451299',
      status: 'Suspended',
      verificationStatus: 'not_verified',
      dateJoined: 'Jan 10, 2022'
    },
    {
      id: 5,
      initials: 'GS',
      name: 'Grace Simmons',
      email: 'grace.s@farmtech.com',
      role: 'Customer',
      nin: '-',
      status: 'Active',
      verificationStatus: 'verified',
      dateJoined: 'Sep 23, 2023'
    },
    {
      id: 6,
      initials: 'JM',
      name: 'James Mwangi',
      email: 'james.mwangi@organic.ke',
      role: 'Farmer',
      nin: 'NIN - 7234891',
      status: 'Verified',
      verificationStatus: 'verified',
      dateJoined: 'Jul 08, 2023'
    },
    {
      id: 7,
      initials: 'NK',
      name: 'Nkechi Kalu',
      email: 'nkechi.k@trading.com',
      role: 'Customer (B2B)',
      nin: '-',
      status: 'Active',
      verificationStatus: 'verified',
      dateJoined: 'Oct 30, 2023'
    },
    {
      id: 8,
      initials: 'AM',
      name: 'Ahmed Mohamed',
      email: 'ahmed.m@example.com',
      role: 'Farmer',
      nin: 'BVN - Pending',
      status: 'Pending Review',
      verificationStatus: 'not_verified',
      dateJoined: 'Nov 15, 2023'
    },
    {
      id: 9,
      initials: 'LT',
      name: 'Lisa Thompson',
      email: 'lisa.t@retail.com',
      role: 'Customer',
      nin: '-',
      status: 'Active',
      verificationStatus: 'verified',
      dateJoined: 'Jun 12, 2023'
    },
    {
      id: 10,
      initials: 'CM',
      name: 'Charles Mensah',
      email: 'charles.m@agrifood.gh',
      role: 'Farmer',
      nin: 'NIN - 5567234',
      status: 'Verified',
      verificationStatus: 'verified',
      dateJoined: 'Aug 28, 2023'
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role.includes(roleFilter);
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Verified':
        return 'verified';
      case 'Active':
        return 'active';
      case 'Pending Review':
        return 'pending';
      case 'Suspended':
        return 'suspended';
      default:
        return '';
    }
  };

  const getInitialsColor = (initials) => {
    const colors = ['#059669', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const code = initials.charCodeAt(0) + initials.charCodeAt(1);
    return colors[code % colors.length];
  };

  const handleVerifyUser = (userId, action) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        if (action === 'verify') {
          return {
            ...user,
            verificationStatus: 'verified',
            status: 'Verified'
          };
        } else if (action === 'reject') {
          return {
            ...user,
            verificationStatus: 'not_verified',
            status: 'Suspended'
          };
        }
      }
      return user;
    }));
    alert(`User ${action === 'verify' ? 'verified' : 'rejected'} successfully!`);
  };

  return (
    <AdminLayout activeMenu="users" showSearch={true}>
      <div className="admin-users-page">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">Review, verify, and manage all platform participants.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-box">
            <p className="stat-label">TOTAL USERS</p>
            <p className="stat-value">12,450 <span className="stat-change">-4.2%</span></p>
          </div>
          <div className="stat-box">
            <p className="stat-label">PENDING VERIFICATION</p>
            <p className="stat-value">48 <span className="stat-change-alert">Action Req</span></p>
          </div>
        </div>

        {/* Alert Box */}
        <div className="alert-box">
          <div className="alert-header">
            <span className="alert-icon">📋</span>
            <div className="alert-content">
              <h3 className="alert-title">Farmers Awaiting NIN/BVN Review</h3>
              <p className="alert-description">
                There are 48 newly registered farmers requiring manual document verification before platform access is granted.
              </p>
            </div>
          </div>
          <button className="review-queue-btn">Review Queue</button>
        </div>

        {/* Filters and Actions */}
        <div className="filters-bar">
          <div className="filter-group">
            <select 
              className="filter-select"
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Role: All</option>
              <option value="Farmer">Farmer</option>
              <option value="Customer">Customer</option>
              <option value="B2B">B2B</option>
            </select>

            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">Status: All</option>
              <option value="Verified">Verified</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="action-buttons">
            <button className="btn-secondary">📥 Export CSV</button>
            <button className="btn-primary">➕ Add User</button>
          </div>
        </div>

        {/* Users Table */}
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name & Contact</th>
                <th>Role</th>
                <th>ID / NIN</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-cell">
                    <div className="user-info">
                      <div 
                        className="user-avatar"
                        style={{ backgroundColor: getInitialsColor(user.initials) }}
                      >
                        {user.initials}
                      </div>
                      <div className="user-details">
                        <p className="user-name">{user.name}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="role-cell">{user.role}</td>
                  <td className="id-cell">{user.nin}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <span className={`verification-badge ${user.verificationStatus}`}>
                      {user.verificationStatus === 'verified' && '✓ Verified'}
                      {user.verificationStatus === 'not_verified' && '❌ Not Verified'}
                    </span>
                  </td>
                  <td className="date-cell">{user.dateJoined}</td>
                  <td className="actions-cell">
                    {user.role.includes('Farmer') && user.verificationStatus === 'not_verified' ? (
                      <div className="verification-actions">
                        <button 
                          className="btn-verify"
                          onClick={() => handleVerifyUser(user.id, 'verify')}
                        >
                          ✓ Verify
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleVerifyUser(user.id, 'reject')}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : user.status === 'Pending Review' ? (
                      <button className="action-link review-link">Review Docs</button>
                    ) : (
                      <button className="action-link">View Profile</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="table-pagination">
            <p className="pagination-info">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
            </p>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
