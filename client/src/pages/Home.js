import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import TruckCard from '../components/TruckCard';
import './Home.css';

function Home() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchTrucks();
  }, [filters, searchTerm, sortBy]);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm,
        sortBy,
        sortOrder: 'DESC'
      };

      const response = await axios.get('/api/trucks', { params });
      setTrucks(response.data.trucks);
      setTotal(response.data.total);
      setError(null);
    } catch (err) {
      setError('Failed to load trucks. Please try again later.');
      console.error('Error fetching trucks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />

      <div className="container">
        <div className="home-content">
          <aside className="sidebar">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          <main className="main-content">
            <div className="results-header">
              <div className="results-info">
                <h2>{total} Trucks Available</h2>
                {searchTerm && <p>Search results for: "{searchTerm}"</p>}
              </div>

              <div className="sort-controls">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortBy} onChange={handleSortChange} className="sort-select">
                  <option value="created_at">Newest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="year">Year: Newest</option>
                  <option value="mileage">Mileage: Lowest</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading trucks...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : trucks.length === 0 ? (
              <div className="no-results">
                <h3>No trucks found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <div className="trucks-grid">
                {trucks.map(truck => (
                  <TruckCard key={truck.id} truck={truck} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Home;
