import React from 'react';
import './FilterSidebar.css';

// SVG Icon Components
const TruckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="18" width="20" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M26 18h8l6 6v8h-4" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="36" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 36h21M6 24h14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SemiTruckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 20h14v12H4z" stroke="currentColor" strokeWidth="2"/>
    <path d="M18 14h8l4 6v12h-12V14z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="10" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="36" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M13 36h8m6 0h6M30 20h10v12h-4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const VanIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="16" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="38" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="38" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M19 38h10M8 22h28M8 28h8" stroke="currentColor" strokeWidth="2"/>
    <rect x="24" y="18" width="8" height="6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const TrailerIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14" width="32" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
    <circle cx="14" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="26" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="38" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M17 36h6m6 0h6M8 20h32M8 26h12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const BusIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="12" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="18" cy="40" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="30" cy="40" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 20h28M10 28h28M18 14v12M30 14v12" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="32" width="20" height="2" fill="currentColor"/>
  </svg>
);

const TractorIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 18h12v8H12z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="14" cy="34" r="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="36" r="7" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 22h8v8l-4 4" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 12h4v6h-4z" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ConstructionIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 36h32M12 36V24l8-8h8" stroke="currentColor" strokeWidth="2"/>
    <circle cx="32" cy="36" r="4" stroke="currentColor" strokeWidth="2"/>
    <circle cx="14" cy="36" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 12l4-4 8 8-4 4-8-8zM24 12l-4 4" stroke="currentColor" strokeWidth="2"/>
    <rect x="20" y="24" width="8" height="6" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ForkliftIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 36h16v-20l-8-4H12v24z" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="40" r="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="24" cy="40" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M28 36V8h4v28M32 12h8M32 20h6" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="20" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ContainerIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="16" width="36" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 22h36M6 28h36M12 16v18M18 16v18M24 16v18M30 16v18M36 16v18" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="38" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="38" cy="38" r="2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

function FilterSidebar({ filters, onFilterChange, selectedCategory, onCategoryChange }) {
  const vehicleCategories = [
    { id: 'semi-trailer-trucks', name: 'Semi-Trailer Trucks', Icon: SemiTruckIcon, count: 40 },
    { id: 'trucks-over-7.5t', name: 'Trucks over 7.5t', Icon: TruckIcon, count: 25 },
    { id: 'vans-up-to-7.5t', name: 'Vans/Trucks ≤ 7.5t', Icon: VanIcon, count: 20 },
    { id: 'construction', name: 'Construction Machines', Icon: ConstructionIcon, count: 18 },
    { id: 'trailer', name: 'Trailers', Icon: TrailerIcon, count: 15 },
    { id: 'agricultural', name: 'Agricultural Vehicles', Icon: TractorIcon, count: 14 },
    { id: 'buses-coaches', name: 'Buses & Coaches', Icon: BusIcon, count: 12 },
    { id: 'semi-trailer', name: 'Semi-Trailers', Icon: ContainerIcon, count: 10 },
    { id: 'forklift', name: 'Forklifts', Icon: ForkliftIcon, count: 10 }
  ];

  const popularMakes = [
    'Mercedes-Benz', 'MAN', 'Scania', 'Volvo', 'DAF', 'Renault',
    'Iveco', 'Freightliner', 'Kenworth', 'Peterbilt'
  ];

  const yearOptions = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1990; year--) {
    yearOptions.push(year);
  }

  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-sidebar">
      <div className="sidebar-header">
        <h2>🔍 Find Your Vehicle</h2>
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

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="filter-section categories-section">
          <h3>Vehicle Categories</h3>
          <div className="category-list">
            {vehicleCategories.map(cat => (
              <button
                key={cat.id}
                className="category-item"
                onClick={() => onCategoryChange(cat.id)}
              >
                <div className="category-icon-svg">
                  <cat.Icon />
                </div>
                <div className="category-info">
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count} ads</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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

          {/* Mileage */}
          <div className="filter-section">
            <label className="filter-label">
              <span className="label-icon">🛣️</span>
              Mileage (km)
            </label>
            <input
              type="number"
              className="filter-input"
              placeholder="Max mileage..."
              value={filters.mileageTo}
              onChange={(e) => handleChange('mileageTo', e.target.value)}
            />
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

          {/* Clear Filters Button */}
          <div className="filter-actions">
            <button
              className="clear-filters-btn"
              onClick={() => onFilterChange({
                make: '', model: '', yearFrom: '', yearTo: '',
                mileageTo: '', priceType: 'gross', priceTo: '', location: ''
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
