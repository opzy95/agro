import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { ROUTES } from '../routes/routeUtils';
import './Wishlist.css';

const Wishlist = () => {
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(product.id);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="wishlist-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to={ROUTES.HOME} className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <Link to={ROUTES.SHOP} className="breadcrumb-link">Shop</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Wishlist</span>
      </div>

      {/* Page Title */}
      <h1 className="wishlist-title">My Wishlist</h1>

      <div className="wishlist-content">
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">💝</div>
            <h3>Your wishlist is empty</h3>
            <p>Add your favorite products to your wishlist to save them for later!</p>
            <Link to={ROUTES.SHOP} className="shop-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-stats">
              <span className="stats-text">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</span>
            </div>

            <div className="wishlist-grid">
              {wishlistItems.map((product) => (
                <div key={product.id} className="wishlist-item">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                    <button 
                      className="remove-wishlist-btn"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      title="Remove from wishlist"
                    >
                      ×
                    </button>
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">{product.name}</h3>
                    
                    <div className="item-info">
                      <span className="item-price">${product.price.toFixed(2)}</span>
                      <span className="item-unit">/ {product.unit}</span>
                    </div>

                    <div className="item-seller">
                      <span className="seller-icon">🏪</span>
                      <span className="seller-name">{product.seller}</span>
                      {product.verified && <span className="verified-badge">✓</span>}
                    </div>

                    <div className="item-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`star ${star <= Math.floor(product.rating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="rating-value">{product.rating}</span>
                    </div>

                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="9" cy="21" r="1"/>
                        <circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;