import React, { useState } from 'react';
import './AddProductModal.css';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    sku: '',
    description: '',
    price: '',
    unit: 'per lb',
    quantity: '',
    minimumOrder: '1',
    farmLocation: 'Main Farm (Green Valley)',
    shippingMethods: {
      farmPickup: true,
      localDelivery: true,
      nationalCourier: false
    },
    images: []
  });

  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (method) => {
    setFormData(prev => ({
      ...prev,
      shippingMethods: {
        ...prev.shippingMethods,
        [method]: !prev.shippingMethods[method]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    return newErrors;
  };

  const handleSubmit = (e, isDraft = false) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      images: uploadedImages,
      isDraft
    });
  };

  const handleCancel = () => {
    setFormData({
      productName: '',
      category: '',
      sku: '',
      description: '',
      price: '',
      unit: 'per lb',
      quantity: '',
      minimumOrder: '1',
      farmLocation: 'Main Farm (Green Valley)',
      shippingMethods: {
        farmPickup: true,
        localDelivery: true,
        nationalCourier: false
      },
      images: []
    });
    setUploadedImages([]);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-product-modal-overlay">
      <div className="add-product-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <button 
            className="back-btn"
            onClick={handleCancel}
            type="button"
          >
            ← Back to Products
          </button>
          <button 
            className="close-btn"
            onClick={handleCancel}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          <div className="modal-title-section">
            <h1 className="modal-title">Add New Product</h1>
            <p className="modal-subtitle">Fill in the details below to list a new item on your storefront.</p>
          </div>

          <form className="add-product-form">
            <div className="form-layout">
              {/* Left Column */}
              <div className="form-column-left">
                {/* Product Information Section */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">ℹ️</span>
                    <h2 className="section-title">Product Information</h2>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Product Name <span className="required">*</span></label>
                    <input
                      type="text"
                      name="productName"
                      placeholder="e.g. Organic Heirloom Tomatoes"
                      value={formData.productName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.productName ? 'error' : ''}`}
                    />
                    {errors.productName && <span className="error-text">{errors.productName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category <span className="required">*</span></label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`form-select ${errors.category ? 'error' : ''}`}
                      >
                        <option value="">Select a category</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Grains">Grains</option>
                        <option value="Tubers">Tubers</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Herbs">Herbs</option>
                        <option value="Spices">Spices</option>
                      </select>
                      {errors.category && <span className="error-text">{errors.category}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">SKU (Optional)</label>
                      <input
                        type="text"
                        name="sku"
                        placeholder="HTOM-001"
                        value={formData.sku}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      placeholder="Describe your product's origin, taste, and best uses..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>

                {/* Pricing & Inventory Section */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">💰</span>
                    <h2 className="section-title">Pricing & Inventory</h2>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price <span className="required">*</span></label>
                      <div className="input-with-prefix">
                        <span className="currency">₦</span>
                        <input
                          type="number"
                          name="price"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={`form-input ${errors.price ? 'error' : ''}`}
                          step="0.01"
                        />
                      </div>
                      {errors.price && <span className="error-text">{errors.price}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit <span className="required">*</span></label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="per lb">per lb</option>
                        <option value="per kg">per kg</option>
                        <option value="per piece">per piece</option>
                        <option value="per dozen">per dozen</option>
                        <option value="per basket">per basket</option>
                        <option value="per bag">per bag</option>
                        <option value="per bunch">per bunch</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Available Quantity <span className="required">*</span></label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="100"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className={`form-input ${errors.quantity ? 'error' : ''}`}
                      />
                      {errors.quantity && <span className="error-text">{errors.quantity}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Minimum Order Qty</label>
                      <input
                        type="number"
                        name="minimumOrder"
                        placeholder="1"
                        value={formData.minimumOrder}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="form-column-right">
                {/* Product Media Section */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">🖼️</span>
                    <h2 className="section-title">Product Media</h2>
                  </div>

                  {uploadedImages.length === 0 ? (
                    <div className="upload-area">
                      <label htmlFor="image-upload" className="upload-label">
                        <svg className="upload-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        <p className="upload-text">Click to upload or drag and drop</p>
                        <p className="upload-hint">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                    </div>
                  ) : (
                    <div className="uploaded-images">
                      {/* Main Image Display */}
                      <div className="main-image-wrapper">
                        <div className="main-image-container">
                          <img 
                            src={uploadedImages[selectedImageIndex]} 
                            alt="Product Main" 
                            className="image-preview" 
                          />
                        </div>
                      </div>

                      {/* Thumbnail Row */}
                      <div className="thumbnail-row">
                        {uploadedImages.map((image, index) => (
                          <div
                            key={index}
                            className={`image-item ${index === selectedImageIndex ? 'selected' : ''}`}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <img 
                              src={image} 
                              alt={`Thumbnail ${index + 1}`}
                              className="image-preview-thumb"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                                if (selectedImageIndex >= uploadedImages.length - 1) {
                                  setSelectedImageIndex(Math.max(0, uploadedImages.length - 2));
                                }
                              }}
                            >
                              +
                            </button>
                          </div>
                        ))}

                        {/* Add More Button */}
                        <label htmlFor="image-upload-more" className="add-more-btn">
                          +
                        </label>
                        <input
                          id="image-upload-more"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Location & Logistics Section */}
                <div className="form-section">
                  <div className="section-header">
                    <span className="section-icon">📍</span>
                    <h2 className="section-title">Location & Logistics</h2>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Farm Location</label>
                    <div className="location-display">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{formData.farmLocation}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Shipping Methods</label>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingMethods.farmPickup}
                          onChange={() => handleCheckboxChange('farmPickup')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Farm Pickup</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingMethods.localDelivery}
                          onChange={() => handleCheckboxChange('localDelivery')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">Local Delivery</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.shippingMethods.nationalCourier}
                          onChange={() => handleCheckboxChange('nationalCourier')}
                          className="checkbox-input"
                        />
                        <span className="checkbox-custom"></span>
                        <span className="checkbox-text">National Courier</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="btn btn-secondary"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                onClick={(e) => handleSubmit(e, false)}
                className="btn btn-primary"
              >
                <span>✓</span> Publish Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
