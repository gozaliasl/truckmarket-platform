import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarsPage.css';

function CaravansPage() {
  const navigate = useNavigate();
  const [caravans, setCaravans] = useState([]);
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

  const fetchCaravans = useCallback(async () => {
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

      const response = await axios.get('http://localhost:5001/api/caravans', { params });
      setCaravans(response.data.caravans || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching caravans:', error);
      setCaravans([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, currentPage, perPage]);

  useEffect(() => {
    fetchCaravans();
  }, [fetchCaravans]);

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

  const allCaravanBrands = [
    'Adria', 'Benimar', 'Bürstner', 'Carado', 'Challenger', 'Chausson', 'CI', 'Dethleffs',
    'Elddis', 'Fendt', 'Hobby', 'Hymer', 'Knaus', 'LMC', 'Pilote', 'Rapido', 'Roller Team',
    'Sun Living', 'Swift', 'Weinsberg'
  ].sort();

  const popularCaravanBrands = ['Hymer', 'Dethleffs', 'Knaus', 'Weinsberg', 'Bürstner', 'Hobby', 'Adria', 'Pilote', 'LMC', 'Challenger'];

  const caravanModels = {
    'Hymer': ['B-Klasse', 'Venture S', 'MLT', 'Exsis', 'Grand Canyon S'],
    'Dethleffs': ['Globetrail', 'Globebus', 'Advantage', 'Pulse', 'Generation'],
    'Knaus': ['Boxdrive', 'Boxstar', 'Cascan', 'Sky Wave', 'Sport'],
    'Weinsberg': ['CaraOne', 'CaraTwo', 'X-Cursion', 'CaraBus', 'CaraCore'],
    'Bürstner': ['Lyseo Time', 'Ixeo Time', 'Campeo', 'Averso', 'Premio'],
    'Hobby': ['Optima', 'Premium', 'Excellent', 'De Luxe', 'Ontour'],
    'Adria': ['Alpina', 'Astella', 'Aviva', 'Altea', 'Adora'],
    'Pilote': ['Galaxy', 'Pacific', 'Aventura', 'Reference'],
    'LMC': ['Vivo', 'Style', 'Cruiser', 'Liberty', 'Explorer'],
    'Challenger': ['Graphite', 'Genesis', 'Mageo', 'X-Road']
  };

  const getModelsForBrand = (brand) => {
    return caravanModels[brand] || [];
  };

  const caravanTypes = ['Travel Trailer', 'Motorhome', 'Camper Van', 'Fifth Wheel'];
  const conditions = ['New', 'Used', 'Certified Pre-Owned'];

  return (
    <div className="cars-page">
      {/* Header */}
      <div className="cars-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>🚐 Caravans & Motorhomes Marketplace</h1>
        <p>Browse from thousands of caravans and motorhomes worldwide</p>
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
                {popularCaravanBrands.map(brand => (
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
                {allCaravanBrands.map(brand => (
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
                {caravanTypes.map(type => (
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
              {loading ? 'Loading...' : `${totalResults} caravans found`}
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

          {/* Caravans Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loader-spinner"></div>
              <p>Loading caravans...</p>
            </div>
          ) : caravans.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No caravans found</h2>
              <p>Try adjusting your filters or search criteria</p>
              <button className="reset-btn" onClick={resetFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {caravans.map(caravan => (
                  <div key={caravan.id} className="car-card" onClick={() => navigate(`/caravan/${caravan.id}`)}>
                    <div className="car-image">
                      {caravan.images && JSON.parse(caravan.images)[0] ? (
                        <img src={JSON.parse(caravan.images)[0]} alt={`${caravan.brand} ${caravan.model}`} />
                      ) : (
                        <div className="no-image">🚐</div>
                      )}
                      {caravan.condition === 'New' && <div className="badge badge-new">NEW</div>}
                    </div>
                    <div className="car-content">
                      <h3>{caravan.brand} {caravan.model}</h3>
                      <div className="car-price">€{caravan.price?.toLocaleString()}</div>
                      <div className="car-details">
                        <span>{caravan.year}</span>
                        {caravan.type && (
                          <>
                            <span>•</span>
                            <span>{caravan.type}</span>
                          </>
                        )}
                      </div>
                      <div className="car-specs">
                        {caravan.sleeping_capacity && <span>{caravan.sleeping_capacity} Sleeps</span>}
                        {caravan.beds && caravan.sleeping_capacity && <span>•</span>}
                        {caravan.beds && <span>{caravan.beds} Beds</span>}
                      </div>
                      <div className="car-location">
                        📍 {caravan.city}, {caravan.country}
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

export default CaravansPage;
