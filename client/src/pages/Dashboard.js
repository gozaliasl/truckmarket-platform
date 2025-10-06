import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [myTrucks, setMyTrucks] = useState([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    remainingSlots: 0,
    views: 0,
    inquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch user's trucks
      const trucksResponse = await axios.get('http://localhost:5001/api/my-trucks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // API returns { trucks: [], total: number }
      const trucks = trucksResponse.data.trucks || [];
      setMyTrucks(trucks);

      // Calculate stats
      const totalListings = trucks.length;
      const remainingSlots = user.listing_limit - totalListings;

      setStats({
        totalListings,
        remainingSlots,
        views: Math.floor(Math.random() * 500), // Demo data
        inquiries: Math.floor(Math.random() * 50) // Demo data
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMyTrucks([]);
      setLoading(false);
    }
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'professional': return '#10b981';
      case 'premium': return '#2563eb';
      default: return '#6b7280';
    }
  };

  const getTierName = (tier) => {
    if (!tier) return 'Free';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="welcome-text">Welcome back, {user?.name}!</p>
        </div>
        <div className="tier-badge-dashboard" style={{ background: getTierColor(user?.tier) }}>
          {getTierName(user?.tier)} Account
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Total Listings</div>
            <div className="stat-value">{stats.totalListings}</div>
            <div className="stat-sublabel">of {user?.listing_limit} allowed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <div className="stat-label">Remaining Slots</div>
            <div className="stat-value">{stats.remainingSlots}</div>
            <div className="stat-sublabel">
              {stats.remainingSlots === 0 ? 'Upgrade to add more' : 'available'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <div className="stat-label">Total Views</div>
            <div className="stat-value">{stats.views}</div>
            <div className="stat-sublabel">this month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✉️</div>
          <div className="stat-content">
            <div className="stat-label">Inquiries</div>
            <div className="stat-value">{stats.inquiries}</div>
            <div className="stat-sublabel">this month</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <Link to="/add-listing" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add New Listing</h3>
            <p>List a new truck for sale</p>
          </Link>

          <Link to="/my-listings" className="action-card">
            <div className="action-icon">🚛</div>
            <h3>My Listings</h3>
            <p>View and manage your trucks</p>
          </Link>

          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <h3>Edit Profile</h3>
            <p>Update your information</p>
          </Link>

          <Link to="/subscription" className="action-card">
            <div className="action-icon">💳</div>
            <h3>Subscription</h3>
            <p>Manage your plan</p>
          </Link>
        </div>
      </div>

      {/* Recent Listings */}
      <div className="recent-listings">
        <div className="section-header">
          <h2>Your Recent Listings</h2>
          <Link to="/my-listings" className="view-all-link">View All →</Link>
        </div>

        {myTrucks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No listings yet</h3>
            <p>Start by adding your first truck listing</p>
            <Link to="/add-listing" className="btn-primary">Add Your First Truck</Link>
          </div>
        ) : (
          <div className="listings-table">
            <table>
              <thead>
                <tr>
                  <th>Truck</th>
                  <th>Brand</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myTrucks.slice(0, 5).map(truck => (
                  <tr key={truck.id}>
                    <td>
                      <div className="truck-cell">
                        <div className="truck-image-small">
                          {truck.image_url ? (
                            <img src={truck.image_url} alt={truck.title} />
                          ) : (
                            <div className="placeholder-image">🚛</div>
                          )}
                        </div>
                        <div className="truck-info">
                          <div className="truck-title">{truck.title}</div>
                          <div className="truck-subtitle">{truck.model}</div>
                        </div>
                      </div>
                    </td>
                    <td>{truck.brand}</td>
                    <td>{truck.year}</td>
                    <td>€{truck.price?.toLocaleString()}</td>
                    <td>
                      <span className="status-badge status-active">Active</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/truck/${truck.id}`} className="btn-view">View</Link>
                        <Link to={`/edit-listing/${truck.id}`} className="btn-edit">Edit</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade Prompt for Free Users */}
      {user?.tier === 'free' && (
        <div className="upgrade-prompt">
          <div className="upgrade-content">
            <h3>🚀 Unlock More Features</h3>
            <p>Upgrade to Premium or Professional to list more trucks and access advanced features</p>
            <Link to="/subscription" className="btn-upgrade">View Plans</Link>
          </div>
        </div>
      )}

      {/* Professional Dealer Page Link */}
      {user?.tier === 'professional' && user?.subdomain && (
        <div className="dealer-page-section">
          <h3>Your Dealer Page</h3>
          <div className="dealer-url">
            <span className="url-label">Your custom page:</span>
            <a href={`http://localhost:3000/dealer/${user.subdomain}`}
               target="_blank"
               rel="noopener noreferrer"
               className="dealer-link">
              truckmarket.com/dealer/{user.subdomain}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
