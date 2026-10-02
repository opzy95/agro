import React, { useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [wishlist, setWishlist] = useState(new Set());

  const categories = [
    { id: 'vegetables', name: 'Vegetables', icon: '🥬', count: 3 },
    { id: 'fruits', name: 'Fruits', icon: '🍎', count: 3 },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🥛', count: 4 }
  ];

  const allProducts = [
    // Vegetables
    { id: 1, category: 'vegetables', name: 'Heirloom Organic Carrots', price: 4.50, unit: 'bunch', image: background1, badge: 'Organic', rating: 4.8 },
    { id: 2, category: 'vegetables', name: 'Mixed Bell Peppers', price: 3.99, unit: 'lb', image: background2, rating: 4.6 },
    { id: 3, category: 'vegetables', name: 'Leafy Greens', price: 5.00, unit: 'bunch', image: farmersWorking, badge: 'Fresh', rating: 4.9 },
    
    // Fruits
    { id: 4, category: 'fruits', name: 'Vine-Ripened Cherry Tomatoes', price: 5.20, unit: 'lb', image: background, badge: 'Fresh Harvest', rating: 4.7 },
    { id: 5, category: 'fruits', name: 'Organic Strawberries', price: 6.50, unit: 'lb', image: heroImg, rating: 4.8 },
    { id: 6, category: 'fruits', name: 'Citrus Collection', price: 7.99, unit: 'lb', image: backgroundImage, rating: 4.5 },
    
    // Dairy & Eggs
    { id: 7, category: 'dairy', name: 'Free-Range Brown Eggs', price: 5.99, unit: 'dozen', image: background1, rating: 4.9 },
    { id: 8, category: 'dairy', name: 'Aged Farmhouse Cheddar', price: 8.50, unit: 'lb', image: background2, rating: 4.7 },
    { id: 9, category: 'dairy', name: 'Whole Creamline Milk', price: 4.25, unit: 'half gallon', image: farmersWorking, rating: 4.8 },
    { id: 10, category: 'dairy', name: 'Cultured Pastured Butter', price: 6.00, unit: 'lb', image: background, rating: 4.6 }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  const toggleWishlist = (id) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlist(newWishlist);
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 ? '☆' : '');
  };

  return (
    <main className="categories-page">
      {/* Category Filter Section - Sticky */}
      <section className="categories-filter-section">
        <div className="categories-container">
          <div className="filter-header">
            <h2 className="filter-title">Shop by Category</h2>
            <span className="product-count">{filteredProducts.length} Products</span>
          </div>
          
          <div className="filter-wrapper">
            <button 
              className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <span className="filter-icon">🏪</span>
              <span className="filter-text">All</span>
            </button>
            
            {categories.map(cat => (
              <button 
                key={cat.id}
                className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="filter-icon">{cat.icon}</span>
                <span className="filter-text">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="products-section">
        <div className="categories-container">
          {/* Products Grid */}
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image11" />
                  
                  {product.badge && (
                    <span className="product-badge">{product.badge}</span>
                  )}
                  
                  <button 
                    className={`wishlist-btn ${wishlist.has(product.id) ? 'liked' : ''}`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {wishlist.has(product.id) ? '♥' : '♡'}
                  </button>
                  
                  <div className="product-hover-overlay">
                  </div>
                </div>

                <div className="product-details">
                  <div className="product-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span className="rating-value">{product.rating}</span>
                  </div>
                  
                  <h3 className="product-name">{product.name}</h3>
                  
                  <div className="product-meta">
                    <div className="product-pricing">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className="unit">per {product.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No products found</h3>
              <p>Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="promo-section">
        <div className="categories-container">
          <div className="promo-card">
            <div className="promo-text">
              <span className="promo-badge">Limited Time Offer</span>
              <h2 className="promo-title">Fresh Harvest Sale</h2>
              <p className="promo-desc">Up to 30% off on seasonal produce. Farm-fresh quality guaranteed.</p>
              <button className="promo-cta">Shop Sale</button>
            </div>
            <div className="promo-visual">
              <img src={backgroundImage} alt="Fresh Harvest" className="promo-image" />
              <div className="promo-glow"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="benefits-section">
        <div className="categories-container">
          <h2 className="section-title">Why Choose AgroFresh</h2>
          
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">🌱</div>
              <h4>100% Farm Fresh</h4>
              <p>Direct from local farms</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <h4>Verified Quality</h4>
              <p>All products inspected</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">🚚</div>
              <h4>Fast Delivery</h4>
              <p>Same-day available</p>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">💚</div>
              <h4>Support Local</h4>
              <p>Fair farmer prices</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;