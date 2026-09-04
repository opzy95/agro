import React from 'react';
import './VerificationBadge.css';

const VerificationBadge = ({ status, size = 'normal' }) => {
  const getBadgeContent = () => {
    switch (status) {
      case 'verified':
        return {
          icon: '✓',
          text: 'Verified',
          className: 'verified'
        };
      case 'not_verified':
      default:
        return {
          icon: '❌',
          text: 'Not Verified',
          className: 'not_verified'
        };
    }
  };

  const badge = getBadgeContent();

  return (
    <span className={`verification-badge ${badge.className} ${size}`}>
      <span className="badge-icon">{badge.icon}</span>
      <span className="badge-text">{badge.text}</span>
    </span>
  );
};

export default VerificationBadge;