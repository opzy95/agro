import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes/routeUtils';
import './LandingPage.css';

// Import your background images
import backgroundImage from '../assets/Background Image.png';
import farmersWorking from '../assets/Farmers working in field.png';
import background1 from '../assets/Background (1).png';
import background2 from '../assets/Background (2).png';
import background from '../assets/Background.png';
import heroImg from '../assets/hero.png';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <main className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Fresh From Trusted <br />
                <span className="highlight">Farms to Your Doorstep</span>
              </h1>
              <p className="hero-subtitle">
                Experience the finest quality produce delivered straight from local farms. 
                Fresh, organic, and sustainably grown for your family's health and happiness.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary" onClick={() => navigate(ROUTES.REGISTER)}>Shop Now</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Partner Farms</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">24h</div>
                <div className="stat-label">Fresh Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="category-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            <div className="category-item">
              <div className="category-icon">🥬</div>
              <h3>Fresh Vegetables</h3>
            </div>
            <div className="category-item">
              <div className="category-icon">🍎</div>
              <h3>Seasonal Fruits</h3>
            </div>
            <div className="category-item">
              <div className="category-icon">🌾</div>
              <h3>Grains & Cereals</h3>
            </div>
            <div className="category-item">
              <div className="category-icon">🥛</div>
              <h3>Dairy Products</h3>
            </div>
            <div className="category-item">
              <div className="category-icon">🥩</div>
              <h3>Fresh Meat</h3>
            </div>
            <div className="category-item">
              <div className="category-icon">🌿</div>
              <h3>Herbs & Spices</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose HarvestHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">🚚</div>
              </div>
              <h3>Fast Delivery</h3>
              <p>Same-day delivery available for orders placed before 2 PM</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">🌱</div>
              </div>
              <h3>100% Organic</h3>
              <p>All our products are certified organic and pesticide-free</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">💰</div>
              </div>
              <h3>Best Prices</h3>
              <p>Direct from farm pricing with no middleman markups</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-circle">✓</div>
              </div>
              <h3>Fresh Guarantee</h3>
              <p>100% satisfaction guarantee or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Cultivating a Greener Future</h2>
              <p>
                At HarvestHub, we believe in the power of sustainable farming and direct 
                relationships between farmers and consumers. Our mission is to provide the 
                freshest, highest quality produce while supporting local agricultural communities.
              </p>
              <p>
                Every product you purchase helps support sustainable farming practices and 
                ensures fair compensation for hardworking farmers who care about the land 
                and the quality of their harvest.
              </p>
              <button className="btn btn-primary">Learn More</button>
            </div>
            <div className="about-image">
              <img src={farmersWorking} alt="Farmers working in field" />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-item">
              {/* <div className="step-number">1</div> */}
              <div className="step-icon">🛒</div>
              <h3>Browse & Select</h3>
              <p>Browse our wide selection of fresh produce and select what you need</p>
            </div>
            <div className="step-item">
              {/* <div className="step-number">2</div> */}
              <div className="step-icon">📦</div>
              <h3>We Pack Fresh</h3>
              <p>Our team carefully packs your order with the freshest available produce</p>
            </div>
            <div className="step-item">
              {/* <div className="step-number">3</div> */}
              <div className="step-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Your order is delivered fresh to your doorstep within 24 hours</p>
            </div>
            <div className="step-item">
              {/* <div className="step-number">4</div>c:\Users\EDUTAMS\Downloads\HarvestHub - Premium Login (Desktop).png */}
              <div className="step-icon">😊</div>
              <h3>Enjoy Fresh Food</h3>
              <p>Enjoy the freshest, most nutritious produce for you and your family</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Partners Section */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-title">Featured Partners</h2>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-image">
                <img src={background1} alt="Green Valley Farm" />
              </div>
              <h3>Green Valley Farm</h3>
              <p>Specializing in organic vegetables and sustainable farming practices for over 20 years.</p>
              <button className="btn btn-outline">Visit Farm</button>
            </div>
            <div className="partner-card">
              <div className="partner-image">
                <img src={background2} alt="Sunrise Orchards" />
              </div>
              <h3>Sunrise Orchards</h3>
              <p>Premium fruit orchards producing the finest seasonal fruits in the region.</p>
              <button className="btn btn-outline">Visit Farm</button>
            </div>
            <div className="partner-card">
              <div className="partner-image">
                <img src={background} alt="Heritage Dairy Farm" />
              </div>
              <h3>Heritage Dairy Farm</h3>
              <p>Family-owned dairy farm committed to ethical and sustainable practices.</p>
              <button className="btn btn-outline">Visit Farm</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Community Says</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-avatar">👩</div>
              <p>"The quality of produce from HarvestHub is outstanding. Fresh, organic, and delivered right on time!"</p>
              <div className="testimonial-author">
                <strong>Sarah Johnson</strong>
                <span>Regular Customer</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-avatar">👨</div>
              <p>"Supporting local farmers while getting the freshest produce - it's a win-win!"</p>
              <div className="testimonial-author">
                <strong>Mike Chen</strong>
                <span>Weekly Subscriber</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-avatar">👩</div>
              <p>"The convenience and quality have made grocery shopping so much better for our family."</p>
              <div className="testimonial-author">
                <strong>Emily Davis</strong>
                <span>Family Customer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;