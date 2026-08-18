import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import Header from '../components/Header';
import LandingPage from '../components/LandingPage';
import Login from '../components/Login';
import Registration from '../components/Registration';
import ForgotPassword from '../components/ForgotPassword';
import CategoriesPage from '../components/CategoriesPage';
import ShopPage from '../components/ShopPage';
import CartPage from '../components/CartPage';
import Wishlist from '../components/Wishlist';
import Footer from '../components/Footer';
import CustomerDashboardPage from '../components/Customer Dashboard/CustomerDashboardPage';
import CustomerSettingsPage from '../components/Customer Dashboard/CustomerSettingsPage';
import MyOrdersPage from '../components/Customer Dashboard/MyOrdersPage';
import PaymentMethodsPage from '../components/Customer Dashboard/PaymentMethodsPage';
import CustomerShopPage from '../components/Customer Dashboard/CustomerShopPage';
import CustomerWishlistPage from '../components/Customer Dashboard/CustomerWishlistPage';
import CustomerCartPage from '../components/Customer Dashboard/CustomerCartPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route - Landing Page with Header and Footer */}
      <Route 
        path="/" 
        element={
          <>
            <Header />
            <LandingPage />
            <Footer />
          </>
        } 
      />
      
      {/* Categories Route - with Header only */}
      <Route 
        path="/categories" 
        element={
          <>
            <Header />
            <CategoriesPage />
          </>
        } 
      />
      
      {/* Shop Route - with Header and Footer */}
      <Route 
        path="/shop" 
        element={
          <>
            <Header />
            <ShopPage />
            <Footer />
          </>
        } 
      />

      {/* Cart Route - with Header and Footer */}
      <Route path="/cart" element={<CartPage />} />

      {/* Wishlist Route - with Header and Footer */}
      <Route 
        path="/wishlist" 
        element={
          <>
            <Header />
            <Wishlist />
            <Footer />
          </>
        } 
      />
      
      {/* Customer Dashboard Routes - No Header/Footer */}
      <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
      <Route path="/customer/settings" element={<CustomerSettingsPage />} />
      <Route path="/customer/orders" element={<MyOrdersPage />} />
      <Route path="/customer/payment-methods" element={<PaymentMethodsPage />} />
      <Route path="/customer/shop" element={<CustomerShopPage />} />
      <Route path="/customer/wishlist" element={<CustomerWishlistPage />} />
      <Route path="/customer/cart" element={<CustomerCartPage />} />
      
      {/* Authentication Routes - No Header/Footer */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={
        <>
          <Header />
          <div style={{ 
            minHeight: '70vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h1 style={{ color: '#2d5016', fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ color: '#4a7c59', marginBottom: '1rem' }}>Page Not Found</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              The page you're looking for doesn't exist.
            </p>
            <a 
              href="/" 
              style={{
                background: '#4a7c59',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '25px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Go Home
            </a>
          </div>
          <Footer />
        </>
      } />
    </Routes>
  );
};

export default AppRoutes;