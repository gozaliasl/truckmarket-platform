import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CarsPage.css';

function MotorcyclesPage() {
  const navigate = useNavigate();
  const [motorcycles, setMotorcycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    type: '',
    cylindersFrom: '',
    condition: ''
  });

  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMotorcycles = useCallback(async () => {
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
        minCylinders: filters.cylindersFrom,
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

      const response = await axios.get('http://localhost:5001/api/motorcycles', { params });
      setMotorcycles(response.data.motorcycles || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching motorcycles:', error);
      setMotorcycles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, currentPage, perPage]);

  useEffect(() => {
    fetchMotorcycles();
  }, [fetchMotorcycles]);

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
      cylindersFrom: '',
      condition: ''
    });
  };

  const totalPages = Math.ceil(totalResults / perPage);

  const allMotorcycleBrands = [
    'Aprilia', 'Benelli', 'BMW', 'Can-Am', 'Ducati', 'Harley-Davidson', 'Honda', 'Husqvarna',
    'Indian', 'Kawasaki', 'KTM', 'Moto Guzzi', 'MV Agusta', 'Royal Enfield', 'Suzuki', 
    'Triumph', 'Yamaha', 'Zero', 'Vespa', 'Piaggio'
  ].sort();

  const popularMotorcycleBrands = ['Honda', 'Yamaha', 'Kawasaki', 'Suzuki', 'BMW', 'Ducati', 'Harley-Davidson', 'KTM', 'Triumph', 'Indian'];

  const motorcycleModels = {
    'Honda': ['CB500X', 'CB650R', 'CBR1000RR', 'Africa Twin', 'Rebel 1100', 'Gold Wing', 'CBR600RR', 'CB300R', 'NC750X', 'PCX125'],
    'Yamaha': ['MT-07', 'MT-09', 'MT-10', 'R7', 'R1', 'Tenere 700', 'Tracer 7', 'Tracer 9', 'YZF-R6', 'TMAX', 'NMAX'],
    'Kawasaki': ['Ninja ZX-6R', 'Ninja ZX-10R', 'Z650', 'Z900', 'Z1000', 'Versys 650', 'Versys 1000', 'Ninja 400', 'Z400', 'Vulcan S'],
    'Suzuki': ['GSX-R1000', 'GSX-R750', 'GSX-S1000', 'V-Strom 1050', 'V-Strom 650', 'SV650', 'Katana', 'Hayabusa', 'Boulevard'],
    'BMW': ['R1250GS', 'R1200GS', 'S1000RR', 'S1000XR', 'F850GS', 'F750GS', 'G310R', 'G310GS', 'R nineT', 'K1600GT'],
    'Ducati': ['Panigale V4', 'Panigale V2', 'Monster', 'Multistrada V4', 'Multistrada 950', 'Scrambler', 'Diavel', 'SuperSport', 'Streetfighter V4'],
    'Harley-Davidson': ['Street Bob', 'Fat Boy', 'Road King', 'Road Glide', 'Sportster S', 'Pan America', 'Low Rider', 'Street Glide', 'Softail Standard'],
    'KTM': ['1290 Super Duke R', '890 Duke', '790 Duke', '390 Duke', '1290 Super Adventure', '890 Adventure', '390 Adventure', 'RC 390'],
    'Triumph': ['Street Triple', 'Speed Triple', 'Tiger 900', 'Tiger 1200', 'Bonneville T120', 'Scrambler 1200', 'Rocket 3', 'Trident 660'],
    'Indian': ['Scout', 'Scout Bobber', 'Chief', 'Chieftain', 'Roadmaster', 'Springfield', 'FTR 1200', 'Challenger']
  };

  const getModelsForBrand = (brand) => {
    return motorcycleModels[brand] || [];
  };

  return (
    <div className="cars-page">
      <div className="cars-header">
        <h1>🏍️ Motorcycles Marketplace</h1>
        <p>Find your perfect motorcycle</p>
      </div>

      <div className="cars-content">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h2>Filters</h2>
            <button onClick={resetFilters} className="reset-btn">Reset All</button>
          </div>

          <div className="popular-brands">
            <h3>Popular Brands</h3>
            <div className="brand-chips">
              {popularMotorcycleBrands.map(brand => (
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
              {allMotorcycleBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

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

          <div className="filter-group">
            <label>Type</label>
            <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="Sport">Sport</option>
              <option value="Cruiser">Cruiser</option>
              <option value="Touring">Touring</option>
              <option value="Adventure">Adventure</option>
              <option value="Naked">Naked</option>
              <option value="Scooter">Scooter</option>
              <option value="Off-Road">Off-Road</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Year Range</label>
            <div className="range-inputs">
              <input type="number" placeholder="From" value={filters.yearFrom} onChange={(e) => handleFilterChange('yearFrom', e.target.value)} />
              <input type="number" placeholder="To" value={filters.yearTo} onChange={(e) => handleFilterChange('yearTo', e.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <label>Price Range (€)</label>
            <div className="range-inputs">
              <input type="number" placeholder="Min" value={filters.priceFrom} onChange={(e) => handleFilterChange('priceFrom', e.target.value)} />
              <input type="number" placeholder="Max" value={filters.priceTo} onChange={(e) => handleFilterChange('priceTo', e.target.value)} />
            </div>
          </div>

          <div className="filter-group">
            <label>Min Cylinders</label>
            <select value={filters.cylindersFrom} onChange={(e) => handleFilterChange('cylindersFrom', e.target.value)}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Condition</label>
            <select value={filters.condition} onChange={(e) => handleFilterChange('condition', e.target.value)}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Used">Used</option>
            </select>
          </div>
        </aside>

        <main className="cars-results">
          <div className="results-header">
            <div className="results-count">
              {loading ? 'Loading...' : `${totalResults} Motorcycles Found`}
            </div>
            <div className="sort-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="created_at">Newest</option>
                <option value="price">Price</option>
                <option value="year">Year</option>
                <option value="mileage">Mileage</option>
              </select>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading motorcycles...</div>
          ) : motorcycles.length === 0 ? (
            <div className="no-results">No motorcycles found. Try adjusting your filters.</div>
          ) : (
            <>
              <div className="cars-grid">
                {motorcycles.map(motorcycle => (
                  <div key={motorcycle.id} className="car-card" onClick={() => navigate(`/motorcycle/${motorcycle.id}`)}>
                    <div className="car-image-placeholder">
                      🏍️
                    </div>
                    <div className="car-details">
                      <h3>{motorcycle.brand} {motorcycle.model}</h3>
                      <div className="car-specs">
                        <span>📅 {motorcycle.year}</span>
                        <span>🛣️ {motorcycle.mileage?.toLocaleString()} km</span>
                        <span>⚙️ {motorcycle.cylinders} cyl</span>
                        <span>💪 {motorcycle.power_hp} HP</span>
                      </div>
                      <div className="car-price">€{motorcycle.price?.toLocaleString()}</div>
                      <div className="car-location">📍 {motorcycle.city}</div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default MotorcyclesPage;
