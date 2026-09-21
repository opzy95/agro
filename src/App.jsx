import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { CartProvider } from './contexts/CartContext';

import { WishlistProvider } from './contexts/WishlistContext';

import AppRoutes from './routes/AppRoutes';

import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;