import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import AdvancedFilters from '../components/AdvancedFilters';
import TruckCard from '../components/TruckCard';
import './HomeNew.css';

function HomeNew() {
  const navigate = useNavigate();
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
        brand: filters.make,
        model: filters.model,
        minYear: filters.yearFrom,
        maxYear: filters.yearTo,
        maxMileage: filters.mileageTo,
        maxPrice: filters.priceTo,
        location: filters.location
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'Any' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get('http://localhost:5001/api/trucks', { params });
      setVehicles(response.data.trucks || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
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
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTruckClick = (truckId) => {
    navigate(`/truck/${truckId}`);
  };

  return (
    <div className="home-layout">
      {/* Left Sidebar with Filters */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        {!selectedCategory ? (
          // Welcome/Hero Section when no category selected
          <div className="welcome-section">
            <div className="welcome-hero">
              <h1>Welcome to TruckMarket</h1>
              <p>Find your perfect commercial vehicle from thousands of listings worldwide</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">2,031</div>
                  <div className="stat-label">Active Listings</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1,450+</div>
                  <div className="stat-label">Verified Sellers</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">45</div>
                  <div className="stat-label">Countries</div>
                </div>
              </div>
            </div>
            <div className="welcome-info">
              <h2>👈 Select a category to start browsing</h2>
              <p>Choose from 9 vehicle categories including trucks, trailers, buses, construction machines, and more.</p>
            </div>
          </div>
        ) : (
          // Listings Section when category selected
          <>
            <div className="listings-header">
              <div className="header-title">
                <h1>{selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
                <p className="listing-count">{loading ? 'Loading...' : `${vehicles.length} vehicles available`}</p>
              </div>
              <div className="header-actions">
                <select className="sort-select">
                  <option>Sort by: Recent</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Year: Newest</option>
                  <option>Year: Oldest</option>
                  <option>Mileage: Low to High</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loader-spinner"></div>
                <p>Loading vehicles...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <h2>No vehicles found</h2>
                <p>Try adjusting your filters or browse all categories</p>
                <button
                  className="reset-btn"
                  onClick={() => handleFilterChange({
                    make: '', model: '', yearFrom: '', yearTo: '',
                    mileageTo: '', priceType: 'gross', priceTo: '', location: ''
                  })}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="vehicles-list">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} onClick={() => handleTruckClick(vehicle.id)}>
                    <TruckCard truck={vehicle} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomeNew;
