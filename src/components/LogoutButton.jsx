import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import { logout } from '../services/authService';

const LogoutButton = ({ className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Unable to revoke the session during logout.', error);
    } finally {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
      aria-label="Logout"
      title="Logout"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </svg>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
