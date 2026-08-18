import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { ROUTES } from '../routes/routeUtils';
import './ShopPage.css';

// Import your background images
import backgroundImage from '../assets/Background Image.png';
import farmersWorking from '../assets/Farmers working in field.png';
import background1 from '../assets/Background (1).png';
import background2 from '../assets/Background (2).png';
import background from '../assets/Background.png';
import heroImg from '../assets/hero.png';

const ShopPage = () => {
  const { addToCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    categories: {
      vegetables: false,
      fruits: true,
      dairy: false
    },
    organicOnly: false
  });

  // Product data
  const products = [
    {
      id: 1,
      name: 'Heirloom Organic Carrots',
      price: 4.50,
      unit: 'bunch',
      image: background1,
      seller: 'Green Valley Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: 'Vine-Ripened Cherry Tomatoes',
      price: 5.20,
      unit: 'lb',
      image: background,
      seller: 'Sunrise Orchards',
      verified: false,
      badges: ['fresh'],
      rating: 4.7,
      inStock: true
    },
    {
      id: 3,
      name: 'Organic Strawberries',
      price: 6.50,
      unit: 'lb',
      image: heroImg,
      seller: 'Berry Fresh Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.6,
      inStock: true
    },
    {
      id: 4,
      name: 'Mixed Bell Peppers',
      price: 3.99,
      unit: 'lb',
      image: background2,
      seller: 'Valley Gardens',
      verified: false,
      badges: [],
      rating: 4.4,
      inStock: true
    },
    {
      id: 5,
      name: 'Fresh Leafy Greens Mix',
      price: 7.25,
      unit: 'bunch',
      image: farmersWorking,
      seller: 'Green Valley Farms',
      verified: true,
      badges: ['fresh'],
      rating: 4.9,
      inStock: true
    },
    {
      id: 6,
      name: 'Heritage Potatoes',
      price: 4.75,
      unit: '5lb bag',
      image: backgroundImage,
      seller: 'Mountain View Farms',
      verified: false,
      badges: ['organic'],
      rating: 4.3,
      inStock: true
    }
  ];

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  const toggleOrganicFilter = () => {
    setFilters(prev => ({
      ...prev,
      organicOnly: !prev.organicOnly
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: {
        vegetables: false,
        fruits: false,
        dairy: false
      },
      organicOnly: false
    });
  };

  return (
    <main className="shop-page">
      {/* Breadcrumb Navigation */}
      <section className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to={ROUTES.HOME} className="breadcrumb-link">Home</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Shop</span>
          </nav>
        </div>
      </section>

      {/* Page Header */}
      <section className="shop-header">
        <div className="container">
          <h1 className="shop-title">Shop Fresh Agricultural Products</h1>
          <p className="shop-subtitle">
            Discover premium, farm-fresh produce and artisanal goods sourced directly 
            from trusted local growers.
          </p>
        </div>
      </section>

      {/* Main Shop Content */}
      <section className="shop-content">
        <div className="container">
          <div className="shop-layout">
            
            {/* Sidebar Filters */}
            <aside className="shop-sidebar">
              {/* Search */}
              <div className="search-section">
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="sort-section">
                <label htmlFor="sort" className="sort-label">Sort by:</label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="popular">Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Filters */}
              <div className="filters-section">
                <div className="filters-header">
                  <h3>Filters</h3>
                  <button className="clear-filters" onClick={clearFilters}>
                    Clear all
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="filter-group">
                  <h4>CATEGORIES</h4>
                  
                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.categories.vegetables}
                      onChange={() => handleCategoryFilter('vegetables')}
                    />
                    <span className="checkbox-custom"></span>
                    Vegetables (42)
                  </label>

                  <label className="filter-checkbox checked">
                    <input
                      type="checkbox"
                      checked={filters.categories.fruits}
                      onChange={() => handleCategoryFilter('fruits')}
                    />
                    <span className="checkbox-custom"></span>
                    Fruits (28)
                  </label>

                  <label className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.categories.dairy}
                      onChange={() => handleCategoryFilter('dairy')}
                    />
                    <span className="checkbox-custom"></span>
                    Dairy & Eggs (15)
                  </label>
                </div>

                {/* Organic Filter */}
                <div className="filter-group">
                  <label className="organic-toggle">
                    <input
                      type="checkbox"
                      checked={filters.organicOnly}
                      onChange={toggleOrganicFilter}
                    />
                    <span className="toggle-slider"></span>
                    Organic Certified Only
                  </label>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="shop-main">
              
              {/* Seasonal Banner */}
              <div className="seasonal-highlight">
                <div className="highlight-content">
                  <div className="highlight-text">
                    <span className="highlight-label">SEASONAL HIGHLIGHT</span>
                    <h2>Autumn Harvest Sale</h2>
                    <p>
                      Get up to 30% off on selected seasonal root vegetables and orchard fruits. 
                      Sourced directly from verified local farms.
                    </p>
                    <button className="btn btn-secondary">Shop the Sale</button>
                  </div>
                </div>
                <div className="highlight-image">
                  <img src={backgroundImage} alt="Autumn Harvest Sale" />
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-section">
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        {product.badges.map((badge, index) => (
                          <span key={index} className={`product-badge ${badge}`}>
                            {badge === 'organic' ? 'Organic' : 'Fresh Harvest'}
                          </span>
                        ))}
                        <button 
                          className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                          onClick={() => handleWishlistToggle(product)}
                          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="product-info">
                        <div className="product-rating">
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span 
                                key={star} 
                                className={`star ${star <= Math.floor(product.rating) ? 'filled' : ''}`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="rating-number">{product.rating}</span>
                          </div>
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                        <div className="product-farm">
                          <span className="farm-icon">🏪</span>
                          <span className="farm-name">{product.seller}</span>
                          {product.verified && <span className="verified-icon">✓</span>}
                        </div>
                        <div className="product-pricing">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <span className="product-unit">/ {product.unit}</span>
                          <button 
                            className={`add-to-cart ${getItemQuantity(product.id) > 0 ? 'in-cart' : ''}`}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                          >
                            {getItemQuantity(product.id) > 0 ? (
                              <span className="cart-quantity">{getItemQuantity(product.id)}</span>
                            ) : (
                              '+'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button className="pagination-btn prev">‹</button>
                  <button className="pagination-btn active">1</button>
                  <button className="pagination-btn">2</button>
                  <button className="pagination-btn">3</button>
                  <span className="pagination-dots">...</span>
                  <button className="pagination-btn">8</button>
                  <button className="pagination-btn next">›</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;