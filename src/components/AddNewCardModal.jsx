import React, { useState } from 'react';
import './AddNewCardModal.css';

const AddNewCardModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    setAsDefault: false
  });

  const [cardType, setCardType] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces and detect card type
      const cleanValue = value.replace(/\s/g, '');
      const formattedValue = cleanValue.replace(/(.{4})/g, '$1 ').trim();
      
      // Detect card type
      if (cleanValue.startsWith('4')) {
        setCardType('visa');
      } else if (cleanValue.startsWith('5') || cleanValue.startsWith('2')) {
        setCardType('mastercard');
      } else if (cleanValue.startsWith('3')) {
        setCardType('amex');
      } else {
        setCardType('');
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'expirationDate') {
      // Format expiration date as MM/YY
      const cleanValue = value.replace(/\D/g, '');
      let formattedValue = cleanValue;
      if (cleanValue.length >= 2) {
        formattedValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
      }
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      onSuccess({
        cardType,
        lastFour: formData.cardNumber.slice(-4),
        cardholderName: formData.cardholderName,
        setAsDefault: formData.setAsDefault
      });
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cvv: '',
      setAsDefault: false
    });
    setCardType('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-card-modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Add New Card</h2>
          <button className="close-btn" onClick={handleCancel}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Card Preview */}
        <div className={`card-preview ${cardType}`}>
          <div className="card-chip">
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
              <rect width="30" height="24" rx="4" fill="#FFD700"/>
              <rect x="2" y="2" width="26" height="20" rx="2" fill="#FFA500"/>
              <rect x="4" y="4" width="22" height="16" rx="1" fill="#FF8C00"/>
            </svg>
          </div>
          
          <div className="card-logo">
            {cardType === 'mastercard' && (
              <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                <circle cx="15" cy="16" r="10" fill="#FF5F00"/>
                <circle cx="25" cy="16" r="10" fill="#EB001B"/>
                <path d="M20 8c1.326 0 2.598.25 3.768.705A9.97 9.97 0 0020 16a9.97 9.97 0 003.768 7.295A9.965 9.965 0 0120 24c-1.326 0-2.598-.25-3.768-.705A9.97 9.97 0 0020 16a9.97 9.97 0 00-3.768-7.295A9.965 9.965 0 0120 8z" fill="#FF5F00"/>
              </svg>
            )}
          </div>

          <div className="card-number">
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="card-details">
            <div className="cardholder-section">
              <div className="card-label">CARDHOLDER</div>
              <div className="card-name">
                {formData.cardholderName.toUpperCase() || 'JOHN DOE'}
              </div>
            </div>
            <div className="expires-section">
              <div className="card-label">EXPIRES</div>
              <div className="card-expiry">
                {formData.expirationDate || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-group">
            <label htmlFor="cardholderName">Cardholder Name</label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Card Number</label>
            <div className="card-input-wrapper">
              <svg className="card-icon" width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="1" y="1" width="18" height="14" rx="2"/>
                <line x1="1" y1="6" x2="19" y2="6"/>
              </svg>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength="5"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cvv">
                CVV
                <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9,9h0a3,3,0,0,1,6,0c0,2-3,3-3,3"/>
                  <path d="M12,17h0"/>
                </svg>
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="4"
                required
              />
            </div>
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="setAsDefault"
              name="setAsDefault"
              checked={formData.setAsDefault}
              onChange={handleInputChange}
            />
            <label htmlFor="setAsDefault">Set as default payment method</label>
          </div>

          <div className="security-note">
            <svg className="lock-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <circle cx="12" cy="16" r="1"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Your payment information is encrypted and secure.
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="add-card-btn">
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCardModal;