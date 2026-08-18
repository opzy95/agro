import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesPage.css';

// Import your background images
import backgroundImage from '../assets/Background Image.png';
import farmersWorking from '../assets/Farmers working in field.png';
import background1 from '../assets/Background (1).png';
import background2 from '../assets/Background (2).png';
import background from '../assets/Background.png';
import heroImg from '../assets/hero.png';

const CategoriesPage = () => {
  const navigate = useNavigate();

  return (
    <main className="categories-page">
      {/* Page Header */}
      <section className="categories-header">
        <div className="categories-container">
          <h1 className="page-title">Explore Our Categories</h1>
          <p className="page-subtitle">
            Browse our extensive selection of farm-fresh produce and artisanal goods,
            <br />categorized for your convenience.
          </p>
        </div>
      </section>

      {/* Vegetables Section */}
      <section className="category-section">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="category-title">Vegetables</h2>
            <p className="category-subtitle">
              Crisp, nutritious, and straight from the soil. Discover our range of leafy greens, root vegetables, and more.
            </p>
          </div>

          <div className="vegetables-grid">
            {/* Large Featured Product */}
            <div className="product-card large-card">
              <div className="product-image">
                <img src={farmersWorking} alt="Leafy Greens" />
                <div className="product-overlay">
                  <h3 className="overlay-title">Leafy Greens</h3>
                  <p className="overlay-description">Packed with vitamins and flavor</p>
                </div>
              </div>
            </div>

            {/* Small Product Cards */}
            <div className="product-card small-card">
              <div className="product-image">
                <img src={background1} alt="Heirloom Organic Carrots" />
                <span className="organic-badge">Organic</span>
              </div>
              <div className="product-details">
                <h4 className="product-name">Heirloom Organic Carrots</h4>
                <div className="product-pricing">
                  <span className="price">$4.50</span>
                  <span className="unit">/ bunch</span>
                </div>
              </div>
            </div>

            <div className="product-card small-card">
              <div className="product-image">
                <img src={background2} alt="Mixed Bell Peppers" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Mixed Bell Peppers</h4>
                <div className="product-pricing">
                  <span className="price">$3.99</span>
                  <span className="unit">/ lb</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Banner */}
          <div className="seasonal-banner">
            <div className="banner-content">
              <div className="banner-text">
                <span className="seasonal-label">SEASONAL HIGHLIGHT</span>
                <h3 className="banner-title">Autumn Harvest Sale</h3>
                <p className="banner-description">
                  Get up to 30% off on selected<br />
                  seasonal root<br />
                  vegetables and orchard fruits.<br />
                  Sourced directly<br />
                  from verified local farms.
                </p>
                <button className="shop-sale-btn">Shop the Sale</button>
              </div>
            </div>
            <div className="banner-image">
              <img src={backgroundImage} alt="Autumn Harvest Sale" />
            </div>
          </div>
        </div>
      </section>

      {/* Fruits Section */}
      <section className="category-section">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="category-title">Fruits</h2>
            <p className="category-subtitle">
              Sweet, juicy, and naturally delicious. Explore seasonal orchard fruits, vibrant berries, and zesty citrus.
            </p>
          </div>

          <div className="fruits-grid">
            {/* Small Product Cards */}
            <div className="product-card small-card">
              <div className="product-image">
                <img src={background} alt="Vine-Ripened Cherry Tomatoes" />
                <span className="fresh-badge">Fresh Harvest</span>
              </div>
              <div className="product-details">
                <h4 className="product-name">Vine-Ripened Cherry Tomatoes</h4>
                <div className="product-pricing">
                  <span className="price">$5.20</span>
                  <span className="unit">/ lb</span>
                </div>
              </div>
            </div>

            <div className="product-card small-card">
              <div className="product-image">
                <img src={heroImg} alt="Organic Strawberries" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Organic Strawberries</h4>
                <div className="product-pricing">
                  <span className="price">$6.50</span>
                  <span className="unit">/ lb</span>
                </div>
              </div>
            </div>

            {/* Large Featured Product */}
            <div className="product-card large-card">
              <div className="product-image">
                <img src={backgroundImage} alt="Citrus Collection" />
                <div className="product-overlay">
                  <h3 className="overlay-title">Citrus Collection</h3>
                  <p className="overlay-description">Brighten your day with fresh citrus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dairy & Eggs Section */}
      <section className="category-section">
        <div className="categories-container">
          <div className="section-header">
            <h2 className="category-title">Dairy & Eggs</h2>
            <p className="category-subtitle">
              Farm-fresh staples for your daily needs, including artisanal cheeses, rich milk, and free-range eggs.
            </p>
          </div>

          <div className="dairy-grid">
            <div className="product-card small-card">
              <div className="product-image">
                <img src={background1} alt="Free-Range Brown Eggs" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Free-Range Brown Eggs</h4>
                <div className="product-pricing">
                  <span className="price">$5.99</span>
                  <span className="unit">/ dozen</span>
                </div>
              </div>
            </div>

            <div className="product-card small-card">
              <div className="product-image">
                <img src={background2} alt="Aged Farmhouse Cheddar" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Aged Farmhouse Cheddar</h4>
                <div className="product-pricing">
                  <span className="price">$8.50</span>
                  <span className="unit">/ lb</span>
                </div>
              </div>
            </div>

            <div className="product-card small-card">
              <div className="product-image">
                <img src={farmersWorking} alt="Whole Creamline Milk" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Whole Creamline Milk</h4>
                <div className="product-pricing">
                  <span className="price">$4.25</span>
                  <span className="unit">/ half gallon</span>
                </div>
              </div>
            </div>

            <div className="product-card small-card">
              <div className="product-image">
                <img src={background} alt="Cultured Pastured Butter" />
              </div>
              <div className="product-details">
                <h4 className="product-name">Cultured Pastured Butter</h4>
                <div className="product-pricing">
                  <span className="price">$6.00</span>
                  <span className="unit">/ lb</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="categories-footer">
        <div className="categories-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-title">HarvestHub</h3>
              <p className="footer-text">
                <span className="checkmark">✓</span>
                © 2024 HarvestHub. Cultivating quality connections.
              </p>
            </div>
            
            <div className="footer-links">
              <div className="footer-column">
                <a href="#privacy" className="footer-link">Privacy Policy</a>
                <a href="#terms" className="footer-link">Terms of Service</a>
                <a href="#shipping" className="footer-link">Shipping Info</a>
                <a href="#returns" className="footer-link">Returns</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;