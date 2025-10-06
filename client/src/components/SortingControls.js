import React from 'react';
import './SortingControls.css';

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest Ads First', sortBy: 'created_at', sortOrder: 'DESC' },
  { value: 'created_at_asc', label: 'Oldest Ads First', sortBy: 'created_at', sortOrder: 'ASC' },
  { value: 'price_asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'ASC' },
  { value: 'price_desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'DESC' },
  { value: 'mileage_asc', label: 'Mileage: Low to High', sortBy: 'mileage', sortOrder: 'ASC' },
  { value: 'mileage_desc', label: 'Mileage: High to Low', sortBy: 'mileage', sortOrder: 'DESC' },
  { value: 'year_desc', label: 'Year: Newest First', sortBy: 'year', sortOrder: 'DESC' },
  { value: 'year_asc', label: 'Year: Oldest First', sortBy: 'year', sortOrder: 'ASC' }
];

function SortingControls({ sortValue, onSortChange, loading }) {
  const handleChange = (e) => {
    const selectedOption = SORT_OPTIONS.find(opt => opt.value === e.target.value);
    if (selectedOption) {
      onSortChange(selectedOption.sortBy, selectedOption.sortOrder);
      // Persist to localStorage
      localStorage.setItem('truckmarket_sort', e.target.value);
    }
  };

  return (
    <div className="sorting-controls">
      <label htmlFor="sort-select" className="sort-label">
        <span className="sort-icon">⬍</span>
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortValue}
        onChange={handleChange}
        className={`sort-select ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {SORT_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {loading && <span className="sort-spinner">⟳</span>}
    </div>
  );
}

export default SortingControls;
