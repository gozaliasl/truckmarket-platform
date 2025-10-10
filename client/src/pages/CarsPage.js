import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './CarsPage.css';

function CarsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get brand from URL query parameter
  const brandFromUrl = searchParams.get('brand') || '';

  const [filters, setFilters] = useState({
    brand: brandFromUrl,
    model: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    bodyType: '',
    fuelType: '',
    transmission: '',
    mileageTo: '',
    condition: ''
  });

  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(25);
  const [totalResults, setTotalResults] = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        brand: filters.brand,
        model: filters.model,
        minYear: filters.yearFrom,
        maxYear: filters.yearTo,
        minPrice: filters.priceFrom,
        maxPrice: filters.priceTo,
        bodyType: filters.bodyType,
        fuelType: filters.fuelType,
        transmission: filters.transmission,
        maxMileage: filters.mileageTo,
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

      const response = await axios.get('http://localhost:5001/api/cars', { params });
      setCars(response.data.cars || []);
      setTotalResults(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder, currentPage, perPage]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Update filter when URL parameter changes
  useEffect(() => {
    if (brandFromUrl) {
      setFilters(prev => ({ ...prev, brand: brandFromUrl }));
    }
  }, [brandFromUrl]);

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
      bodyType: '',
      fuelType: '',
      transmission: '',
      mileageTo: '',
      condition: ''
    });
  };

  const totalPages = Math.ceil(totalResults / perPage);

  const allCarBrands = [
    'Abarth', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Cadillac',
    'Chevrolet', 'Chrysler', 'Citroën', 'Dacia', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
    'Genesis', 'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
    'Lamborghini', 'Lancia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'Maserati', 'Mazda',
    'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Polestar',
    'Porsche', 'Ram', 'Renault', 'Rolls-Royce', 'Saab', 'Seat', 'Škoda', 'Smart',
    'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
  ].sort();

  const popularCarBrands = ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Ford', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Hyundai'];

  const carModels = {
    'Audi': ['A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8', 'e-tron'],
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i4', 'iX', 'M2', 'M3', 'M4', 'M5', 'M8'],
    'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'S-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Class', 'EQA', 'EQB', 'EQC', 'EQE', 'EQS', 'AMG GT'],
    'Volkswagen': ['Polo', 'Golf', 'Jetta', 'Passat', 'Arteon', 'Tiguan', 'T-Roc', 'T-Cross', 'Touareg', 'ID.3', 'ID.4', 'ID.5'],
    'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Mustang', 'EcoSport', 'Puma', 'Kuga', 'Explorer', 'Edge', 'Ranger', 'F-150', 'Mustang Mach-E'],
    'Toyota': ['Aygo', 'Yaris', 'Corolla', 'Camry', 'Prius', 'RAV4', 'C-HR', 'Highlander', 'Land Cruiser', 'bZ4X'],
    'Honda': ['Jazz', 'Civic', 'Accord', 'CR-V', 'HR-V', 'e:Ny1'],
    'Nissan': ['Micra', 'Juke', 'Qashqai', 'X-Trail', 'Leaf', 'Ariya', '370Z', 'GT-R'],
    'Mazda': ['Mazda2', 'Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-60', 'MX-5', 'MX-30'],
    'Hyundai': ['i10', 'i20', 'i30', 'Elantra', 'Kona', 'Tucson', 'Santa Fe', 'Ioniq 5', 'Ioniq 6'],
    'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
    'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90', 'C40', 'EX30', 'EX90'],
    'Porsche': ['718', '911', 'Panamera', 'Cayenne', 'Macan', 'Taycan'],
    'Renault': ['Clio', 'Captur', 'Megane', 'Kadjar', 'Koleos', 'Zoe', 'Megane E-Tech'],
    'Peugeot': ['208', '308', '508', '2008', '3008', '5008', 'e-208', 'e-2008'],
    'Kia': ['Picanto', 'Rio', 'Ceed', 'Stonic', 'Niro', 'Sportage', 'Sorento', 'EV6', 'EV9']
  };

  const getModelsForBrand = (brand) => {
    return carModels[brand] || [];
  };

  const bodyTypes = ['Sedan', 'SUV', 'Station Wagon', 'Hatchback', 'Convertible', 'Coupe', 'Van', 'Pickup'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'Plug-in Hybrid', 'CNG', 'LPG'];
  const transmissions = ['Manual', 'Automatic', 'Semi-automatic'];
  const conditions = ['New', 'Used', 'Certified Pre-Owned'];

  return (
    <div className="cars-page">
      {/* Header */}
      <div className="cars-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <h1>🚗 Cars Marketplace</h1>
        <p>Browse from thousands of cars worldwide</p>
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
                {popularCarBrands.map(brand => (
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
                {allCarBrands.map(brand => (
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

            {/* Body Type */}
            <div className="filter-group">
              <label>Body Type</label>
              <select value={filters.bodyType} onChange={(e) => handleFilterChange('bodyType', e.target.value)}>
                <option value="">All Types</option>
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div className="filter-group">
              <label>Fuel Type</label>
              <select value={filters.fuelType} onChange={(e) => handleFilterChange('fuelType', e.target.value)}>
                <option value="">All Fuels</option>
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="filter-group">
              <label>Transmission</label>
              <select value={filters.transmission} onChange={(e) => handleFilterChange('transmission', e.target.value)}>
                <option value="">All Transmissions</option>
                {transmissions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Mileage */}
            <div className="filter-group">
              <label>Max Mileage (km)</label>
              <input
                type="number"
                placeholder="e.g., 100000"
                value={filters.mileageTo}
                onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
              />
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
              {loading ? 'Loading...' : `${totalResults} cars found`}
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
                <option value="mileage_ASC">Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {/* Cars Grid */}
          {loading ? (
            <div className="loading-container">
              <div className="loader-spinner"></div>
              <p>Loading cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No cars found</h2>
              <p>Try adjusting your filters or search criteria</p>
              <button className="reset-btn" onClick={resetFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="cars-grid">
                {cars.map(car => (
                  <div key={car.id} className="car-card" onClick={() => navigate(`/car/${car.id}`)}>
                    <div className="car-image">
                      {car.images && JSON.parse(car.images)[0] ? (
                        <img src={JSON.parse(car.images)[0]} alt={`${car.brand} ${car.model}`} />
                      ) : (
                        <div className="no-image">🚗</div>
                      )}
                      {car.condition === 'New' && <div className="badge badge-new">NEW</div>}
                      {car.fuel_type === 'Electric' && <div className="badge badge-electric">⚡ Electric</div>}
                    </div>
                    <div className="car-content">
                      <h3>{car.brand} {car.model}</h3>
                      <div className="car-price">€{car.price?.toLocaleString()}</div>
                      <div className="car-details">
                        <span>{car.year}</span>
                        <span>•</span>
                        <span>{car.mileage?.toLocaleString()} km</span>
                        <span>•</span>
                        <span>{car.fuel_type}</span>
                      </div>
                      <div className="car-specs">
                        <span>{car.transmission}</span>
                        {car.power_hp && <span>• {car.power_hp} HP</span>}
                        {car.body_type && <span>• {car.body_type}</span>}
                      </div>
                      <div className="car-location">
                        📍 {car.city}, {car.country}
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

export default CarsPage;
