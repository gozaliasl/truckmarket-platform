import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterSidebar.css';

function FilterSidebar({ filters, onFilterChange }) {
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    categories: [],
    countries: [],
    priceRange: { min: 0, max: 100000 },
    yearRange: { min: 2000, max: 2024 }
  });

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('/api/filters');
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleChange = (filterName, value) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button onClick={handleClearFilters} className="clear-filters">
          Clear all
        </button>
      </div>

      <div className="filter-section">
        <h4>Brand</h4>
        <select
          value={filters.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
          className="filter-select"
        >
          <option value="">All Brands</option>
          {filterOptions.brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        <select
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {filterOptions.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Country</h4>
        <select
          value={filters.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
          className="filter-select"
        >
          <option value="">All Countries</option>
          {filterOptions.countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Price Range (EUR)</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="filter-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Year</h4>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.minYear || ''}
            onChange={(e) => handleChange('minYear', e.target.value)}
            className="filter-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxYear || ''}
            onChange={(e) => handleChange('maxYear', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Condition</h4>
        <select
          value={filters.condition || ''}
          onChange={(e) => handleChange('condition', e.target.value)}
          className="filter-select"
        >
          <option value="">All</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Transmission</h4>
        <select
          value={filters.transmission || ''}
          onChange={(e) => handleChange('transmission', e.target.value)}
          className="filter-select"
        >
          <option value="">All</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>
    </div>
  );
}

export default FilterSidebar;
