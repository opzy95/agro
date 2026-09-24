import React, { useEffect, useState } from 'react';
import FarmerLayout from './FarmerLayout';
import AddProductModal from './AddProductModal';
import { getMyProducts } from '../../services/productService';
import { getCurrentUser } from '../../services/userService';
import './FarmerProductsPage.css';

// Import images from assets
import tomatoImg from '../../assets/tomato.png';

const ProductCard = ({ product, getStatusColor, onOpen }) => {
  const images = product.images?.length ? product.images : [product.image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image-wrapper">
        <div className="product-image">
          <img src={images[selectedImageIndex]} alt={product.name} />
        </div>
        <span className={`product-status ${getStatusColor(product.status)}`}>
          {product.status === 'Active' && '● '}
          {product.status}
        </span>
      </div>
      {images.length > 1 && (
        <div className="product-thumbnails" onClick={(event) => event.stopPropagation()}>
          {images.map((image, index) => (
            <button
              key={`${product.id}-thumbnail-${index}`}
              type="button"
              className={`product-thumbnail ${index === selectedImageIndex ? 'selected' : ''}`}
              onClick={() => setSelectedImageIndex(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
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
      <button className="product-menu" type="button" onClick={(event) => event.stopPropagation()}>⋮</button>
    </div>
  );
};

const ProductDetailsModal = ({ product, getStatusColor, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const displayUnit = product.unit.replace(/^per\s+/i, '');
  const availableQuantity = product.availableQuantity ?? (Number.parseInt(product.available, 10) || 0);
  const availableUnit = availableQuantity === 1
    ? displayUnit
    : displayUnit === 'piece'
      ? 'pieces'
      : displayUnit.endsWith('s')
        ? displayUnit
        : `${displayUnit}s`;

  return (
    <div className="product-details-overlay" onClick={onClose}>
      <div className="product-details-modal" role="dialog" aria-modal="true" aria-labelledby="product-details-title" onClick={(event) => event.stopPropagation()}>
        <button className="product-details-close" type="button" onClick={onClose} aria-label="Close product details">×</button>
        <div className="product-details-gallery">
          <div className="product-details-main-image">
            <img src={images[selectedImageIndex]} alt={product.name} />
          </div>
          <div className="product-details-thumbnails">
            {images.map((image, index) => (
              <button
                key={`details-thumbnail-${index}`}
                type="button"
                className={`product-details-thumbnail ${index === selectedImageIndex ? 'selected' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="product-details-content">
          <span className={`product-status ${getStatusColor(product.status)}`}>{product.status}</span>
          <h2 id="product-details-title">{product.name}</h2>
          <p className="product-details-category">{product.category}</p>
          <p className="product-details-description">{product.description || 'Fresh produce supplied directly from Green Valley Farm.'}</p>
          <div className="product-details-summary">
            <div><span>Price</span><strong>{product.price} / {displayUnit}</strong></div>
            <div><span>Available</span><strong>{availableQuantity} {availableUnit}</strong></div>
          </div>
          {product.sku && <p className="product-details-meta"><strong>SKU:</strong> {product.sku}</p>}
          {product.farmLocation && <p className="product-details-meta"><strong>Location:</strong> {product.farmLocation}</p>}
        </div>
      </div>
    </div>
  );
};

const FarmerProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [sortBy, setSortBy] = useState('Newest');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [farmer, setFarmer] = useState({
    name: 'Green Valley Farm',
    farmName: 'Premium Producer',
    avatar: null,
    verificationStatus: 'not_verified'
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const normalizeProduct = (backendProduct) => {
    const imageList = backendProduct.images?.length
      ? backendProduct.images.map((image) => typeof image === 'string' ? image : image.url).filter(Boolean)
      : [];
    const imageUrl = backendProduct.image || imageList[0] || tomatoImg;
    const availableQuantity = Number(backendProduct.availableQuantity ?? backendProduct.quantity ?? 0);
    const unit = String(backendProduct.unit || 'unit').replace(/^per\s+/i, '');
    const status = backendProduct.status === 'draft'
      ? 'Draft'
      : backendProduct.status === 'published' || backendProduct.status === 'active'
        ? 'Active'
        : backendProduct.status || 'Draft';

    return {
      id: backendProduct._id || backendProduct.id,
      name: backendProduct.name || backendProduct.productName || 'Unnamed product',
      category: backendProduct.category || 'Uncategorized',
      image: imageUrl,
      images: imageList.length ? imageList : [imageUrl],
      description: backendProduct.description,
      sku: backendProduct.sku,
      farmLocation: backendProduct.farmLocation,
      status,
      price: `₦${Number(backendProduct.price || 0).toLocaleString()}`,
      unit,
      availableQuantity,
      available: `${availableQuantity} ${availableQuantity === 1 ? unit : unit === 'piece' ? 'pieces' : unit.endsWith('s') ? unit : `${unit}s`}`
    };
  };

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        const user = response?.user || response?.data?.user || response?.data || response;
        setFarmer({
          name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || 'Green Valley Farm',
          farmName: user?.farmName || 'Premium Producer',
          avatar: user?.profileImage || null,
          verificationStatus: user?.verificationStatus || (user?.isVerified ? 'verified' : 'not_verified')
        });
      })
      .catch(() => {});

    const fetchProducts = async () => {
      try {
        const response = await getMyProducts();
        const backendProducts = response?.products || response?.data?.products || response?.data || response || [];
        setProducts((Array.isArray(backendProducts) ? backendProducts : []).map(normalizeProduct));
      } catch (error) {
        console.error('Failed to fetch farmer products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    const backendProduct = productData.product || productData;
    const newProduct = normalizeProduct(backendProduct);

    setProducts(prevProducts => [...prevProducts, newProduct]);
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
          {isLoading ? (
            <div className="no-products">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} getStatusColor={getStatusColor} onOpen={setSelectedProduct} />
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
        <ProductDetailsModal product={selectedProduct} getStatusColor={getStatusColor} onClose={() => setSelectedProduct(null)} />
      </div>
    </FarmerLayout>
  );
};

export default FarmerProductsPage;
