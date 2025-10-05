import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './MyListings.css';

function MyListings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, truckId: null, truckTitle: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyTrucks();
  }, [isAuthenticated, navigate]);

  const fetchMyTrucks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5001/api/my-trucks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrucks(response.data.trucks || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trucks:', error);
      setTrucks([]);
      setLoading(false);
    }
  };

  const handleDeleteClick = (truck) => {
    setDeleteModal({ show: true, truckId: truck.id, truckTitle: truck.title });
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/my-trucks/${deleteModal.truckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Refresh the list
      fetchMyTrucks();
      setDeleteModal({ show: false, truckId: null, truckTitle: '' });
    } catch (error) {
      console.error('Error deleting truck:', error);
      alert('Failed to delete listing. Please try again.');
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ show: false, truckId: null, truckTitle: '' });
  };

  if (loading) {
    return (
      <div className="my-listings-container">
        <div className="loading">Loading your listings...</div>
      </div>
    );
  }

  return (
    <div className="my-listings-container">
      <div className="listings-header">
        <div>
          <h1>My Listings</h1>
          <p className="listings-subtitle">
            {trucks.length} of {user?.listing_limit} listings used
          </p>
        </div>
        <Link to="/add-listing" className="btn btn-primary">
          ➕ Add New Listing
        </Link>
      </div>

      {trucks.length === 0 ? (
        <div className="empty-listings">
          <div className="empty-icon">📦</div>
          <h2>No listings yet</h2>
          <p>Start selling by adding your first truck listing</p>
          <Link to="/add-listing" className="btn btn-primary">Add Your First Truck</Link>
        </div>
      ) : (
        <div className="listings-grid">
          {trucks.map(truck => (
            <div key={truck.id} className="listing-card">
              <div className="listing-image">
                {truck.image_url ? (
                  <img src={truck.image_url} alt={truck.title} />
                ) : (
                  <div className="placeholder-listing-image">
                    <span className="truck-emoji">🚛</span>
                  </div>
                )}
                {truck.is_featured === 1 && (
                  <div className="featured-badge">⭐ Featured</div>
                )}
              </div>

              <div className="listing-content">
                <h3 className="listing-title">{truck.title}</h3>
                <div className="listing-details">
                  <div className="detail-row">
                    <span className="detail-label">Brand:</span>
                    <span className="detail-value">{truck.brand}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Model:</span>
                    <span className="detail-value">{truck.model}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{truck.year}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Mileage:</span>
                    <span className="detail-value">{truck.mileage?.toLocaleString()} km</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{truck.location}, {truck.country}</span>
                  </div>
                </div>

                <div className="listing-price">€{truck.price?.toLocaleString()}</div>

                <div className="listing-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👁️</span>
                    <span>{truck.views || 0} views</span>
                  </div>
                  <div className="stat-item">
                    <span className="status-indicator status-active"></span>
                    <span>Active</span>
                  </div>
                </div>

                <div className="listing-actions">
                  <Link to={`/truck/${truck.id}`} className="btn btn-view">
                    👁️ View
                  </Link>
                  <Link to={`/edit-listing/${truck.id}`} className="btn btn-edit">
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(truck)}
                    className="btn btn-delete"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Listing?</h2>
            <p>Are you sure you want to delete "{deleteModal.truckTitle}"?</p>
            <p className="warning-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade prompt if at limit */}
      {trucks.length >= user?.listing_limit && user?.tier !== 'professional' && (
        <div className="upgrade-banner">
          <div className="upgrade-banner-content">
            <h3>🚀 You've reached your listing limit!</h3>
            <p>Upgrade to {user?.tier === 'free' ? 'Premium or Professional' : 'Professional'} to list more trucks</p>
            <Link to="/subscription" className="btn btn-upgrade">Upgrade Now</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyListings;
