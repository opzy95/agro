import React from 'react';
import DashboardLayout from './DashboardLayout';

// Import the shop content without the header/breadcrumb sections
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

// Import your background images
import backgroundImage from '../../assets/Background Image.png';
import farmersWorking from '../../assets/Farmers working in field.png';
import background1 from '../../assets/Background (1).png';
import background2 from '../../assets/Background (2).png';
import background from '../../assets/Background.png';
import heroImg from '../../assets/hero.png';

const CustomerShopPage = () => {
  const { addToCart, getItemQuantity } = useCart();
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

  // Product data (same as ShopPage)
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
    <DashboardLayout 
      title="Shop Fresh Products"
      showSearch={true}
      showNotifications={true}
    >
      <div className="customer-shop-content" style={{ padding: '0', margin: '0' }}>
        {/* Shop Content without header */}
        <div className="shop-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem', padding: '1rem' }}>
          
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            {/* Search */}
            <div className="search-section" style={{ marginBottom: '1.5rem' }}>
              <div className="search-wrapper" style={{ position: 'relative' }}>
                <span className="search-icon" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem 1rem 0.75rem 2.5rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="sort-section" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="sort" style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="filters-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: '0', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>Filters</h3>
                <button 
                  onClick={clearFilters}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#059669', 
                    cursor: 'pointer', 
                    fontSize: '0.875rem',
                    textDecoration: 'underline'
                  }}
                >
                  Clear all
                </button>
              </div>

              {/* Categories Filter */}
              <div className="filter-group" style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>CATEGORIES</h4>
                
                {[
                  { key: 'vegetables', label: 'Vegetables (42)' },
                  { key: 'fruits', label: 'Fruits (28)' },
                  { key: 'dairy', label: 'Dairy & Eggs (15)' }
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={filters.categories[key]}
                      onChange={() => handleCategoryFilter(key)}
                      style={{ margin: '0' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#374151' }}>{label}</span>
                  </label>
                ))}
              </div>

              {/* Organic Filter */}
              <div className="filter-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={filters.organicOnly}
                    onChange={toggleOrganicFilter}
                    style={{ margin: '0' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>Organic Certified Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="shop-main">
            
            {/* Seasonal Banner */}
            <div 
              className="seasonal-highlight" 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto', 
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid #bbf7d0'
              }}
            >
              <div className="highlight-content">
                <div className="highlight-text">
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: '#059669',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}>SEASONAL HIGHLIGHT</span>
                  <h2 style={{ margin: '0 0 0.75rem 0', fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Autumn Harvest Sale</h2>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', lineHeight: '1.5' }}>
                    Get up to 30% off on selected seasonal root vegetables and orchard fruits. 
                    Sourced directly from verified local farms.
                  </p>
                  <button style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>Shop the Sale</button>
                </div>
              </div>
              <div className="highlight-image" style={{ width: '120px', height: '120px' }}>
                <img src={backgroundImage} alt="Autumn Harvest Sale" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-section">
              <div 
                className="products-grid" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '1.5rem' 
                }}
              >
                {products.map((product) => (
                  <div key={product.id} style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      {product.badges.map((badge, index) => (
                        <span 
                          key={index} 
                          style={{
                            position: 'absolute',
                            top: '0.75rem',
                            left: '0.75rem',
                            background: badge === 'organic' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}
                        >
                          {badge === 'organic' ? 'Organic' : 'Fresh Harvest'}
                        </span>
                      ))}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            style={{ color: star <= Math.floor(product.rating) ? '#fbbf24' : '#e5e7eb' }}
                          >
                            ★
                          </span>
                        ))}
                        <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.25rem' }}>{product.rating}</span>
                      </div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{product.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        <span>🏪</span>
                        <span>{product.seller}</span>
                        {product.verified && <span style={{ color: '#10b981' }}>✓</span>}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>${product.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.25rem' }}>/ {product.unit}</span>
                        </div>
                        <button 
                          style={{
                            background: getItemQuantity(product.id) > 0 ? '#059669' : '#4a7c59',
                            color: 'white',
                            border: 'none',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          {getItemQuantity(product.id) > 0 ? (
                            <span>{getItemQuantity(product.id)}</span>
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '0.5rem', 
                marginTop: '2rem' 
              }}>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>‹</button>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #059669', background: '#059669', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>1</button>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>2</button>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>3</button>
                <span style={{ color: '#6b7280' }}>...</span>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>8</button>
                <button style={{ padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', background: 'white', borderRadius: '6px', cursor: 'pointer' }}>›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerShopPage;