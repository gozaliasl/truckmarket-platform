import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import TruckCard from '../components/TruckCard';
import SortingControls from '../components/SortingControls';
import ViewToggle from '../components/ViewToggle';
import PerPageSelector from '../components/PerPageSelector';
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

  // Sorting state
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [sortValue, setSortValue] = useState(() => {
    return localStorage.getItem('truckmarket_sort') || 'created_at_desc';
  });

  // View state
  const [view, setView] = useState(() => {
    return localStorage.getItem('truckmarket_view') || 'grid';
  });

  // Pagination state
  const [perPage, setPerPage] = useState(() => {
    return parseInt(localStorage.getItem('truckmarket_perpage')) || 25;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Advanced Filters state
  const [advancedFilters, setAdvancedFilters] = useState({});

  // Hero search state
  const [heroSearch, setHeroSearch] = useState('');

  // Load initial sort from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('truckmarket_sort') || 'created_at_desc';
    const [field, order] = savedSort.split('_');
    const orderUpper = order === 'desc' ? 'DESC' : 'ASC';
    setSortBy(field === 'created' ? 'created_at' : field);
    setSortOrder(orderUpper);
  }, []);

  const fetchVehicles = useCallback(async () => {
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
        location: filters.location,
        sortBy: sortBy,
        sortOrder: sortOrder
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'Any' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await axios.get('http://localhost:5001/api/trucks', { params });
      const allVehicles = response.data.trucks || [];
      setTotalResults(allVehicles.length);

      // Apply client-side pagination
      const startIndex = (currentPage - 1) * perPage;
      const endIndex = startIndex + perPage;
      setVehicles(allVehicles.slice(startIndex, endIndex));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setVehicles([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, filters, sortBy, sortOrder, currentPage, perPage]);

  useEffect(() => {
    if (selectedCategory) {
      fetchVehicles();
    }
  }, [selectedCategory, filters, sortBy, sortOrder, currentPage, perPage, fetchVehicles]);

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

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setSortValue(`${newSortBy}_${newSortOrder.toLowerCase()}`);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      // Check if search term matches a brand
      const brands = ['Volvo', 'MAN', 'Scania', 'DAF', 'Mercedes-Benz', 'Renault', 'Iveco', 'Freightliner', 'Kenworth', 'Peterbilt'];
      const matchedBrand = brands.find(brand =>
        brand.toLowerCase().includes(heroSearch.toLowerCase()) ||
        heroSearch.toLowerCase().includes(brand.toLowerCase())
      );

      if (matchedBrand) {
        handleFilterChange({ ...filters, make: matchedBrand, model: '' });
      } else {
        handleFilterChange({ ...filters, make: '', model: heroSearch });
      }
      handleCategoryChange('semi-trailer-trucks');
    }
  };

  const totalPages = Math.ceil(totalResults / perPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-layout">
      {/* Left Sidebar with Filters */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        advancedFilters={advancedFilters}
        onAdvancedFilterChange={setAdvancedFilters}
      />

      {/* Main Content Area */}
      <div className="main-content-area">
        {!selectedCategory ? (
          // Welcome/Hero Section when no category selected
          <div className="welcome-section">
            <div className="welcome-hero">
              <div className="hero-brand-images">
                <img src="/images/brands/volvo.png" alt="Volvo" className="brand-img brand-1" />
                <img src="/images/brands/man.png" alt="MAN" className="brand-img brand-2" />
                <img src="/images/brands/scania.png" alt="Scania" className="brand-img brand-3" />
                <img src="/images/brands/daf.png" alt="DAF" className="brand-img brand-4" />
              </div>
              <div className="hero-content">
                <h1>Welcome to TruckMarket</h1>
                <p>Find your perfect commercial vehicle from thousands of listings worldwide</p>

                {/* Quick Search Bar */}
                <div className="hero-search-bar">
                  <input
                    type="text"
                    placeholder="Search by brand or model (e.g., DAF, Volvo, FH 540)..."
                    className="hero-search-input"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleHeroSearch();
                      }
                    }}
                  />
                  <button
                    className="hero-search-btn"
                    onClick={handleHeroSearch}
                  >
                    🔍 Search
                  </button>
                </div>
              </div>

              <div className="hero-stats-horizontal">
                <div className="stat-box">
                  <div className="stat-icon">🔍</div>
                  <div className="stat-content">
                    <div className="stat-number">2,031</div>
                    <div className="stat-label">Active Listings</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-number">1,450+</div>
                    <div className="stat-label">Verified Sellers</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🌍</div>
                  <div className="stat-content">
                    <div className="stat-number">45</div>
                    <div className="stat-label">Countries</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Brands */}
            <div className="popular-brands-section">
              <h3>Popular Brands</h3>
              <div className="brands-grid">
                {['Volvo', 'MAN', 'Scania', 'DAF', 'Mercedes-Benz', 'Renault', 'Iveco', 'Freightliner'].map(brand => (
                  <button
                    key={brand}
                    className="brand-btn"
                    onClick={() => {
                      handleFilterChange({ ...filters, make: brand });
                      handleCategoryChange('semi-trailer-trucks');
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            <div className="categories-welcome-section">
              <h2>👈 Select a category to start browsing</h2>
              <p className="categories-subtitle">Choose from 9 vehicle categories including trucks, trailers, buses, construction machines, and more.</p>
            </div>
          </div>
        ) : (
          // Listings Section when category selected
          <>
            <div className="listings-header">
              <div className="header-title">
                <h1>{selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h1>
                <p className="listing-count">
                  {loading ? 'Loading...' : `${totalResults} total | Showing ${vehicles.length} ads`}
                </p>
              </div>
              <div className="header-actions">
                <PerPageSelector
                  perPage={perPage}
                  onPerPageChange={handlePerPageChange}
                />
                <SortingControls
                  sortValue={sortValue}
                  onSortChange={handleSortChange}
                  loading={loading}
                />
                <ViewToggle
                  view={view}
                  onViewChange={handleViewChange}
                />
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
              <>
                <div className={`vehicles-list vehicles-${view}`}>
                  {vehicles.map(vehicle => (
                    <div key={vehicle.id} onClick={() => handleTruckClick(vehicle.id)}>
                      <TruckCard truck={vehicle} view={view} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>

                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current
                          if (page === 1 || page === totalPages) return true;
                          if (Math.abs(page - currentPage) <= 1) return true;
                          return false;
                        })
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="pagination-ellipsis">...</span>
                            )}
                            <button
                              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default HomeNew;
