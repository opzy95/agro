import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <h2 className="newsletter-title">Stay Rooted with Seasonal Offers</h2>
          <p className="newsletter-subtitle">
            Get the latest updates on fresh produce, farming tips, and exclusive deals delivered to your inbox.
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-content">
          <div className="footer-grid">
            {/* Company Info */}
            <div className="footer-column">
              <h3 className="footer-logo">AgroFresh</h3>
              <p className="footer-description">
                Connecting farmers directly to consumers for the freshest, 
                highest quality produce delivered straight to your doorstep.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.014 5.367 18.648.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.53-.757-.934-1.205-2.17-1.205-3.47s.448-2.536 1.205-3.47c.757-.934 1.908-1.53 3.205-1.53s2.448.596 3.205 1.53c.757.934 1.205 2.17 1.205 3.47s-.448 2.536-1.205 3.47c-.757.934-1.908 1.53-3.205 1.53z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-column">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#products">Products</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div className="footer-column">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#fresh-produce">Fresh Produce</a></li>
                <li><a href="#farm-delivery">Farm Delivery</a></li>
                <li><a href="#organic-farming">Organic Farming</a></li>
                <li><a href="#seasonal-boxes">Seasonal Boxes</a></li>
                <li><a href="#bulk-orders">Bulk Orders</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-column">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <a href="mailto:hello@agrofresh.com">hello@agrofresh.com</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Phone:</span>
                  <a href="tel:+1234567890">(123) 456-7890</a>
                </div>
                <div className="contact-item">
                  <span className="contact-label">Address:</span>
                  <span>123 Farm Road, Agricultural Valley, AV 12345</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 AgroFresh. All rights reserved.</p>
              <div className="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#cookies">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;