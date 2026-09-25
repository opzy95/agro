import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminProducts } from '../../services/adminService';
import './AdminDashboardPage.css';

const getProductImage = (product) => {
  const firstImage = Array.isArray(product.images) ? product.images[0] : null;
  const image = product.image || firstImage;
  return typeof image === 'string' ? image : image?.url || image?.secure_url || '';
};

const ProductImage = ({ src, alt, className }) => (
  src ? (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = 'none';
        event.currentTarget.nextElementSibling.style.display = 'block';
      }}
    />
  ) : null
);

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    getAdminProducts()
      .then((response) => {
        const list = response?.products || response?.data?.products || response?.data || response || [];
        setProducts(Array.isArray(list) ? list.map((product) => ({
          ...product,
          id: product._id || product.id,
          name: product.name || product.productName || 'Unnamed product',
          sku: product.sku || product._id || '-',
          image: getProductImage(product),
          category: product.category || 'Uncategorized',
          stock: Number(product.availableQuantity ?? product.quantity ?? 0),
          price: `₦${Number(product.price || 0).toLocaleString()}`,
          status: String(product.status || 'DRAFT').toUpperCase(),
          vendor: product.farmer?.farmName || product.farmer?.businessName || product.seller || 'Unknown farmer'
        })) : []);
      })
      .catch((error) => setProductsError(error.message))
      .finally(() => setIsLoading(false));
  }, []);
  const activeListings = products.filter((product) => ['ACTIVE', 'PUBLISHED'].includes(product.status));
  const pendingApprovals = products.filter((product) => ['PENDING', 'PENDING_APPROVAL'].includes(product.status));
  const lowStockProducts = products.filter((product) => product.stock <= 10 && !['DRAFT', 'INACTIVE'].includes(product.status));
  const stats = [
    { title: 'TOTAL ACTIVE LISTINGS', value: activeListings.length.toLocaleString(), icon: '📦', color: 'default' },
    { title: 'PENDING APPROVALS', value: pendingApprovals.length.toLocaleString(), alert: pendingApprovals.length ? 'Requires attention' : 'No pending approvals', icon: '⏳', color: 'warning' },
    { title: 'LOW STOCK ALERTS', value: lowStockProducts.length.toLocaleString(), alert: lowStockProducts.length ? 'Requires attention' : 'No low stock products', icon: '⚠️', color: 'alert' }
  ];
  const categories = [...new Set(products.map((product) => product.category))].map((name) => ({ name, count: products.filter((product) => product.category === name).length, color: '#10b981' }));
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  /*
    {
      id: 1,
      name: 'Organic Heirloom Tomatoes',
      sku: 'TCM-001-ORG',
      image: '🍅',
      category: 'Vegetables',
      stock: '459 kg',
      price: '$4.50/kg',
      status: 'ACTIVE'
    },
    {
      id: 2,
      name: 'Artisan Aged Cheddar',
      sku: 'CHS-042-ART',
      image: '🧀',
      category: 'Dairy',
      stock: '12 units',
      price: '$22.00/ea',
      status: 'LOW STOCK'
    },
    {
      id: 3,
      name: 'Granny Smith Apples',
      sku: 'APL-110-GS',
      image: '🍎',
      category: 'Fruits',
      stock: '1200 kg',
      price: '$2.10/kg',
      status: 'ACTIVE'
    },
    {
      id: 4,
      name: 'Locally Sourced Honey',
      sku: 'HNY-005-LOC',
      image: '🍯',
      category: 'Pantry',
      stock: '-',
      price: '$15.00/jar',
      status: 'DRAFT'
    }
  ];

  const legacyPendingApprovals = [
    {
      id: 1,
      product: 'Organic Carrots Bunch',
      vendor: 'Vendor: FarmFresh Co.',
      image: '🥕'
    },
    {
      id: 2,
      product: 'Whole Milk 1L',
      vendor: 'Vendor: Valley Dairy',
      image: '🥛'
    }
  ];

  const legacyCategories = [
    { name: 'Vegetables', count: '4,512', color: '#10b981' },
    { name: 'Fruits', count: '3,105', color: '#3b82f6' },
    { name: 'Dairy & Eggs', count: '1,848', color: '#f59e0b' },
    { name: 'Meat & Poultry', count: '1,218', color: '#ef4444' },
    { name: 'Pantry & Other', count: '1,791', color: '#8b5cf6' }
  ]; */

  const handleAddProduct = () => {
    console.log('Add New Product clicked');
  };

  return (
    <AdminLayout activeMenu="inventory" showSearch={true}>
      <div className="admin-dashboard-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Inventory Control</h1>
            <p className="page-subtitle">Manage product listings, categories, and quality control.</p>
          </div>
          <button className="btn-add-product" onClick={handleAddProduct}>
            <span>+</span> Add New Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-body">
                <p className="stat-label">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
                {stat.trend && (
                  <p className="stat-trend">
                    <span className="trend-icon">📈</span> {stat.trend}
                  </p>
                )}
                {stat.alert && (
                  <p className="stat-alert">{stat.alert}</p>
                )}
              </div>
              <span className="stat-icon">{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Global Catalog Section */}
          <div className="catalog-section">
            <div className="section-header">
              <h2 className="section-title">Global Catalog</h2>
              <div className="header-actions">
                <button className="action-btn">⚙️</button>
                <button className="action-btn">▼</button>
              </div>
            </div>

            {/* Product Table */}
            <div className="table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan="5">Loading products...</td></tr>}
                  {!isLoading && productsError && <tr><td colSpan="5" role="alert">{productsError}</td></tr>}
                  {!isLoading && !productsError && products.length === 0 && <tr><td colSpan="5">No products found.</td></tr>}
                  {paginatedProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="product-cell">
                        <div className="product-info">
                          <div className="product-image">
                            <ProductImage src={product.image} alt={product.name} className="product-image-img" />
                            <span className="product-image-fallback" style={{ display: product.image ? 'none' : 'block' }}>📦</span>
                          </div>
                          <div>
                            <p className="product-name">{product.name}</p>
                            <p className="product-sku">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td className={product.stock === '-' ? 'low-stock' : ''}>
                        {product.stock}
                      </td>
                      <td>{product.price}</td>
                      <td>
                        <span className={`status-badge ${product.status.toLowerCase().replace(' ', '-')}`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-pagination">
                <p>Showing {products.length ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, products.length)} of {products.length}</p>
                <div className="pagination-buttons">
                  <button className="pagination-btn" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Prev</button>
                  <span>{currentPage} / {totalPages}</span>
                  <button className="pagination-btn" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>Next</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="right-sidebar">
            {/* QC Queue Section */}
            <div className="qc-queue-section">
              <div className="section-header">
                <h3 className="section-title">QC Queue</h3>
                <span className="queue-badge">142</span>
              </div>

              <div className="approval-items">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="approval-item">
                    <div className="approval-product">
                      <div className="approval-image">
                        <ProductImage src={item.image} alt={item.name} className="approval-product-image" />
                        {!item.image && '📦'}
                      </div>
                      <div className="approval-info">
                        <p className="approval-name">{item.name}</p>
                        <p className="approval-vendor">Vendor: {item.vendor}</p>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <button className="btn-approve">Approve</button>
                      <button className="btn-reject">Reject</button>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#" className="view-all-link">View All Approvals</a>
            </div>

            {/* Categories Section */}
            <div className="categories-section">
              <div className="section-header">
                <h3 className="section-title">Categories</h3>
                <button className="edit-btn">✏️</button>
              </div>

              <div className="categories-list">
                {categories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-dot" style={{ backgroundColor: category.color }}></div>
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
