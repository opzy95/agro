import React from 'react';

import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';

import { WishlistProvider } from './contexts/WishlistContext';

import AppRoutes from './routes/AppRoutes';

import './App.css';

const RoleAwareProviders = () => {
  const location = useLocation();
  const page = (
    <WishlistProvider>
      <AppRoutes />
    </WishlistProvider>
  );

  if (location.pathname.startsWith('/farmer') || location.pathname.startsWith('/admin')) {
    return page;
  }

  return <CartProvider>{page}</CartProvider>;
};

function App() {
  return (
    <div className="app">
      <Router>
        <RoleAwareProviders />
      </Router>
    </div>
  );
}

export default App;