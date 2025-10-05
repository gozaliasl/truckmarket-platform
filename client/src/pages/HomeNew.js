import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TruckCard from '../components/TruckCard';
import './HomeNew.css';

function HomeNew() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    mileageTo: '',
    priceType: 'gross',
    priceTo: '',
    location: ''
  });

  const vehicleCategories = [
    {
      id: 'trucks-over-7.5t',
      name: 'Trucks over 7.5 t',
      icon: '🚛',
      description: 'Heavy duty trucks and lorries'
    },
    {
      id: 'trailer',
      name: 'Trailer',
      icon: '🚜',
      description: 'All types of trailers'
    },
    {
      id: 'vans-up-to-7.5t',
      name: 'Vans/Trucks up to 7.5 t',
      icon: '🚐',
      description: 'Light commercial vehicles'
    },
    {
      id: 'semi-trailer-trucks',
      name: 'Semi-Trailer Trucks',
      icon: '🚚',
      description: 'Tractor units for semi-trailers'
    },
    {
      id: 'semi-trailer',
      name: 'Semi-trailer',
      icon: '🚛',
      description: 'Semi-trailers and platforms'
    },
    {
      id: 'buses-coaches',
      name: 'Buses and Coaches',
      icon: '🚌',
      description: 'Passenger transport vehicles'
    },
    {
      id: 'agricultural',
      name: 'Agricultural Vehicles',
      icon: '🚜',
      description: 'Tractors and farming equipment'
    },
    {
      id: 'construction',
      name: 'Construction Machines',
      icon: '🏗️',
      description: 'Excavators, loaders, etc.'
    },
    {
      id: 'forklift',
      name: 'Forklift Trucks',
      icon: '⚙️',
      description: 'Industrial forklifts'
    }
  ];

  const makes = [
    'Any', 'Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'DAF', 'Iveco',
    'Renault', 'Isuzu', 'Hino', 'Freightliner', 'Mack', 'Peterbilt', 'Kenworth'
  ];

  const years = ['Any'];
  for (let year = new Date().getFullYear(); year >= 1990; year--) {
    years.push(year.toString());
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchVehicles();
    }
  }, [selectedCategory, filters]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'Any') {
          delete params[key];
        }
      });

      const response = await axios.get('/api/trucks', { params });
      setVehicles(response.data.trucks || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilters({
      make: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      mileageTo: '',
      priceType: 'gross',
      priceTo: '',
      location: ''
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    fetchVehicles();
  };

  const handleReset = () => {
    setFilters({
      make: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      mileageTo: '',
      priceType: 'gross',
      priceTo: '',
      location: ''
    });
  };

  if (!selectedCategory) {
    return (
      <div className="home-new-container">
        <div className="hero-section">
          <h1 className="hero-title">Find Your Perfect Commercial Vehicle</h1>
          <p className="hero-subtitle">Browse thousands of trucks, trailers, and commercial vehicles</p>
        </div>

        <div className="category-selection">
          <h2 className="category-heading">What are you looking for?</h2>
          <div className="category-grid">
            {vehicleCategories.map(category => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const selectedCategoryData = vehicleCategories.find(c => c.id === selectedCategory);

  return (
    <div className="home-new-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button onClick={() => setSelectedCategory(null)} className="breadcrumb-link">
          ← Back to Categories
        </button>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{selectedCategoryData?.name}</span>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-header">
          <h2>
            <span className="filter-icon">{selectedCategoryData?.icon}</span>
            {selectedCategoryData?.name}
          </h2>
        </div>

        <div className="filter-form">
          <div className="filter-row">
            <div className="filter-group">
              <label>Make</label>
              <select
                value={filters.make}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              >
                {makes.map(make => (
                  <option key={make} value={make === 'Any' ? '' : make}>{make}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Model</label>
              <input
                type="text"
                placeholder="Any"
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>1st Registration from</label>
              <select
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
              >
                {years.map(year => (
                  <option key={`from-${year}`} value={year === 'Any' ? '' : year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>To</label>
              <select
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
              >
                {years.map(year => (
                  <option key={`to-${year}`} value={year === 'Any' ? '' : year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Mileage up to (km)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.mileageTo}
                onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Price type</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="gross"
                    checked={filters.priceType === 'gross'}
                    onChange={(e) => handleFilterChange('priceType', e.target.value)}
                  />
                  Gross
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="net"
                    checked={filters.priceType === 'net'}
                    onChange={(e) => handleFilterChange('priceType', e.target.value)}
                  />
                  Net
                </label>
              </div>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Price up to (€)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.priceTo}
                onChange={(e) => handleFilterChange('priceTo', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>City or ZIP code</label>
              <input
                type="text"
                placeholder="Enter location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleReset} className="btn-reset">
              Reset Filters
            </button>
            <button onClick={handleSearch} className="btn-search">
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-header">
          <h3>
            {loading ? 'Loading...' : `${vehicles.length} vehicles found`}
          </h3>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading vehicles...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button onClick={handleReset} className="btn-primary">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="vehicles-grid">
            {vehicles.map(vehicle => (
              <TruckCard key={vehicle.id} truck={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeNew;
