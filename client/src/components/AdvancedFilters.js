import React, { useState } from 'react';
import { CATEGORY_FILTERS, COMMON_FILTERS } from '../config/categoryFilters';
import './AdvancedFilters.css';

function AdvancedFilters({ selectedCategory, filters, onFilterChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedCategory) return null;

  const categoryConfig = CATEGORY_FILTERS[selectedCategory];
  if (!categoryConfig) return null;

  const categoryFilters = categoryConfig.filters || [];

  const handleFilterChange = (filterId, value) => {
    onFilterChange({
      ...filters,
      [filterId]: value
    });
  };

  const handleRangeChange = (filterId, type, value) => {
    const currentRange = filters[filterId] || {};
    onFilterChange({
      ...filters,
      [filterId]: {
        ...currentRange,
        [type]: value
      }
    });
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const renderFilter = (filter) => {
    const value = filters[filter.id] || '';

    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.id} className="advanced-filter-item">
            <label className="advanced-filter-label">
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
            <select
              className="advanced-filter-select"
              value={value}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            >
              <option value="">All</option>
              {filter.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      case 'text':
        return (
          <div key={filter.id} className="advanced-filter-item">
            <label className="advanced-filter-label">
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
            <input
              type="text"
              className="advanced-filter-input"
              placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}...`}
              value={value}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={filter.id} className="advanced-filter-item checkbox-item">
            <label className="advanced-filter-checkbox">
              <input
                type="checkbox"
                checked={value === true || value === 1}
                onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
              />
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
          </div>
        );

      case 'range':
        const rangeValue = filters[filter.id] || {};
        return (
          <div key={filter.id} className="advanced-filter-item range-item">
            <label className="advanced-filter-label">
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
            <div className="range-inputs">
              <input
                type="number"
                className="range-input"
                placeholder="Min"
                min={filter.min}
                max={filter.max}
                step={filter.step}
                value={rangeValue.min || ''}
                onChange={(e) => handleRangeChange(filter.id, 'min', e.target.value)}
              />
              <span className="range-separator">—</span>
              <input
                type="number"
                className="range-input"
                placeholder="Max"
                min={filter.min}
                max={filter.max}
                step={filter.step}
                value={rangeValue.max || ''}
                onChange={(e) => handleRangeChange(filter.id, 'max', e.target.value)}
              />
            </div>
            {filter.min !== undefined && (
              <div className="range-hint">
                Range: {filter.min.toLocaleString()} - {filter.max.toLocaleString()}
              </div>
            )}
          </div>
        );

      case 'year-range':
        const yearValue = filters.yearRange || {};
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let y = currentYear; y >= 1990; y--) {
          years.push(y);
        }
        return (
          <div key={filter.id} className="advanced-filter-item">
            <label className="advanced-filter-label">
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
            <div className="range-inputs">
              <select
                className="range-select"
                value={yearValue.from || ''}
                onChange={(e) => handleRangeChange('yearRange', 'from', e.target.value)}
              >
                <option value="">From</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className="range-separator">—</span>
              <select
                className="range-select"
                value={yearValue.to || ''}
                onChange={(e) => handleRangeChange('yearRange', 'to', e.target.value)}
              >
                <option value="">To</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'price-range':
        const priceValue = filters.priceRange || {};
        return (
          <div key={filter.id} className="advanced-filter-item">
            <label className="advanced-filter-label">
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.label}</span>
            </label>
            <div className="price-type-selector">
              <label className="price-type-radio">
                <input
                  type="radio"
                  name="priceType"
                  value="gross"
                  checked={filters.priceType !== 'net'}
                  onChange={() => handleFilterChange('priceType', 'gross')}
                />
                <span>Gross</span>
              </label>
              <label className="price-type-radio">
                <input
                  type="radio"
                  name="priceType"
                  value="net"
                  checked={filters.priceType === 'net'}
                  onChange={() => handleFilterChange('priceType', 'net')}
                />
                <span>Net</span>
              </label>
            </div>
            <div className="range-inputs">
              <input
                type="number"
                className="range-input"
                placeholder="Min price"
                value={priceValue.min || ''}
                onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
              />
              <span className="range-separator">—</span>
              <input
                type="number"
                className="range-input"
                placeholder="Max price"
                value={priceValue.max || ''}
                onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const value = filters[key];
    if (typeof value === 'object') {
      return Object.values(value).some(v => v !== '' && v !== null && v !== undefined);
    }
    return value !== '' && value !== null && value !== undefined;
  }).length;

  return (
    <div className="advanced-filters-container">
      <div className="advanced-filters-header">
        <button
          className="toggle-advanced-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="toggle-icon">{showAdvanced ? '▼' : '▶'}</span>
          <span>Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="active-count">{activeFilterCount}</span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button className="clear-all-btn" onClick={clearAllFilters}>
            ✕ Clear All
          </button>
        )}
      </div>

      {showAdvanced && (
        <div className="advanced-filters-content">
          <div className="filters-grid">
            {/* Common filters always shown */}
            {COMMON_FILTERS.map(filter => renderFilter(filter))}

            {/* Category-specific filters */}
            {categoryFilters.map(filter => renderFilter(filter))}
          </div>

          <div className="filters-footer">
            <div className="ai-assist-hint">
              💡 <strong>Tip:</strong> Use AI Search above for natural language queries like
              "Mercedes Actros Euro 6 under 500k km"
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
