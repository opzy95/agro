import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const { 
    items: cartItems, 
    totalItems, 
    totalPrice: cartTotalPrice,
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const location = useLocation();
  const isInDashboard = location.pathname.includes('/customer');
  const shopLink = isInDashboard ? '/customer/shop' : '/shop';

  const [promoCode, setPromoCode] = useState('');

  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  const removeCartItem = (id) => {
    removeFromCart(id);
  };

  const saveForLater = (id) => {
    // Handle save for later functionality
    console.log('Save for later:', id);
  };

  const applyPromoCode = () => {
    // Handle promo code application
    console.log('Apply promo code:', promoCode);
  };

  const subtotal = cartTotalPrice;
  const deliveryFee = 4.99;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const deliveryProgress = subtotal >= 37.51 ? 100 : (subtotal / 37.51) * 100;
  const freeDeliveryThreshold = 37.51;
  const amountForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  return (
    <div className="cart-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to="/shop" className="breadcrumb-link">Shop</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Shopping Cart</span>
      </div>

      {/* Page Title */}
      <h1 className="cart-title">Your Cart</h1>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items-section">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <h3>Your cart is empty</h3>
              <p>Add some fresh products to get started!</p>
              <Link to={shopLink} className="shop-button">Continue Shopping</Link>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                    {item.badges.length > 0 && (
                      <div className="item-badges">
                        {item.badges.map((badge, index) => (
                          <span key={index} className={`badge ${badge.toLowerCase().replace(' ', '-')}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-seller">
                      <svg className="location-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{item.seller}</span>
                      {item.verified && (
                        <svg className="verified-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="#059669"/>
                        </svg>
                      )}
                    </div>

                    <div className="item-actions">
                      <button 
                        className="action-link remove-btn"
                        onClick={() => removeCartItem(item.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6v14a2,2 0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2v2"/>
                        </svg>
                        Remove
                      </button>
                      <button 
                        className="action-link save-btn"
                        onClick={() => saveForLater(item.id)}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        Save for Later
                      </button>
                    </div>
                  </div>

                  <div className="item-price-section">
                    <div className="item-price">
                      ${item.price.toFixed(2)}
                      <span className="price-unit">/ {item.unit}</span>
                    </div>

                    <div className="quantity-controls">
                      <button 
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Estimate */}
              <div className="delivery-estimate">
                <div className="delivery-header">
                  <svg className="truck-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                  <h3>Delivery Estimate</h3>
                  <span className="delivery-time">Tomorrow, 8AM - 12PM</span>
                </div>
                
                <div className="delivery-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${Math.min(deliveryProgress, 100)}%` }}
                  ></div>
                </div>
                
                {amountForFreeDelivery > 0 && (
                  <p className="delivery-message">
                    Add ${amountForFreeDelivery.toFixed(2)} more for <strong>Free Delivery</strong>
                  </p>
                )}
              </div>

              {/* Continue Shopping Button */}
              <Link to={shopLink} className="continue-shopping-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Continue Shopping
              </Link>
            </>
          )}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="order-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            
            <div className="summary-line discount">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>

            <div className="promo-section">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="promo-input"
              />
              <button onClick={applyPromoCode} className="apply-btn">Apply</button>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn">
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>

            <p className="tax-note">Taxes calculated at checkout.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;