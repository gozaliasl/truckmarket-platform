import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AddListing.css'; // Reuse the same styles

function EditListing() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    currency: 'EUR',
    mileage: '',
    condition: 'Used',
    location: '',
    country: '',
    category: 'Tractor Unit',
    engine_power: '',
    transmission: 'Manual',
    fuel_type: 'Diesel',
    axle_configuration: '4x2',
    color: '',
    description: '',
    image_url: ''
  });

  const brands = ['Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco', 'Renault', 'Isuzu', 'Hino', 'Freightliner', 'Mack', 'Peterbilt', 'Kenworth'];
  const categories = ['Tractor Unit', 'Box Truck', 'Dump Truck', 'Refrigerated Truck', 'Flatbed Truck', 'Tanker', 'Concrete Mixer', 'Tow Truck', 'Pickup Truck'];
  const fuelTypes = ['Diesel', 'Electric', 'Hybrid', 'CNG', 'LNG'];
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic'];
  const axleConfigs = ['4x2', '4x4', '6x2', '6x4', '6x6', '8x4'];
  const conditions = ['New', 'Used', 'Like New', 'For Parts'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTruckData();
  }, [id, isAuthenticated, navigate]);

  const fetchTruckData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/my-trucks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        setFormData({
          title: response.data.title || '',
          brand: response.data.brand || '',
          model: response.data.model || '',
          year: response.data.year || new Date().getFullYear(),
          price: response.data.price || '',
          currency: response.data.currency || 'EUR',
          mileage: response.data.mileage || '',
          condition: response.data.condition || 'Used',
          location: response.data.location || '',
          country: response.data.country || '',
          category: response.data.category || 'Tractor Unit',
          engine_power: response.data.engine_power || '',
          transmission: response.data.transmission || 'Manual',
          fuel_type: response.data.fuel_type || 'Diesel',
          axle_configuration: response.data.axle_configuration || '4x2',
          color: response.data.color || '',
          description: response.data.description || '',
          image_url: response.data.image_url || ''
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching truck:', error);
      alert('Failed to load truck data');
      navigate('/my-listings');
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
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5001/api/my-trucks/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Truck listing updated successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-listing-container">
        <div className="loading">Loading truck data...</div>
      </div>
    );
  }

  return (
    <div className="add-listing-container">
      <div className="add-listing-header">
        <h1>Edit Truck Listing</h1>
        <p>Update your truck's information</p>
      </div>

      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Listing Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="model">Model *</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Year *</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="form-group">
              <label htmlFor="condition">Condition *</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                {conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="form-section">
          <h2>Technical Specifications</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mileage">Mileage (km) *</label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="engine_power">Engine Power (HP)</label>
              <input
                type="number"
                id="engine_power"
                name="engine_power"
                value={formData.engine_power}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="fuel_type">Fuel Type *</label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
              >
                {fuelTypes.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="transmission">Transmission *</label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                required
              >
                {transmissions.map(trans => (
                  <option key={trans} value={trans}>{trans}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="axle_configuration">Axle Configuration</label>
              <select
                id="axle_configuration"
                name="axle_configuration"
                value={formData.axle_configuration}
                onChange={handleChange}
              >
                {axleConfigs.map(config => (
                  <option key={config} value={config}>{config}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-section">
          <h2>Location</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">City *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2>Image</h2>

          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
            />
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Truck preview" />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="form-section">
          <h2>Description</h2>

          <div className="form-group">
            <label htmlFor="description">Truck Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : '✅ Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditListing;
