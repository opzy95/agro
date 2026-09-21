import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { addProductReview, getProducts } from '../services/productService';
import { ROUTES } from '../routes/routeUtils';
import './ShopPage.css';

// Import your background images
import backgroundImage from '../assets/Background Image.png';
import farmersWorking from '../assets/Farmers working in field.png';
import background1 from '../assets/Background (1).png';
import background2 from '../assets/Background (2).png';
import background from '../assets/Background.png';
import heroImg from '../assets/hero.png';

const ProductDetailsModal = ({ product, onClose, onAddToCart, getItemQuantity }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const displayUnit = product.unit.replace(/^per\s+/i, '');

  return (
    <div className="shop-details-overlay" onClick={onClose}>
      <div className="shop-details-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="shop-details-close" onClick={onClose} aria-label="Close product details">
          ×
        </button>
        <div className="shop-details-gallery">
          <img className="shop-details-main-image" src={images[selectedImageIndex]} alt={product.name} />
          {images.length > 1 && (
            <div className="shop-details-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${product.id}-detail-image-${index}`}
                  className={`shop-details-thumbnail ${index === selectedImageIndex ? 'selected' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="shop-details-content">
          <p className="shop-details-category">{product.category}</p>
          <h2>{product.name}</h2>
          <div className="shop-details-rating">
            {'★★★★★'.split('').map((star, index) => (
              <span key={index} className={index < Math.floor(product.rating) ? 'filled' : ''}>{star}</span>
            ))}
            <span>{product.rating} {product.ratingCount ? `(${product.ratingCount} reviews)` : ''}</span>
          </div>
          <p className="shop-details-description">{product.description || 'Fresh produce supplied directly from a local farmer.'}</p>
          <div className="shop-details-meta">
            <span>Price</span><strong>${product.price.toFixed(2)} / {displayUnit}</strong>
            <span>Available</span><strong>{product.availableQuantity} {displayUnit}</strong>
            {product.farmLocation && <><span>Location</span><strong>{product.farmLocation}</strong></>}
            <span>Seller</span><strong>{product.seller}</strong>
          </div>
          <button
            type="button"
            className="add-to-cart shop-details-cart-button"
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
          >
            {getItemQuantity(product.id) > 0 ? `${getItemQuantity(product.id)} in cart` : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const { addToCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    categories: {
      vegetables: false,
      fruits: false,
      dairy: false
    }
  });

  // Fallback catalog shape retained for the existing card layout until the API responds.
  const fallbackProducts = [
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
      inStock: true,
      category: 'vegetables',
      isOrganic: true
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
      inStock: true,
      category: 'vegetables',
      isOrganic: false
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
      inStock: true,
      category: 'fruits',
      isOrganic: true
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
      inStock: true,
      category: 'vegetables',
      isOrganic: false
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
      inStock: true,
      category: 'vegetables',
      isOrganic: false
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
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 7,
      name: 'Free-Range Organic Eggs',
      price: 5.99,
      unit: 'dozen',
      image: background1,
      seller: 'Happy Hens Farm',
      verified: true,
      badges: ['organic'],
      rating: 4.9,
      inStock: true,
      category: 'dairy',
      isOrganic: true
    },
    {
      id: 8,
      name: 'Fresh Blueberries',
      price: 8.50,
      unit: 'lb',
      image: background2,
      seller: 'Berry Fresh Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.8,
      inStock: true,
      category: 'fruits',
      isOrganic: true
    },
    {
      id: 9,
      name: 'Organic Spinach Bundle',
      price: 3.50,
      unit: 'bunch',
      image: background,
      seller: 'Leafy Greens Co',
      verified: true,
      badges: ['fresh'],
      rating: 4.7,
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 10,
      name: 'Fresh Broccoli Crowns',
      price: 4.25,
      unit: 'lb',
      image: heroImg,
      seller: 'Green Valley Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.6,
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 11,
      name: 'Heirloom Tomatoes',
      price: 6.75,
      unit: 'lb',
      image: background1,
      seller: 'Sunrise Orchards',
      verified: true,
      badges: ['organic'],
      rating: 4.8,
      inStock: true,
      category: 'fruits',
      isOrganic: true
    },
    {
      id: 12,
      name: 'Raw Unpasteurized Honey',
      price: 12.50,
      unit: 'jar',
      image: background2,
      seller: 'Golden Bee Apiary',
      verified: true,
      badges: ['organic'],
      rating: 4.9,
      inStock: true,
      category: 'dairy',
      isOrganic: true
    },
    {
      id: 13,
      name: 'Fresh Mushrooms Mix',
      price: 7.50,
      unit: 'lb',
      image: background,
      seller: 'Forest Fresh Farms',
      verified: true,
      badges: ['fresh'],
      rating: 4.5,
      inStock: true,
      category: 'vegetables',
      isOrganic: false
    },
    {
      id: 14,
      name: 'Organic Zucchini',
      price: 3.75,
      unit: 'lb',
      image: heroImg,
      seller: 'Valley Gardens',
      verified: false,
      badges: ['organic'],
      rating: 4.4,
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 15,
      name: 'Fresh Corn on the Cob',
      price: 4.50,
      unit: '4 pack',
      image: background1,
      seller: 'Cornfield Farms',
      verified: false,
      badges: ['fresh'],
      rating: 4.7,
      inStock: true,
      category: 'vegetables',
      isOrganic: false
    },
    {
      id: 16,
      name: 'Organic Avocados',
      price: 7.99,
      unit: '3 pack',
      image: background2,
      seller: 'Green Valley Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.8,
      inStock: true,
      category: 'fruits',
      isOrganic: true
    },
    {
      id: 17,
      name: 'Fresh Cucumber Bundle',
      price: 3.25,
      unit: 'bunch',
      image: background,
      seller: 'Valley Gardens',
      verified: false,
      badges: ['fresh'],
      rating: 4.6,
      inStock: true,
      category: 'vegetables',
      isOrganic: false
    },
    {
      id: 18,
      name: 'Organic Garlic Bulbs',
      price: 5.50,
      unit: 'lb',
      image: heroImg,
      seller: 'Mountain View Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.5,
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 19,
      name: 'Fresh Watermelon',
      price: 9.99,
      unit: 'whole',
      image: background1,
      seller: 'Summer Harvest Farms',
      verified: false,
      badges: ['fresh'],
      rating: 4.8,
      inStock: true,
      category: 'fruits',
      isOrganic: false
    },
    {
      id: 20,
      name: 'Organic Almonds',
      price: 14.99,
      unit: 'lb',
      image: background2,
      seller: 'Nut Valley Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.9,
      inStock: true,
      category: 'dairy',
      isOrganic: true
    },
    {
      id: 21,
      name: 'Fresh Raspberries',
      price: 8.25,
      unit: 'lb',
      image: background,
      seller: 'Berry Fresh Farms',
      verified: true,
      badges: ['organic'],
      rating: 4.8,
      inStock: true,
      category: 'fruits',
      isOrganic: true
    },
    {
      id: 22,
      name: 'Organic Kale',
      price: 4.00,
      unit: 'bunch',
      image: heroImg,
      seller: 'Green Valley Farms',
      verified: true,
      badges: ['fresh'],
      rating: 4.7,
      inStock: true,
      category: 'vegetables',
      isOrganic: true
    },
    {
      id: 23,
      name: 'Fresh Carrots Bundle',
      price: 5.50,
      unit: 'lb',
      image: background1,
      seller: 'Carrot Patch Farm',
      verified: false,
      badges: ['fresh'],
      rating: 4.6,
      inStock: true,
      category: 'vegetables',
      isOrganic: false
    },
    {
      id: 24,
      name: 'Organic Olive Oil',
      price: 18.50,
      unit: 'bottle',
      image: background2,
      seller: 'Golden Grove Oils',
      verified: true,
      badges: ['organic'],
      rating: 4.9,
      inStock: true,
      category: 'dairy',
      isOrganic: true
    }
  ];

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [reviewingProductId, setReviewingProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const normalizeProduct = (backendProduct) => {
    const imageList = (backendProduct.images || [])
      .map((image) => typeof image === 'string' ? image : image?.url)
      .filter(Boolean);
    const image = backendProduct.image || imageList[0] || background1;
    const quantity = Number(backendProduct.availableQuantity ?? backendProduct.quantity ?? 0);
    const farmer = backendProduct.farmer;
    const seller = typeof farmer === 'string'
      ? farmer
      : farmer?.farmName || farmer?.businessName || [farmer?.firstName, farmer?.lastName].filter(Boolean).join(' ') || 'Local Farmer';
    const status = String(backendProduct.status || '').toLowerCase();

    return {
      id: backendProduct._id || backendProduct.id,
      name: backendProduct.name || backendProduct.productName || 'Unnamed product',
      price: Number(backendProduct.price || 0),
      unit: backendProduct.unit || 'unit',
      image,
      images: imageList.length ? imageList : [image],
      seller,
      verified: Boolean(farmer?.verificationStatus === 'verified' || farmer?.isVerified),
      badges: backendProduct.isOrganic ? ['organic'] : [],
      rating: Number(backendProduct.rating || 0),
      ratingCount: Number(backendProduct.ratingCount || 0),
      inStock: quantity > 0 && status !== 'draft' && status !== 'inactive',
      category: String(backendProduct.category || 'other').trim().toLowerCase(),
      isOrganic: Boolean(backendProduct.isOrganic),
      availableQuantity: quantity,
      farmLocation: backendProduct.farmLocation,
      description: backendProduct.description
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const backendProducts = response?.products || response?.data?.products || response?.data || response || [];
        setProducts((Array.isArray(backendProducts) ? backendProducts : []).map(normalizeProduct));
      } catch (error) {
        console.error('Failed to fetch shop products:', error);
        setLoadError(error.message || 'Unable to load products.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductRating = async (product, rating) => {
    setReviewingProductId(product.id);

    try {
      const response = await addProductReview(product.id, rating);
      const reviewedProduct = response?.product || response?.data?.product;

      setProducts((currentProducts) => currentProducts.map((currentProduct) => (
        currentProduct.id === product.id && reviewedProduct
          ? {
              ...currentProduct,
              rating: Number(reviewedProduct.rating ?? rating),
              ratingCount: Number(reviewedProduct.ratingCount ?? currentProduct.ratingCount ?? 0)
            }
          : currentProduct
      )));
    } catch (error) {
      console.error('Failed to submit product rating:', error);
      window.alert(error.message || 'Unable to submit rating.');
    } finally {
      setReviewingProductId(null);
    }
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Check category filter
    const selectedCategories = Object.entries(filters.categories)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    
    // If any category is selected, product must match one of them
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Check search term
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort products based on selected sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return b.id - a.id;
      case 'popular':
      default:
        return b.rating - a.rating;
    }
  });

  const handleCategoryFilter = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: {}
    });
  };

  const categoryOptions = [...new Set(products.map((product) => product.category))].sort();

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

                  {categoryOptions.map((category) => (
                    <label className="filter-checkbox" key={category}>
                      <input
                        type="checkbox"
                        checked={Boolean(filters.categories[category])}
                        onChange={() => handleCategoryFilter(category)}
                      />
                      <span className="checkbox-custom"></span>
                      {category.replace(/\b\w/g, (letter) => letter.toUpperCase())} ({products.filter((product) => product.category === category).length})
                    </label>
                  ))}
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
                  {isLoading ? (
                    <div className="no-products">
                      <p>Loading products...</p>
                    </div>
                  ) : loadError ? (
                    <div className="no-products">
                      <p>{loadError}</p>
                    </div>
                  ) : sortedProducts.length === 0 ? (
                    <div className="no-products">
                      <p>No products are currently available.</p>
                    </div>
                  ) : sortedProducts.map((product) => (
                    <div key={product.id} className="product-card" onClick={() => setSelectedProduct(product)}>
                      <div className="shop-product-image">
                        <img src={product.image} alt={product.name} />
                        {product.badges.map((badge, index) => (
                          <span key={index} className={`product-badge ${badge}`}>
                            {badge === 'organic' ? 'Organic' : 'Fresh Harvest'}
                          </span>
                        ))}
                        <button 
                          className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                          onClick={(event) => { event.stopPropagation(); handleWishlistToggle(product); }}
                          title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        </button>
                      </div>
                      <div className="shop-product-info">
                        <div className="product-rating" aria-label={`Product rating: ${product.rating} out of 5`}>
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star} 
                                type="button"
                                className={`star ${star <= Math.floor(product.rating) ? 'filled' : ''}`}
                                onClick={(event) => { event.stopPropagation(); handleProductRating(product, star); }}
                                disabled={reviewingProductId === product.id}
                                aria-label={`Rate ${product.name} ${star} out of 5 stars`}
                              >
                                ★
                              </button>
                            ))}
                            <span className="rating-number">{product.ratingCount ? `${product.rating} (${product.ratingCount})` : product.rating}</span>
                          </div>
                        </div>
                        <h3 className="shop-product-name">{product.name}</h3>
                        <div className="product-farm">
                          <span className="farm-icon">🏪</span>
                          <span className="farm-name">{product.seller}</span>
                          {product.verified && <span className="verified-icon">✓</span>}
                        </div>
                        <div className="shop-product-pricing">
                          <span className="shop-product-price">${product.price.toFixed(2)}</span>
                          <span className="shop-product-unit">/ {product.unit}</span>
                          <button 
                            className={`add-to-cart ${getItemQuantity(product.id) > 0 ? 'in-cart' : ''}`}
                            onClick={(event) => { event.stopPropagation(); handleAddToCart(product); }}
                            disabled={!product.inStock}
                          >
                            {getItemQuantity(product.id) > 0 ? (
                              <span className="cart-quantity">{getItemQuantity(product.id)} in cart</span>
                            ) : (
                              'Add to cart'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        getItemQuantity={getItemQuantity}
      />
    </main>
  );
};

export default ShopPage;