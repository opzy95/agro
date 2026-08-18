import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Cart from './Cart';

const CartPage = () => {
  return (
    <>
      <Header />
      <div style={{ marginTop: '80px' }}> {/* Account for fixed header */}
        <Cart />
      </div>
      <Footer />
    </>
  );
};

export default CartPage;