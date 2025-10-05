import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [tiers, setTiers] = useState({});
  const [selectedTier, setSelectedTier] = useState('free');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    company_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    fetchTiers();
  }, [isAuthenticated, navigate]);

  const fetchTiers = async () => {
    try {
      const response = await axios.get('/api/tiers');
      setTiers(response.data);
    } catch (error) {
      console.error('Error fetching tiers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if ((selectedTier === 'premium' || selectedTier === 'professional') && !formData.company_name) {
      setError('Company name is required for Premium and Professional tiers');
      return;
    }

    setLoading(true);

    const result = await register({
      ...formData,
      tier: selectedTier
    });

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'free':
        return '🆓';
      case 'premium':
        return '⭐';
      case 'professional':
        return '👑';
      default:
        return '';
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Your Account</h1>
          <p>Choose a plan and start selling trucks today</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="tier-selection">
          <h2>Select Your Plan</h2>
          <div className="tier-cards">
            {Object.entries(tiers).map(([key, tier]) => (
              <div
                key={key}
                className={`tier-card ${selectedTier === key ? 'selected' : ''}`}
                onClick={() => setSelectedTier(key)}
              >
                <div className="tier-icon">{getTierIcon(key)}</div>
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div className="tier-price">
                  {tier.price === 0 ? 'Free' : `$${tier.price}/mo`}
                </div>
                <div className="tier-limit">{tier.listing_limit} Listings</div>
                <ul className="tier-features">
                  {tier.features.map((feature, idx) => (
                    <li key={idx}>{feature.replace(/_/g, ' ')}</li>
                  ))}
                </ul>
                {selectedTier === key && <div className="tier-selected-badge">✓ Selected</div>}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <h2>Account Information</h2>

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {(selectedTier === 'premium' || selectedTier === 'professional') && (
            <div className="form-group">
              <label htmlFor="company_name">
                Company Name * {selectedTier === 'professional' && '(Used for your custom page URL)'}
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
              {selectedTier === 'professional' && formData.company_name && (
                <small className="subdomain-preview">
                  Your page will be: /dealer/{formData.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                </small>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-primary register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
