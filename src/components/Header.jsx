import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ROUTES } from '../routes/routeUtils';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav') && !event.target.closest('.mobile-menu-btn')) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className={`header-container ${isMenuOpen ? 'menu-open' : ''}`}>
        {/* Logo */}
        <div className="logo">
          <Link to={ROUTES.HOME} className="logo-text">
            AgroFresh
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {/* Mobile Logo inside sidebar */}
          <div className="mobile-nav-header">
            <Link to={ROUTES.HOME} className="mobile-logo" onClick={closeMenu}>
              AgroFresh
            </Link>
          </div>
          
          <ul className="nav-list">
            <li><Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>Home</Link></li>
            <li><Link to={ROUTES.SHOP} className="nav-link" onClick={closeMenu}>Shop</Link></li>
            <li><Link to={ROUTES.CATEGORIES} className="nav-link" onClick={closeMenu}>Categories</Link></li>
            <li><a href="#about" className="nav-link" onClick={closeMenu}>About</a></li>
            <li><a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a></li>
          </ul>
          
          {/* Mobile Auth Buttons */}
          <div className="mobile-auth-buttons">
            <button 
              className="mobile-login-button" 
              onClick={() => handleNavigation(ROUTES.LOGIN)}
            >
              Login
            </button>
            <button 
              className="mobile-cta-button" 
              onClick={() => handleNavigation(ROUTES.REGISTER)}
            >
              Sign Up
            </button>
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className="header-auth">
          {/* Wishlist Icon */}
          <Link to={ROUTES.WISHLIST} className="wishlist-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistItems > 0 && (
              <span className="wishlist-badge">{wishlistItems}</span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to={ROUTES.CART} className="cart-icon-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>

          <button 
            className="login-button" 
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Login
          </button>
          <button 
            className="cta-button" 
            onClick={() => navigate(ROUTES.REGISTER)}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;