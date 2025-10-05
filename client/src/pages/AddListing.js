import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './AddListing.css';

function AddListing() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
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
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // For now, we'll use image URLs. In production, you'd upload to a server
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result]);
        if (uploadedImages.length === 0 && !formData.image_url) {
          setFormData({ ...formData, image_url: reader.result });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (index === 0 && newImages.length > 0) {
      setFormData({ ...formData, image_url: newImages[0] });
    } else if (newImages.length === 0) {
      setFormData({ ...formData, image_url: '' });
    }
  };

  const handleAIExtraction = async () => {
    if (!formData.title && !formData.description) {
      alert('Please enter a title or description for AI to extract information from');
      return;
    }

    setAiProcessing(true);

    // Simulate AI processing (in production, this would call an AI API)
    setTimeout(() => {
      const text = (formData.title + ' ' + formData.description).toLowerCase();

      // Simple pattern matching for demo purposes
      let extracted = { ...formData };

      // Extract brand
      brands.forEach(brand => {
        if (text.includes(brand.toLowerCase())) {
          extracted.brand = brand;
        }
      });

      // Extract year
      const yearMatch = text.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        extracted.year = parseInt(yearMatch[0]);
      }

      // Extract mileage
      const mileageMatch = text.match(/(\d+)\s*(km|kilometer|miles)/i);
      if (mileageMatch) {
        extracted.mileage = parseInt(mileageMatch[1]);
      }

      // Extract transmission
      if (text.includes('automatic')) extracted.transmission = 'Automatic';
      if (text.includes('manual')) extracted.transmission = 'Manual';

      // Extract fuel type
      if (text.includes('electric')) extracted.fuel_type = 'Electric';
      if (text.includes('hybrid')) extracted.fuel_type = 'Hybrid';
      if (text.includes('diesel')) extracted.fuel_type = 'Diesel';

      // Extract condition
      if (text.includes('new') || text.includes('brand new')) extracted.condition = 'New';
      if (text.includes('like new')) extracted.condition = 'Like New';

      // Extract axle configuration
      axleConfigs.forEach(config => {
        if (text.includes(config)) {
          extracted.axle_configuration = config;
        }
      });

      setFormData(extracted);
      setAiProcessing(false);
      alert('✨ AI extraction complete! Please review and fill in any missing information.');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Add seller information
      const truckData = {
        ...formData,
        seller_name: user.name,
        seller_email: user.email,
        seller_phone: user.phone || null,
        user_id: user.id
      };

      await axios.post('http://localhost:5001/api/my-trucks', truckData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Truck listing created successfully!');
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error.response?.data?.error) {
        alert('Error: ' + error.response.data.error);
      } else {
        alert('Failed to create listing. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="add-listing-container">
      <div className="add-listing-header">
        <h1>Add New Truck Listing</h1>
        <p>Fill in the details below to list your truck for sale</p>
      </div>

      <form onSubmit={handleSubmit} className="add-listing-form">
        {/* AI Extraction Section */}
        <div className="form-section ai-section">
          <div className="section-header">
            <h2>🤖 AI-Powered Extraction</h2>
            <button
              type="button"
              onClick={handleAIExtraction}
              className="btn btn-ai"
              disabled={aiProcessing}
            >
              {aiProcessing ? '⏳ Processing...' : '✨ Extract Info with AI'}
            </button>
          </div>
          <p className="section-description">
            Enter a title or description, then click "Extract Info with AI" to automatically fill truck specifications
          </p>
        </div>

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
              placeholder="e.g., Mercedes-Benz Actros 1851 LS - Like New"
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
                placeholder="e.g., Actros 1851"
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
                placeholder="e.g., 85000"
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
                placeholder="e.g., 150000"
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
                placeholder="e.g., 510"
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
              placeholder="e.g., White"
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
                placeholder="e.g., Hamburg"
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
                placeholder="e.g., Germany"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="form-section">
          <h2>Images & Videos</h2>

          <div className="form-group">
            <label htmlFor="image_url">Main Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/truck-image.jpg"
            />
            <p className="field-hint">Or upload images below</p>
          </div>

          <div className="form-group">
            <label>Upload Images</label>
            <div className="upload-area">
              <input
                type="file"
                id="image-upload"
                accept="image/*,video/*"
                multiple
                onChange={handleImageUpload}
                className="file-input"
              />
              <label htmlFor="image-upload" className="upload-label">
                <span className="upload-icon">📁</span>
                <span className="upload-text">Click to upload images or videos</span>
                <span className="upload-hint">Supports: JPG, PNG, MP4, MOV</span>
              </label>
            </div>

            {uploadedImages.length > 0 && (
              <div className="uploaded-images">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="uploaded-image">
                    <img src={img} alt={`Upload ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="remove-image"
                    >
                      ×
                    </button>
                    {index === 0 && <div className="main-badge">Main</div>}
                  </div>
                ))}
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
              placeholder="Describe the truck's condition, features, service history, etc."
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
            disabled={loading}
          >
            {loading ? 'Creating Listing...' : '✅ Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddListing;
