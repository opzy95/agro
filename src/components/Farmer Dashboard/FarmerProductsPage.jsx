import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';
import AddProductModal from './AddProductModal';
import './FarmerProductsPage.css';

const FarmerProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: '/api/placeholder/48/48'
  };

  const productStats = [
    {
      title: 'Total Products',
      value: '18',
      icon: '📦'
    },
    {
      title: 'Active',
      value: '15',
      icon: '✓',
      color: 'success'
    },
    {
      title: 'Out of Stock',
      value: '2',
      icon: '⚠️',
      color: 'warning'
    },
    {
      title: 'Drafts',
      value: '1',
      icon: '📝',
      color: 'draft'
    }
  ];

  const products = [
    {
      id: 1,
      name: 'Roma Tomatoes',
      category: 'Vegetables',
      image: '🍅',
      status: 'Active',
      price: '₦12,500',
      unit: 'basket',
      available: '45 baskets'
    },
    {
      id: 2,
      name: 'White Yams',
      category: 'Tubers',
      image: '🍠',
      status: 'Out of Stock',
      price: '₦35,000',
      unit: 'tuber',
      available: '0 tubers'
    },
    {
      id: 3,
      name: 'Sweet Maize',
      category: 'Grains',
      image: '🌽',
      status: 'Active',
      price: '₦8,000',
      unit: 'bag',
      available: '120 bags'
    },
    {
      id: 4,
      name: 'Ofada Rice',
      category: 'Grains',
      image: '🍚',
      status: 'Active',
      price: '₦9,500',
      unit: 'bag',
      available: '80 bags'
    },
    {
      id: 5,
      name: 'Fresh Lettuce',
      category: 'Vegetables',
      image: '🥬',
      status: 'Active',
      price: '₦2,500',
      unit: 'bunch',
      available: '60 bunches'
    },
    {
      id: 6,
      name: 'Green Peppers',
      category: 'Vegetables',
      image: '🫑',
      status: 'Active',
      price: '₦3,500',
      unit: 'kg',
      available: '35 kg'
    },
    {
      id: 7,
      name: 'Bitter Leaf',
      category: 'Vegetables',
      image: '🌿',
      status: 'Out of Stock',
      price: '₦1,500',
      unit: 'bunch',
      available: '0 bunches'
    },
    {
      id: 8,
      name: 'Carrots',
      category: 'Vegetables',
      image: '🥕',
      status: 'Draft',
      price: '₦4,000',
      unit: 'kg',
      available: 'Not set'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || product.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'active';
      case 'Out of Stock':
        return 'out-of-stock';
      case 'Draft':
        return 'draft';
      default:
        return '';
    }
  };

  return (
    <FarmerLayout farmer={farmer} showSearch={true} showNotifications={true}>
      <div className="farmer-products-page">
        {/* Page Header */}
        <div className="products-page-header">
          <div className="header-content">
            <h1 className="page-title">My Products</h1>
            <p className="page-subtitle">Manage the products you're selling on HarvestHub.</p>
          </div>
          <button className="btn-add-product" onClick={() => setShowAddProductModal(true)}>
            <span>+</span> Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="products-stats">
          {productStats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color || 'default'}`}>
              <span className="stat-icon">{stat.icon}</span>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="products-filters">
          <div className="search-box">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option>All Categories</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Tubers</option>
            <option>Dairy</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Out of Stock</option>
            <option>Draft</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Price High</option>
            <option>Sort by: Price Low</option>
            <option>Sort by: Most Sold</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <div className="product-image">{product.image}</div>
                  <span className={`product-status ${getStatusColor(product.status)}`}>
                    {product.status === 'Active' && '● '}
                    {product.status}
                  </span>
                </div>
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-price-section">
                    <div className="product-price-info">
                      <p className="product-label">Price</p>
                      <p className="product-price">{product.price}<span className="price-unit">/ {product.unit}</span></p>
                    </div>
                    <div className="product-available-info">
                      <p className="product-label">Available</p>
                      <p className="product-available">{product.available}</p>
                    </div>
                  </div>
                </div>
                <button className="product-menu">⋮</button>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found matching your filters.</p>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={() => setShowAddProductModal(false)}
          onSave={(productData) => {
            console.log('Product saved:', productData);
            setShowAddProductModal(false);
            // Here you would typically add the product to your state or send it to the backend
          }}
        />
      </div>
    </FarmerLayout>
  );
};

export default FarmerProductsPage;
