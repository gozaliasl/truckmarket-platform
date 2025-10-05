import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company_name: '',
    website: '',
    address: '',
    city: '',
    country: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        company_name: user.company_name || '',
        website: user.website || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        description: user.description || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setMessage('Profile updated successfully!');
      setEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error updating profile: ' + result.error);
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="tier-info">
            <span className="tier-badge-large">{user.tier?.toUpperCase()}</span>
            <span className="listing-info">
              {user.listing_limit === 999 ? 'Unlimited' : user.listing_limit} Listings Available
            </span>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2>{user.name}</h2>
              <p className="email">{user.email}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-label">Member Since</span>
                  <span className="stat-value">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Account Status</span>
                  <span className="stat-value status-active">Active</span>
                </div>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-primary full-width"
              >
                {editing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            <div className="quick-links">
              <h3>Quick Links</h3>
              <a href="/dashboard" className="quick-link">📊 Dashboard</a>
              <a href="/my-listings" className="quick-link">🚛 My Listings</a>
              <a href="/add-listing" className="quick-link">➕ Add New Truck</a>
              <a href="/subscription" className="quick-link">💳 Subscription</a>
            </div>
          </div>

          <div className="profile-content">
            <form onSubmit={handleSubmit} className="profile-form">
              <h3>Personal Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              {(user.tier === 'premium' || user.tier === 'professional') && (
                <>
                  <h3>Business Information</h3>

                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>

                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Company Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="4"
                      placeholder="Tell customers about your business..."
                    ></textarea>
                  </div>
                </>
              )}

              {user.tier === 'professional' && user.subdomain && (
                <div className="dealer-page-info">
                  <h3>Your Dealer Page</h3>
                  <p>Your custom dealer page is available at:</p>
                  <a
                    href={`/dealer/${user.subdomain}`}
                    className="dealer-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    truckmarket.com/dealer/{user.subdomain}
                  </a>
                  <p className="hint">Share this link with your customers!</p>
                </div>
              )}

              {editing && (
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              )}
            </form>

            <div className="tier-upgrade">
              <h3>Upgrade Your Account</h3>
              {user.tier === 'free' && (
                <div className="upgrade-card">
                  <h4>🚀 Upgrade to Premium or Professional</h4>
                  <p>Get more listings, featured ads, and advanced features!</p>
                  <a href="/subscription" className="btn btn-primary">
                    View Plans
                  </a>
                </div>
              )}
              {user.tier === 'premium' && (
                <div className="upgrade-card">
                  <h4>👑 Upgrade to Professional</h4>
                  <p>Get unlimited listings and your own custom dealer page!</p>
                  <a href="/subscription" className="btn btn-primary">
                    Upgrade Now
                  </a>
                </div>
              )}
              {user.tier === 'professional' && (
                <div className="upgrade-card professional">
                  <h4>✨ You're on the Professional Plan!</h4>
                  <p>You have access to all premium features.</p>
                  <a href="/subscription" className="btn btn-secondary">
                    Manage Subscription
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
