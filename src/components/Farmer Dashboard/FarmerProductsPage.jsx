import React, { useState } from 'react';
import FarmerLayout from './FarmerLayout';
import AddProductModal from './AddProductModal';
import './FarmerProductsPage.css';

// Import images from assets
import tomatoImg from '../../assets/tomato.png';
import bowlImg from '../../assets/bowl.png';

const FarmerProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  const farmer = {
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: '/api/placeholder/48/48',
    verificationStatus: 'verified' // This would come from the backend/context in real app
  };

  // Initial products with actual images from assets
  const initialProducts = [
    {
      id: 1,
      name: 'Roma Tomatoes',
      category: 'Vegetables',
      image: tomatoImg,
      status: 'Active',
      price: '₦12,500',
      unit: 'basket',
      available: '45 baskets'
    },
    {
      id: 2,
      name: 'Fresh Produce Bowl',
      category: 'Vegetables',
      image: bowlImg,
      status: 'Active',
      price: '₦35,000',
      unit: 'basket',
      available: '30 baskets'
    },
    {
      id: 3,
      name: 'Sweet Maize',
      category: 'Grains',
      image: tomatoImg,
      status: 'Active',
      price: '₦8,000',
      unit: 'bag',
      available: '120 bags'
    },
    {
      id: 4,
      name: 'Ofada Rice',
      category: 'Grains',
      image: bowlImg,
      status: 'Active',
      price: '₦9,500',
      unit: 'bag',
      available: '80 bags'
    },
    {
      id: 5,
      name: 'Fresh Lettuce',
      category: 'Vegetables',
      image: tomatoImg,
      status: 'Active',
      price: '₦2,500',
      unit: 'bunch',
      available: '60 bunches'
    },
    {
      id: 6,
      name: 'Green Peppers',
      category: 'Vegetables',
      image: bowlImg,
      status: 'Active',
      price: '₦3,500',
      unit: 'kg',
      available: '35 kg'
    },
    {
      id: 7,
      name: 'Bitter Leaf',
      category: 'Vegetables',
      image: tomatoImg,
      status: 'Out of Stock',
      price: '₦1,500',
      unit: 'bunch',
      available: '0 bunches'
    },
    {
      id: 8,
      name: 'Carrots',
      category: 'Vegetables',
      image: bowlImg,
      status: 'Draft',
      price: '₦4,000',
      unit: 'kg',
      available: 'Not set'
    }
  ];

  // State for products - allows adding new products
  const [products, setProducts] = useState(initialProducts);

  const productStats = [
    {
      title: 'Total Products',
      value: products.length.toString(),
      icon: '📦',
      status: 'All Status'
    },
    {
      title: 'Active',
      value: products.filter(p => p.status === 'Active').length.toString(),
      icon: '✓',
      color: 'success',
      status: 'Active'
    },
    {
      title: 'Out of Stock',
      value: products.filter(p => p.status === 'Out of Stock').length.toString(),
      icon: '⚠️',
      color: 'warning',
      status: 'Out of Stock'
    },
    {
      title: 'Drafts',
      value: products.filter(p => p.status === 'Draft').length.toString(),
      icon: '📝',
      color: 'draft',
      status: 'Draft'
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

  // Handle adding new product to the list
  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: productData.productName,
      category: productData.category,
      image: productData.images[0] || tomatoImg, // Use first uploaded image or default
      status: productData.isDraft ? 'Draft' : 'Active',
      price: `₦${productData.price}`,
      unit: productData.unit,
      available: `${productData.quantity} ${productData.unit}s`
    };
    
    // Add new product to products list
    setProducts([...products, newProduct]);
    setShowAddProductModal(false);
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
            <button
              key={index}
              type="button"
              className={`stat-card ${stat.color || 'default'} ${selectedStatus === stat.status ? 'selected' : ''}`}
              onClick={() => setSelectedStatus(stat.status)}
              aria-pressed={selectedStatus === stat.status}
            >
              <span className="stat-icon">{stat.icon}</span>
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </button>
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
                  <div className="product-image">
                    {typeof product.image === 'string' && product.image.startsWith('data:') ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : typeof product.image === 'string' && !product.image.startsWith('data:') ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{product.image}</span>
                    )}
                  </div>
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
          onSave={handleAddProduct}
        />
      </div>
    </FarmerLayout>
  );
};

export default FarmerProductsPage;
