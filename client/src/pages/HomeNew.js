import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FilterSidebar from '../components/FilterSidebar';
import AdvertisingSidebar from '../components/AdvertisingSidebar';
import TruckCard from '../components/TruckCard';
import SortingControls from '../components/SortingControls';
import ViewToggle from '../components/ViewToggle';
import PerPageSelector from '../components/PerPageSelector';
import './HomeNew.css';
import headerPhoto from '../assets/road-logo.png';

function HomeNew() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  
  // Dynamic hero text state
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Hero text options
  const heroOptions = [
    {
      emoji: '🚗',
      headline: 'Your Journey Starts Here',
      subtext: 'Buy, sell, or discover your next car or truck — all in one place.'
    },
    {
      emoji: '🌊',
      headline: 'Feel the Freedom of the Road',
      subtext: 'Find, buy, and sell vehicles built for every journey.'
    },
    {
      emoji: '⚙️',
      headline: 'Drive Your Future with Road',
      subtext: 'A smarter way to buy and sell cars and trucks online.'
    },
    {
      emoji: '🌅',
      headline: 'Road is Yours!',
      subtext: 'Explore, buy, and sell — wherever the journey takes you.'
    },
    {
      emoji: '🧭',
      headline: 'Shift into Gear with Road',
      subtext: 'Connecting car and truck buyers and sellers worldwide.'
    }
  ];

  // Load initial sort from localStorage
  useEffect(() => {
    const savedSort = localStorage.getItem('truckmarket_sort') || 'created_at_desc';
    const [field, order] = savedSort.split('_');
    const orderUpper = order === 'desc' ? 'DESC' : 'ASC';
    setSortBy(field === 'created' ? 'created_at' : field);
    setSortOrder(orderUpper);
  }, []);

  // Dynamic hero text cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentHeroIndex((prevIndex) => 
          (prevIndex + 1) % heroOptions.length
        );
        setIsTransitioning(false);
      }, 400); // Half of the transition duration
      
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, [heroOptions.length]);

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

  // Initial load
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Always load vehicles (trucks by default)
    fetchVehicles();
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
      {/* Left Sidebar - Show Ads when no category selected, Filters when category selected */}
      {!selectedCategory ? (
        <AdvertisingSidebar />
      ) : (
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          advancedFilters={advancedFilters}
          onAdvancedFilterChange={setAdvancedFilters}
        />
      )}

      {/* Main Content Area */}
      <div className="main-content-area">
        {!selectedCategory ? (
          // Welcome/Hero Section when no category selected
          <div className="welcome-section">
            {/* Main Vehicle Type Selector - Light Vehicles Only */}
            <div className="vehicle-type-selector">
              <h2>🚗 Choose Your Vehicle Type</h2>
              <p className="vehicle-type-subtitle">Browse our selection of personal vehicles and recreational options</p>
              <div className="vehicle-types-grid">
                {/* Passenger Vehicles */}
                <div className="vehicle-type-card" onClick={() => navigate('/cars')}>
                  <div className="vehicle-type-icon-container">
                    <img src="/images/vehicle-types/Cars.png" alt="Cars" className="vehicle-type-image" />
                  </div>
                  <h3>Cars</h3>
                  <p>Passenger vehicles for personal use</p>
                  <div className="vehicle-type-count">2,500+ Listings</div>
                </div>
                
                <div className="vehicle-type-card" onClick={() => navigate('/motorcycles')}>
                  <div className="vehicle-type-icon-container">
                    <img src="/images/vehicle-types/Motorcycles.png" alt="Motorcycles" className="vehicle-type-image" />
                  </div>
                  <h3>Motorcycles</h3>
                  <p>Two-wheeled motor vehicles</p>
                  <div className="vehicle-type-count">850+ Listings</div>
                </div>


                {/* Recreational Vehicles */}
                <div className="vehicle-type-card" onClick={() => navigate('/caravans')}>
                  <div className="vehicle-type-icon-container">
                    <img src="/images/vehicle-types/Caravans.png" alt="Caravans" className="vehicle-type-image" />
                  </div>
                  <h3>Caravans & Motorhomes</h3>
                  <p>Recreational vehicles for travel</p>
                  <div className="vehicle-type-count">420+ Listings</div>
                </div>

                <div className="vehicle-type-card" onClick={() => navigate('/ebikes')}>
                  <div className="vehicle-type-icon-container">
                    <img src="/images/vehicle-types/E-Bikes.png" alt="E-Bikes" className="vehicle-type-image" />
                  </div>
                  <h3>E-Bikes</h3>
                  <p>Electric bicycles and scooters</p>
                  <div className="vehicle-type-count">180+ Listings</div>
                </div>
              </div>
            </div>

            {/* Find Your Vehicle - Horizontal Categories */}
            <div className="find-vehicle-horizontal">
              <div className="find-vehicle-header">
                <h2>🔍 {t('home.commercialVehicles.title')}</h2>
                <p>{t('home.commercialVehicles.subtitle')}</p>
              </div>
              <div className="categories-horizontal-grid">
                {[
                  { id: 'semi-trailer', name: 'Semi-Trailers (Tractors)', image: '/images/categories/truck-tractors.png', count: '150+' },
                  { id: 'semi-trailer-trucks', name: 'Semi-Trailer Trucks', image: '/images/categories/semi-trailer-trucks.png', count: '850+' },
                  { id: 'trucks-over-7.5t', name: 'Trucks over 7.5t', image: '/images/categories/trucks-over-7.5t.png', count: '620+' },
                  { id: 'vans-up-to-7.5t', name: 'Vans ≤ 7.5t', image: '/images/categories/vans.png', count: '430+' },
                  { id: 'construction', name: 'Construction', image: '/images/categories/construction.png', count: '380+' },
                  { id: 'trailer', name: 'Trailers', image: '/images/categories/trailers.png', count: '290+' },
                  { id: 'agricultural', name: 'Agricultural', image: '/images/categories/agricultural.png', count: '250+' },
                  { id: 'buses-coaches', name: 'Buses & Coaches', image: '/images/categories/buses.png', count: '180+' },
                  { id: 'forklift', name: 'Forklifts', image: '/images/categories/forklifts.png', count: '120+' }
                ].map(category => (
                  <div
                    key={category.id}
                    className="category-horizontal-card"
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <div className="category-image-container">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="category-image"
                      />
                    </div>
                    <h3>{category.name}</h3>
                    <div className="category-count">{category.count} Listings</div>
                    <button className="category-browse-btn">Browse →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Car Brands Section */}
            <div className="popular-car-brands-section">
              <div className="car-brands-header">
                <h2>🚗 {t('home.popularCarBrands.title')}</h2>
                <p>{t('home.popularCarBrands.subtitle')}</p>
              </div>
              <div className="car-brands-grid">
                {[
                  { name: 'Audi', logo: 'audi-logo.png' },
                  { name: 'BMW', logo: 'bmw-logo.png' },
                  { name: 'Ford', logo: 'ford-logo.png' },
                  { name: 'Mercedes-Benz', logo: 'mercedes-benz-logo.png' },
                  { name: 'Opel', logo: 'opel-logo.png' },
                  { name: 'Renault', logo: 'renault-logo.png' },
                  { name: 'Skoda', logo: 'skoda-logo.png' },
                  { name: 'Tesla', logo: 'tesla-logo.png' },
                  { name: 'Toyota', logo: 'toyota-logo.png' },
                  { name: 'Volvo', logo: 'volvo-logo.png' },
                  { name: 'Volkswagen', logo: 'volkswagen-logo.png' }
                ].map(brand => (
                  <div
                    key={brand.name}
                    className="car-brand-card"
                    onClick={() => navigate(`/cars?brand=${encodeURIComponent(brand.name)}`)}
                  >
                    <div className="car-brand-logo">
                      <img src={`/images/car-brands/${brand.logo}`} alt={`${brand.name} logo`} />
                    </div>
                    <h3>{brand.name}</h3>
                  </div>
                ))}
                <div
                  className="car-brand-card more-brands"
                  onClick={() => navigate('/cars')}
                >
                  <div className="car-brand-logo">➕</div>
                  <h3>{t('home.popularCarBrands.moreBrands')}</h3>
                </div>
              </div>
            </div>

            {/* Popular Truck Brands Section */}
            <div className="popular-car-brands-section">
              <div className="car-brands-header">
                <h2>🚛 Popular Truck Brands</h2>
                <p>Discover trucks from leading manufacturers worldwide</p>
              </div>
              <div className="car-brands-grid">
                {[
                  { name: 'Volvo', logo: 'volvo-logo.png' },
                  { name: 'MAN', logo: 'MAN-logo.png' },
                  { name: 'Scania', logo: 'scania-logo.png' },
                  { name: 'DAF', logo: 'DAF-logo.png' },
                  { name: 'Mercedes-Benz', logo: 'mercedes-benz-logo.png' },
                  { name: 'Renault', logo: 'renault-logo.png' },
                  { name: 'Iveco', logo: 'iveco-logo.png' }
                ].map(brand => (
                  <div
                    key={brand.name}
                    className="car-brand-card"
                    onClick={() => {
                      handleFilterChange({ ...filters, make: brand.name });
                      handleCategoryChange('semi-trailer-trucks');
                    }}
                  >
                    <div className="car-brand-logo">
                      <img src={`/images/car-brands/${brand.logo}`} alt={`${brand.name} logo`} />
                    </div>
                    <h3>{brand.name}</h3>
                  </div>
                ))}
                <div
                  className="car-brand-card more-brands"
                  onClick={() => navigate('/trucks')}
                >
                  <div className="car-brand-logo">➕</div>
                  <h3>More Brands</h3>
                </div>
              </div>
            </div>

            <div className="welcome-hero">
              <div className="dynamic-hero-content">
                <h1 className={`dynamic-hero-headline ${isTransitioning ? 'hero-text-fade-out' : 'hero-text-fade-in'}`}>
                  {heroOptions[currentHeroIndex].headline}
                </h1>
                <p className={`dynamic-hero-subtext ${isTransitioning ? 'hero-text-fade-out' : 'hero-text-fade-in'}`}>
                  {heroOptions[currentHeroIndex].subtext}
                </p>

                {/* Quick Search Bar */}
                <div className="hero-search-bar">
                  <input
                    type="text"
                    placeholder={t('home.hero.searchPlaceholder')}
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
                    🔍 {t('common.search')}
                  </button>
                </div>
              </div>

              <div className="hero-stats-horizontal">
                <div className="stat-box">
                  <div className="stat-icon">🔍</div>
                  <div className="stat-content">
                    <div className="stat-number">2,031</div>
                    <div className="stat-label">{t('home.stats.listings')}</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">✅</div>
                  <div className="stat-content">
                    <div className="stat-number">1,450+</div>
                    <div className="stat-label">{t('home.stats.sellers')}</div>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🌍</div>
                  <div className="stat-content">
                    <div className="stat-number">45</div>
                    <div className="stat-label">{t('home.stats.countries')}</div>
                  </div>
                </div>
              </div>
            </div>


            {/* AI-Powered Features Section */}
            <div className="ai-features-section">
              <div className="ai-features-header">
                <h2>🤖 {t('home.aiFeatures.title')}</h2>
                <p>{t('home.aiFeatures.subtitle')}</p>
              </div>

              <div className="ai-features-grid">
                <div className="ai-feature-card" onClick={() => navigate('/ai-demo')}>
                  <div className="ai-feature-icon">💬</div>
                  <h3>{t('home.aiFeatures.chatbot.title')}</h3>
                  <p>{t('home.aiFeatures.chatbot.description')}</p>
                  <button className="ai-feature-btn">Try Chatbot →</button>
                </div>

                <div className="ai-feature-card" onClick={() => navigate('/ai-demo')}>
                  <div className="ai-feature-icon">🔍</div>
                  <h3>{t('home.aiFeatures.smartSearch.title')}</h3>
                  <p>{t('home.aiFeatures.smartSearch.description')}</p>
                  <button className="ai-feature-btn">Try Smart Search →</button>
                </div>

                <div className="ai-feature-card" onClick={() => navigate('/ai-demo')}>
                  <div className="ai-feature-icon">💰</div>
                  <h3>{t('home.aiFeatures.priceEstimation.title')}</h3>
                  <p>{t('home.aiFeatures.priceEstimation.description')}</p>
                  <button className="ai-feature-btn">Check Prices →</button>
                </div>

                <div className="ai-feature-card" onClick={() => navigate('/ai-demo')}>
                  <div className="ai-feature-icon">📊</div>
                  <h3>{t('home.aiFeatures.marketInsights.title')}</h3>
                  <p>{t('home.aiFeatures.marketInsights.description')}</p>
                  <button className="ai-feature-btn">View Insights →</button>
                </div>
              </div>

              <div className="ai-cta-banner">
                <div className="ai-cta-content">
                  <h3>🚀 Experience All AI Features</h3>
                  <p>Discover how AI makes finding your perfect vehicle easier than ever</p>
                </div>
                <button className="ai-cta-button" onClick={() => navigate('/ai-demo')}>
                  Open AI Demo Page →
                </button>
              </div>
            </div>

            <div className="categories-welcome-section">
              <h2>🚗 {t('home.marketplace.title')}</h2>
              <div className="marketplace-features">
                <div className="feature-column">
                  <h3>💡 {t('home.marketplace.buy.title')}</h3>
                  <p>{t('home.marketplace.buy.description')}</p>
                </div>
                <div className="feature-column">
                  <h3>💰 {t('home.marketplace.sell.title')}</h3>
                  <p>{t('home.marketplace.sell.description')}</p>
                </div>
                <div className="feature-column">
                  <h3>🔑 {t('home.marketplace.finance.title')}</h3>
                  <p>{t('home.marketplace.finance.description')}</p>
                </div>
              </div>
              <div className="marketplace-tip">
                <strong>💡 {t('home.marketplace.tip')}</strong> {t('home.marketplace.tipDescription')}
              </div>
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
