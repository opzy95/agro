import React from 'react';
import './PaymentSuccessModal.css';

const PaymentSuccessModal = ({ isOpen, onClose, cardData, onSetAsDefault, onBackToPaymentMethods }) => {
  if (!isOpen || !cardData) return null;

  const getCardTypeName = (type) => {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      default:
        return 'Mastercard';
    }
  };

  const handleBackToPaymentMethods = () => {
    onBackToPaymentMethods();
    onClose();
  };

  const handleSetAsDefault = () => {
    onSetAsDefault(cardData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="success-modal">
        {/* Success Icon */}
        <div className="success-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" fill="#10b981"/>
            <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="success-title">Payment Method Added</h2>
        <p className="success-message">
          Your {getCardTypeName(cardData.cardType)} ending in {cardData.lastFour} has been
          securely saved to your account.
        </p>

        {/* Card Preview */}
        <div className={`success-card-preview ${cardData.cardType}`}>
          <div className="card-brand-logo">
            {cardData.cardType === 'mastercard' && (
              <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
                <circle cx="15" cy="16" r="10" fill="white" opacity="0.9"/>
                <circle cx="25" cy="16" r="10" fill="white" opacity="0.7"/>
                <text x="20" y="20" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">M</text>
              </svg>
            )}
          </div>

          <div className="success-card-content">
            <h3 className="card-brand">{getCardTypeName(cardData.cardType)}</h3>
            <div className="card-number-display">
              •••• •••• •••• {cardData.lastFour}
            </div>
            <div className="card-holder-name">{cardData.cardholderName}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <button className="back-to-methods-btn" onClick={handleBackToPaymentMethods}>
            Back to Payment Methods
          </button>
          
          {!cardData.setAsDefault && (
            <button className="set-default-btn" onClick={handleSetAsDefault}>
              Set as Default
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;