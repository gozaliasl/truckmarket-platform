import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Subscription.css';

function Subscription() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const plans = {
    free: {
      name: 'Free',
      listings: 5,
      price: { 1: 0, 3: 0, 6: 0, 12: 0 },
      features: [
        'Basic truck listings',
        'Search functionality',
        'Contact form',
        'Community support'
      ],
      color: '#6b7280'
    },
    premium: {
      name: 'Premium',
      listings: 25,
      price: { 1: 29.99, 3: 80.97, 6: 149.94, 12: 239.88 },
      savings: { 1: 0, 3: 10, 6: 17, 12: 33 },
      features: [
        'All Free features',
        'Up to 25 listings',
        'Featured listings (3)',
        'Priority support',
        'Analytics dashboard',
        'Email notifications'
      ],
      color: '#2563eb'
    },
    professional: {
      name: 'Professional',
      listings: 'Unlimited',
      price: { 1: 99.99, 3: 269.97, 6: 479.94, 12: 719.88 },
      savings: { 1: 0, 3: 10, 6: 20, 12: 40 },
      features: [
        'All Premium features',
        'Unlimited listings',
        'Custom dealer page',
        'Subdomain (yourname.truckmarket.com)',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Advanced analytics'
      ],
      color: '#10b981'
    }
  };

  const durations = [
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months', discount: '10% OFF' },
    { value: '6', label: '6 Months', discount: 'Save 20%' },
    { value: '12', label: '12 Months', discount: 'Best Value' }
  ];

  const handleCardChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limit CVV
    if (name === 'cvv' && value.length > 3) return;

    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handleSelectPlan = (planKey) => {
    setSelectedPlan(planKey);
    setShowPaymentModal(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowPaymentModal(false);

      const plan = plans[selectedPlan];
      const price = plan.price[selectedDuration];

      if (price === 0) {
        alert(`✅ Free plan activated! Card saved for verification.`);
      } else {
        alert(`✅ Payment successful! ${plan.name} plan activated for ${selectedDuration} month(s). Total: €${price}`);
      }

      // In production, you would update the user's tier in the database here
      window.location.reload();
    }, 2000);
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const getPriceDisplay = (planKey) => {
    const plan = plans[planKey];
    const price = plan.price[selectedDuration];
    const duration = parseInt(selectedDuration);

    if (price === 0) return 'Free';

    const monthly = price / duration;
    return (
      <div>
        <div className="price-amount">€{monthly.toFixed(2)}<span className="price-period">/month</span></div>
        {duration > 1 && (
          <div className="price-total">€{price.toFixed(2)} billed {duration === 3 ? 'quarterly' : duration === 6 ? 'semi-annually' : 'annually'}</div>
        )}
      </div>
    );
  };

  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your truck selling business</p>

        {user?.tier && (
          <div className="current-plan-badge">
            Current Plan: <span className="plan-name">{plans[user.tier].name}</span>
          </div>
        )}
      </div>

      {/* Duration Selector */}
      <div className="duration-selector">
        <p className="duration-label">Select billing period:</p>
        <div className="duration-buttons">
          {durations.map(duration => (
            <button
              key={duration.value}
              className={`duration-btn ${selectedDuration === duration.value ? 'active' : ''}`}
              onClick={() => setSelectedDuration(duration.value)}
            >
              <span className="duration-name">{duration.label}</span>
              {duration.discount && <span className="duration-discount">{duration.discount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="plans-grid">
        {Object.entries(plans).map(([key, plan]) => (
          <div
            key={key}
            className={`plan-card ${user?.tier === key ? 'current' : ''}`}
            style={{ borderColor: plan.color }}
          >
            {user?.tier === key && (
              <div className="current-badge" style={{ background: plan.color }}>
                Current Plan
              </div>
            )}

            <div className="plan-header">
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-listings">{plan.listings} listings</div>
            </div>

            <div className="plan-price">
              {getPriceDisplay(key)}
              {plan.savings && plan.savings[selectedDuration] > 0 && (
                <div className="savings-badge">Save {plan.savings[selectedDuration]}%</div>
              )}
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="btn btn-plan"
              style={{
                background: user?.tier === key ? '#9ca3af' : plan.color,
                cursor: user?.tier === key ? 'not-allowed' : 'pointer'
              }}
              onClick={() => user?.tier !== key && handleSelectPlan(key)}
              disabled={user?.tier === key}
            >
              {user?.tier === key ? 'Current Plan' : key === 'free' ? 'Downgrade' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>

            <h2>Complete Your Purchase</h2>
            <div className="purchase-summary">
              <div className="summary-row">
                <span>Plan:</span>
                <strong>{plans[selectedPlan].name}</strong>
              </div>
              <div className="summary-row">
                <span>Duration:</span>
                <strong>{selectedDuration} month{selectedDuration > 1 ? 's' : ''}</strong>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <strong>€{plans[selectedPlan].price[selectedDuration].toFixed(2)}</strong>
              </div>
            </div>

            <form onSubmit={handlePayment} className="payment-form">
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={cardInfo.cardName}
                  onChange={handleCardChange}
                  required
                  placeholder="John Smith"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={cardInfo.cardNumber}
                  onChange={handleCardChange}
                  required
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardInfo.expiryDate}
                    onChange={handleCardChange}
                    required
                    placeholder="MM/YY"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardChange}
                    required
                    placeholder="123"
                  />
                </div>
              </div>

              {plans[selectedPlan].price[selectedDuration] === 0 && (
                <div className="free-notice">
                  <p>💳 Card required for verification. You won't be charged.</p>
                </div>
              )}

              <div className="payment-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? '⏳ Processing...' : `Pay €${plans[selectedPlan].price[selectedDuration].toFixed(2)}`}
                </button>
              </div>

              <div className="secure-notice">
                <span className="lock-icon">🔒</span>
                Secure payment powered by Stripe
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I change my plan anytime?</h3>
            <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards (Visa, Mastercard, American Express) via Stripe.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a long-term contract?</h3>
            <p>No contracts. Cancel anytime. If you prepaid for multiple months, you'll receive a prorated refund.</p>
          </div>
          <div className="faq-item">
            <h3>What happens to my listings if I downgrade?</h3>
            <p>Your existing listings remain active, but you won't be able to add new ones if you exceed the limit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
