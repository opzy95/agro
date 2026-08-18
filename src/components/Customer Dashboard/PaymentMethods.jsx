import React, { useState } from 'react';
import AddNewCardModal from '../AddNewCardModal';
import PaymentSuccessModal from '../PaymentSuccessModal';
import './PaymentMethods.css';

const PaymentMethods = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      type: 'VISA',
      lastFour: '4242',
      holderName: 'Alice Farmer',
      expiryDate: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'MC',
      lastFour: '8891',
      holderName: 'Alice Farmer',
      expiryDate: '08/25',
      isDefault: false
    }
  ]);

  const [billingAddress] = useState({
    name: 'Alice Farmer',
    address: '123 Harvest Lane, Suite B',
    city: 'Portland',
    state: 'OR',
    zipCode: '97204',
    country: 'United States'
  });

  // Modal states
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successCardData, setSuccessCardData] = useState(null);

  const handleSetAsDefault = (cardId) => {
    setCards(cards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter(card => card.id !== cardId));
  };

  const handleAddNewCard = () => {
    setShowAddCardModal(true);
  };

  const handleAddCardSuccess = (cardData) => {
    // Create new card object
    const newCard = {
      id: cards.length + 1,
      type: cardData.cardType === 'mastercard' ? 'MC' : cardData.cardType.toUpperCase(),
      lastFour: cardData.lastFour,
      holderName: cardData.cardholderName,
      expiryDate: '12/26', // You can extract this from the form data
      isDefault: cardData.setAsDefault
    };

    // If this card is set as default, make all others non-default
    if (cardData.setAsDefault) {
      setCards(prevCards => [
        ...prevCards.map(card => ({ ...card, isDefault: false })),
        newCard
      ]);
    } else {
      setCards(prevCards => [...prevCards, newCard]);
    }

    // Close add card modal and show success modal
    setShowAddCardModal(false);
    setSuccessCardData(cardData);
    setShowSuccessModal(true);
  };

  const handleCloseAddCardModal = () => {
    setShowAddCardModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setSuccessCardData(null);
  };

  const handleBackToPaymentMethods = () => {
    setShowSuccessModal(false);
    setSuccessCardData(null);
  };

  const handleSetSuccessCardAsDefault = (cardData) => {
    // Find and update the card that was just added
    setCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        isDefault: card.lastFour === cardData.lastFour
      }))
    );
  };

  const handleAddNewAddress = () => {
    console.log('Add new address clicked');
    // Add new address functionality here
  };

  const getCardIcon = (type) => {
    switch (type) {
      case 'VISA':
        return '💳';
      case 'MC':
        return '💳';
      default:
        return '💳';
    }
  };

  return (
    <div className="payment-methods">
      {/* Header Section */}
      <div className="payment-header">
        <h1 className="payment-title">Payment Methods</h1>
        <p className="payment-subtitle">
          Manage your saved cards and payment preferences for a faster, secure
          <br />checkout experience.
        </p>
      </div>

      {/* Main Content */}
      <div className="payment-content">
        {/* Left Section - Saved Cards */}
        <div className="cards-section">
          <h2 className="section-title">Saved Cards</h2>
          
          <div className="cards-list">
            {cards.map((card) => (
              <div key={card.id} className="card-item">
                <div className="card-main">
                  <div className="card-info">
                    <div className="card-type">
                      <span className="card-icon">{getCardIcon(card.type)}</span>
                      <span className="card-brand">{card.type}</span>
                    </div>
                    <div className="card-details">
                      <div className="card-number">•••• {card.lastFour}</div>
                      {card.isDefault && (
                        <span className="default-badge">DEFAULT</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-holder-info">
                    <div className="holder-name">{card.holderName}</div>
                    <div className="expiry-date">Expires {card.expiryDate}</div>
                  </div>
                </div>

                <div className="card-actions">
                  {!card.isDefault && (
                    <button 
                      className="set-default-btn"
                      onClick={() => handleSetAsDefault(card.id)}
                    >
                      Set as Default
                    </button>
                  )}
                  <button className="edit-card-btn">
                    <span className="edit-icon">✏️</span>
                  </button>
                  <button 
                    className="delete-card-btn"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <span className="delete-icon">🗑️</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Card Button */}
            <div className="add-card-item">
              <button className="add-card-btn" onClick={handleAddNewCard}>
                <span className="add-icon">+</span>
                <span className="add-text">Add New Card</span>
              </button>
            </div>
          </div>

          {/* Other Payment Options */}
          <div className="other-payment-section">
            <div className="section-header-small">
              <span className="options-icon">💳</span>
              <h3 className="options-title">OTHER PAYMENT OPTIONS</h3>
            </div>
            
            <div className="payment-options">
              <div className="payment-option">
                <div className="option-icon">🏦</div>
                <span className="option-name">Bank Transfer</span>
              </div>
              <div className="payment-option">
                <div className="option-icon">📱</div>
                <span className="option-name">Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Billing Address & Security */}
        <div className="sidebar-section">
          {/* Billing Address */}
          <div className="billing-address-section">
            <div className="billing-header">
              <div className="billing-title-group">
                <span className="location-icon">📍</span>
                <h3 className="billing-title">Billing Address</h3>
              </div>
              <button className="edit-address-btn">
                <span className="edit-icon">✏️</span>
              </button>
            </div>

            <div className="address-content">
              <div className="address-label">DEFAULT ADDRESS</div>
              
              <div className="address-details">
                <div className="address-name">{billingAddress.name}</div>
                <div className="address-line">{billingAddress.address}</div>
                <div className="address-city">
                  {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
                </div>
                <div className="address-country">{billingAddress.country}</div>
              </div>

              <div className="address-info">
                <div className="info-icon">ℹ️</div>
                <p className="info-text">
                  This address is used for card verification and tax calculation purposes.
                </p>
              </div>

              <button className="add-address-btn" onClick={handleAddNewAddress}>
                <span className="plus-icon">+</span>
                Add New Address
              </button>
            </div>
          </div>

          {/* Secure Checkout */}
          <div className="security-section">
            <div className="security-icon">🛡️</div>
            <h3 className="security-title">Secure Checkout</h3>
            <p className="security-text">
              Your payment information is encrypted and securely stored. We never share your details with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddNewCardModal
        isOpen={showAddCardModal}
        onClose={handleCloseAddCardModal}
        onSuccess={handleAddCardSuccess}
      />

      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        cardData={successCardData}
        onSetAsDefault={handleSetSuccessCardAsDefault}
        onBackToPaymentMethods={handleBackToPaymentMethods}
      />
    </div>
  );
};

export default PaymentMethods;