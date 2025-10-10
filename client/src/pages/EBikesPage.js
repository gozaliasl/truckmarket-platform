import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarsPage.css';

function EBikesPage() {
  const navigate = useNavigate();
  const [ebikes, setEbikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    type: '',
    condition: ''
  });

  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25);
  const [totalResults, setTotalResults] = useState(0);

  const fetchEbikes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        brand: filters.brand,
        model: filters.model,
        minYear: filters.yearFrom,
        maxYear: filters.yearTo,
        minPrice: filters.priceFrom,
        maxPrice: filters.priceTo,
        type: filters.type,
        condition: filters.condition,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: currentPage,
        limit: perPage
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get('http://localhost:5001/api/ebikes', { params });
      setEbikes(response.data.ebikes || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching ebikes:', error);
      setEbikes([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, currentPage, perPage]);

  useEffect(() => {
    fetchEbikes();
  }, [fetchEbikes]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      model: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      type: '',
      condition: ''
    });
  };

  const totalPages = Math.ceil(totalResults / perPage);

  const allEbikeBrands = [
    'Bergamont', 'BMC', 'Bulls', 'Cannondale', 'Cube', 'Focus', 'Gazelle', 'Giant', 'Haibike',
    'Kalkhoff', 'KTM', 'Merida', 'Moustache', 'Orbea', 'Riese & Müller', 'Scott', 'Specialized',
    'Stromer', 'Trek', 'Winora'
  ].sort();

  const popularEbikeBrands = ['Specialized', 'Trek', 'Cube', 'Haibike', 'Riese & Müller', 'Bulls', 'Gazelle', 'Kalkhoff', 'Stromer', 'Giant'];

  const ebikeModels = {
    'Specialized': ['Turbo Levo', 'Turbo Levo SL', 'Turbo Vado', 'Turbo Como', 'Turbo Kenevo'],
    'Trek': ['Powerfly', 'Rail', 'Allant+', 'Verve+', 'Domane+ LT', 'Fuel EXe'],
    'Cube': ['Touring Hybrid Pro', 'Stereo Hybrid', 'Reaction Hybrid', 'Kathmandu Hybrid', 'Nuride Hybrid'],
    'Haibike': ['SDURO', 'XDURO', 'Trekking', 'FullSeven', 'AllMtn', 'ADVENTR'],
    'Riese & Müller': ['Charger3', 'Delite', 'Supercharger2', 'Load', 'Multicharger', 'Homage'],
    'Bulls': ['Iconic Evo', 'Lacuba Evo', 'Copperhead Evo', 'Sonic Evo', 'Six50 Evo'],
    'Gazelle': ['Ultimate', 'Medeo', 'Arroyo', 'Grenoble', 'Eclipse'],
    'Kalkhoff': ['Image', 'Entice', 'Endeavour', 'Agattu', 'Include'],
    'Stromer': ['ST5', 'ST3', 'ST1', 'ST2'],
    'Giant': ['Explore E+', 'Trance E+', 'Reign E+', 'Road E+']
  };

  const getModelsForBrand = (brand) => {
    return ebikeModels[brand] || [];
  };

  const ebikeTypes = ['Mountain', 'Trekking', 'City', 'Cargo', 'Folding', 'Road', 'Gravel'];
  const conditions = ['New', 'Used', 'Certified Pre-Owned'];

  return (
    <div className="cars-page">
      {/* Header */}
      <div className="cars-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>🚴 E-Bikes Marketplace</h1>
        <p>Browse from thousands of e-bikes worldwide</p>
      </div>

      <div className="cars-layout">
        {/* Filters Sidebar */}
        <div className="cars-sidebar">
          <div className="filter-section">
            <h3>Filters</h3>

            {/* Popular Brands Quick Filter */}
            <div className="filter-group">
              <label>Popular Brands</label>
              <div className="brand-chips">
                {popularEbikeBrands.map(brand => (
                  <button
                    key={brand}
                    className={`brand-chip ${filters.brand === brand ? 'active' : ''}`}
                    onClick={() => {
                      handleFilterChange('brand', filters.brand === brand ? '' : brand);
                      handleFilterChange('model', '');
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="filter-group">
              <label>Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => {
                  handleFilterChange('brand', e.target.value);
                  handleFilterChange('model', '');
                }}
              >
                <option value="">All Brands</option>
                {allEbikeBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Model Dropdown */}
            <div className="filter-group">
              <label>Model</label>
              <select
                value={filters.model}
                onChange={(e) => handleFilterChange('model', e.target.value)}
                disabled={!filters.brand}
              >
                <option value="">
                  {filters.brand ? 'All Models' : 'Select Brand First'}
                </option>
                {filters.brand && getModelsForBrand(filters.brand).map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="filter-group">
              <label>Price Range (€)</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.priceFrom}
                  onChange={(e) => handleFilterChange('priceFrom', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.priceTo}
                  onChange={(e) => handleFilterChange('priceTo', e.target.value)}
                />
              </div>
            </div>

            {/* Year Range */}
            <div className="filter-group">
              <label>Year</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.yearFrom}
                  onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="To"
                  value={filters.yearTo}
                  onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                />
              </div>
            </div>

            {/* Type */}
            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="">All Types</option>
                {ebikeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div className="filter-group">
              <label>Condition</label>
              <select value={filters.condition} onChange={(e) => handleFilterChange('condition', e.target.value)}>
                <option value="">All Conditions</option>
                {conditions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="cars-main">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-count">
              {loading ? 'Loading...' : `${totalResults} e-bikes found`}
            </div>
            <div className="sort-controls">
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('_');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="created_at_DESC">Newest First</option>
                <option value="created_at_ASC">Oldest First</option>
                <option value="price_ASC">Price: Low to High</option>
                <option value="price_DESC">Price: High to Low</option>
                <option value="year_DESC">Year: Newest First</option>
                <option value="year_ASC">Year: Oldest First</option>
              </select>
            </div>
          </div>

          {/* E-Bikes Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loader-spinner"></div>
              <p>Loading e-bikes...</p>
            </div>
          ) : ebikes.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No e-bikes found</h2>
              <p>Try adjusting your filters or search criteria</p>
              <button className="reset-btn" onClick={resetFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {ebikes.map(ebike => (
                  <div key={ebike.id} className="car-card" onClick={() => navigate(`/ebike/${ebike.id}`)}>
                    <div className="car-image">
                      {ebike.images && JSON.parse(ebike.images)[0] ? (
                        <img src={JSON.parse(ebike.images)[0]} alt={`${ebike.brand} ${ebike.model}`} />
                      ) : (
                        <div className="no-image">🚴</div>
                      )}
                      {ebike.condition === 'New' && <div className="badge badge-new">NEW</div>}
                    </div>
                    <div className="car-content">
                      <h3>{ebike.brand} {ebike.model}</h3>
                      <div className="car-price">€{ebike.price?.toLocaleString()}</div>
                      <div className="car-details">
                        <span>{ebike.year}</span>
                        {ebike.type && (
                          <>
                            <span>•</span>
                            <span>{ebike.type}</span>
                          </>
                        )}
                      </div>
                      <div className="car-specs">
                        {ebike.motor_power && <span>{ebike.motor_power}W Motor</span>}
                        {ebike.battery_capacity && ebike.motor_power && <span>•</span>}
                        {ebike.battery_capacity && <span>{ebike.battery_capacity}Wh Battery</span>}
                      </div>
                      <div className="car-location">
                        📍 {ebike.city}, {ebike.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EBikesPage;
