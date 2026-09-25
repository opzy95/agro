import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminUsers, getAdminUserProfile, updateAdminUserVerification } from '../../services/adminService';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  useEffect(() => {
    getAdminUsers()
      .then((response) => {
        const list = response?.users || response?.data?.users || response?.data || response || [];
        setTotalUsers(Number(response?.count ?? response?.data?.count ?? (Array.isArray(list) ? list.length : 0)));
        setUsers(Array.isArray(list) ? list.map((user) => {
          const name = user.name || user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
          const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
          const rawVerificationStatus = user.verificationStatus || (user.isVerified ? 'verified' : 'pending');
          const role = String(user.role || 'customer').replace(/\b\w/g, (letter) => letter.toUpperCase());
          return { ...user, id: user._id || user.id, name, initials, email: user.email || '', role, nin: user.nin || user.bvn || '-', rawVerificationStatus, verificationStatus: rawVerificationStatus === 'verified' ? 'verified' : 'not_verified', status: user.status || (rawVerificationStatus === 'verified' ? 'Verified' : 'Pending Review'), dateJoined: new Date(user.createdAt || user.dateJoined || Date.now()).toLocaleDateString() };
        }) : []);
      })
      .catch((error) => setUsersError(error.message))
      .finally(() => setIsLoading(false));
  }, []);
  /*
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
  */

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nin.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role.toLowerCase().includes(roleFilter.toLowerCase());
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
    updateAdminUserVerification(userId, action)
      .then(() => setUsers(users.map(user => {
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
      })))
      .catch((error) => setUsersError(error.message));
  };

  const handleViewProfile = async (user) => {
    setSelectedUser(user);
    setProfileError('');
    setIsProfileLoading(true);

    try {
      const response = await getAdminUserProfile(user.id);
      setSelectedUser(response?.user || response?.data?.user || response?.data || response);
    } catch (error) {
      setProfileError(error.message || 'Unable to load this user profile.');
    } finally {
      setIsProfileLoading(false);
    }
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
            <p className="stat-value">{totalUsers}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">PENDING VERIFICATION</p>
            <p className="stat-value">{users.filter((user) => user.role.toLowerCase() === 'farmer' && user.rawVerificationStatus === 'pending').length} <span className="stat-change-alert">Action Req</span></p>
          </div>
        </div>

        {/* Alert Box */}
        <div className="alert-box">
          <div className="alert-header">
            <span className="alert-icon">📋</span>
            <div className="alert-content">
              <h3 className="alert-title">Farmers Awaiting NIN/BVN Review</h3>
              <p className="alert-description">
                There are {users.filter((user) => user.role.toLowerCase() === 'farmer' && user.rawVerificationStatus === 'pending').length} farmers requiring manual document verification before platform access is granted.
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
                {isLoading && <tr><td colSpan="7">Loading users...</td></tr>}
                {!isLoading && usersError && <tr><td colSpan="7" role="alert">{usersError}</td></tr>}
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
                    <div className="user-actions">
                      <button className="action-link" onClick={() => handleViewProfile(user)}>
                        View Profile
                      </button>
                      {user.role.includes('Farmer') && user.verificationStatus === 'not_verified' && (
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
                      )}
                    </div>
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
      {selectedUser && (
        <div className="profile-modal-overlay" role="presentation" onClick={() => setSelectedUser(null)}>
          <section className="profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" onClick={(event) => event.stopPropagation()}>
            <div className="profile-modal-header">
              <div>
                <p className="profile-modal-eyebrow">User Profile</p>
                <h2 id="profile-modal-title">{selectedUser.firstName || selectedUser.name || 'User'} {selectedUser.lastName || ''}</h2>
              </div>
              <button className="profile-modal-close" type="button" onClick={() => setSelectedUser(null)} aria-label="Close profile">×</button>
            </div>

            {isProfileLoading && <p className="profile-modal-message">Loading profile...</p>}
            {profileError && <p className="profile-modal-error" role="alert">{profileError}</p>}
            {!isProfileLoading && !profileError && (
              <div className="profile-modal-body">
                {selectedUser.profileImage && <img className="profile-image" src={selectedUser.profileImage} alt="User profile" />}
                <div className="profile-details-grid">
                  <div><span>First name</span><strong>{selectedUser.firstName || '-'}</strong></div>
                  <div><span>Last name</span><strong>{selectedUser.lastName || '-'}</strong></div>
                  <div><span>Email</span><strong>{selectedUser.email || '-'}</strong></div>
                  <div><span>Phone</span><strong>{selectedUser.phone || '-'}</strong></div>
                  <div><span>Role</span><strong>{selectedUser.role || '-'}</strong></div>
                  <div><span>Farm name</span><strong>{selectedUser.farmName || '-'}</strong></div>
                  <div><span>Verification</span><strong>{selectedUser.verificationStatus || '-'}</strong></div>
                  <div><span>Date joined</span><strong>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : '-'}</strong></div>
                  <div><span>NIN</span><strong>{selectedUser.nin || '-'}</strong></div>
                  <div><span>BVN</span><strong>{selectedUser.bvn || '-'}</strong></div>
                </div>
                <div className="profile-documents">
                  <h3>Farmer Documents</h3>
                  {selectedUser.ninDocument ? (
                    <a href={selectedUser.ninDocument} target="_blank" rel="noreferrer">View NIN Document</a>
                  ) : (
                    <p>No NIN document uploaded.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsersPage;
