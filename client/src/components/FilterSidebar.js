import React from 'react';
import AdvancedFilterPanel from './AdvancedFilterPanel';
import './FilterSidebar.css';

function FilterSidebar({ filters, onFilterChange, selectedCategory, onCategoryChange, advancedFilters, onAdvancedFilterChange }) {
  const vehicleCategories = [
    { id: 'semi-trailer-trucks', name: 'Semi-Trailer Trucks', image: '/images/categories/semi-trailer-trucks.png', count: 40 },
    { id: 'trucks-over-7.5t', name: 'Trucks over 7.5t', image: '/images/categories/trucks-over-7.5t.png', count: 25 },
    { id: 'vans-up-to-7.5t', name: 'Vans/Trucks ≤ 7.5t', image: '/images/categories/vans.png', count: 20 },
    { id: 'construction', name: 'Construction Machines', image: '/images/categories/construction.png', count: 18 },
    { id: 'trailer', name: 'Trailers', image: '/images/categories/trailers.png', count: 15 },
    { id: 'agricultural', name: 'Agricultural Vehicles', image: '/images/categories/agricultural.png', count: 14 },
    { id: 'buses-coaches', name: 'Buses & Coaches', image: '/images/categories/buses.png', count: 12 },
    { id: 'semi-trailer', name: 'Semi-Trailers', image: '/images/categories/truck-tractors.png', count: 10 },
    { id: 'forklift', name: 'Forklifts', image: '/images/categories/forklifts.png', count: 10 }
  ];

  const popularMakes = [
    'Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault',
    'Iveco', 'Freightliner', 'Kenworth', 'Peterbilt', 'BMW', 'Audi',
    'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Nissan', 'Mazda',
    'Hyundai', 'Tesla', 'Porsche', 'Peugeot', 'Kia'
  ];

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1990; year--) {
    yearOptions.push(year);
  }

  const colors = [
    'Black', 'White', 'Silver', 'Gray', 'Blue', 'Red', 'Green',
    'Yellow', 'Orange', 'Brown', 'Gold', 'Purple', 'Pink'
  ];

  const fuelTypes = [
    'Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid',
    'CNG', 'LPG', 'Hydrogen'
  ];

  const transmissionTypes = [
    'Manual', 'Automatic', 'Semi-Automatic', 'CVT'
  ];

  const bodyTypes = [
    'Sedan', 'SUV', 'Hatchback', 'Station Wagon', 'Coupe',
    'Convertible', 'Pickup', 'Van', 'Truck', 'Bus'
  ];

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-sidebar">
      <div className="sidebar-header">
        <h2>🔍 Filter Results</h2>
        {selectedCategory && (
          <button
            className="reset-category-btn"
            onClick={() => onCategoryChange(null)}
            title="View all categories"
          >
            ← All Categories
          </button>
        )}
      </div>

      {/* Filters - Show when category selected */}
      {selectedCategory && (
        <>
          {/* Make Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">🏭</span>
              Make / Brand
            </label>
            <select
              className="filter-select"
              value={filters.make}
              onChange={(e) => handleChange('make', e.target.value)}
            >
              <option value="">All Makes</option>
              {popularMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>

          {/* Model Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">📋</span>
              Model
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Enter model..."
              value={filters.model}
              onChange={(e) => handleChange('model', e.target.value)}
            />
          </div>

          {/* Year Range */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">📅</span>
              First Registration
            </label>
            <div className="range-inputs">
              <select
                className="filter-select-small"
                value={filters.yearFrom}
                onChange={(e) => handleChange('yearFrom', e.target.value)}
              >
                <option value="">From</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="range-separator">—</span>
              <select
                className="filter-select-small"
                value={filters.yearTo}
                onChange={(e) => handleChange('yearTo', e.target.value)}
              >
                <option value="">To</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mileage Range */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">🛣️</span>
              Mileage (km)
            </label>
            <div className="range-inputs">
              <input
                type="number"
                className="filter-input-small"
                placeholder="From"
                value={filters.mileageFrom}
                onChange={(e) => handleChange('mileageFrom', e.target.value)}
              />
              <span className="range-separator">—</span>
              <input
                type="number"
                className="filter-input-small"
                placeholder="To"
                value={filters.mileageTo}
                onChange={(e) => handleChange('mileageTo', e.target.value)}
              />
            </div>
          </div>

          {/* Color Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">🎨</span>
              Color
            </label>
            <select
              className="filter-select"
              value={filters.color}
              onChange={(e) => handleChange('color', e.target.value)}
            >
              <option value="">All Colors</option>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>

          {/* Fuel Type Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">⛽</span>
              Fuel Type
            </label>
            <select
              className="filter-select"
              value={filters.fuelType}
              onChange={(e) => handleChange('fuelType', e.target.value)}
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map(fuel => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>

          {/* Transmission Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">⚙️</span>
              Transmission
            </label>
            <select
              className="filter-select"
              value={filters.transmission}
              onChange={(e) => handleChange('transmission', e.target.value)}
            >
              <option value="">All Transmissions</option>
              {transmissionTypes.map(transmission => (
                <option key={transmission} value={transmission}>{transmission}</option>
              ))}
            </select>
          </div>

          {/* Body Type Filter */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">🚗</span>
              Body Type
            </label>
            <select
              className="filter-select"
              value={filters.bodyType}
              onChange={(e) => handleChange('bodyType', e.target.value)}
            >
              <option value="">All Body Types</option>
              {bodyTypes.map(bodyType => (
                <option key={bodyType} value={bodyType}>{bodyType}</option>
              ))}
            </select>
          </div>

          {/* Price Type */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">💰</span>
              Price Type
            </label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="priceType"
                  value="gross"
                  checked={filters.priceType === 'gross'}
                  onChange={(e) => handleChange('priceType', e.target.value)}
                />
                <span>Gross</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="priceType"
                  value="net"
                  checked={filters.priceType === 'net'}
                  onChange={(e) => handleChange('priceType', e.target.value)}
                />
                <span>Net</span>
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">💵</span>
              Price (EUR)
            </label>
            <input
              type="number"
              className="filter-input"
              placeholder="Max price..."
              value={filters.priceTo}
              onChange={(e) => handleChange('priceTo', e.target.value)}
            />
          </div>

          {/* Location */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">📍</span>
              City or ZIP Code
            </label>
            <input
              type="text"
              className="filter-input"
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          {/* Advanced Filters */}
          <div className="advanced-filters-wrapper">
            <AdvancedFilterPanel
              advancedFilters={advancedFilters || {}}
              onAdvancedFilterChange={onAdvancedFilterChange}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="filter-actions">
            <button
              className="clear-filters-btn"
              onClick={() => onFilterChange({
                make: '', model: '', yearFrom: '', yearTo: '',
                mileageFrom: '', mileageTo: '', color: '', fuelType: '',
                transmission: '', bodyType: '', priceType: 'gross', 
                priceTo: '', location: ''
              })}
            >
              ✕ Clear All Filters
            </button>
          </div>
        </>
      )}

      {/* Footer Info */}
      <div className="sidebar-footer">
        <div className="info-badge">
          <span className="badge-icon">✓</span>
          <span>Verified Sellers</span>
        </div>
        <div className="info-badge">
          <span className="badge-icon">🔒</span>
          <span>Secure Platform</span>
        </div>
        <div className="info-badge">
          <span className="badge-icon">🌍</span>
          <span>Worldwide Shipping</span>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
