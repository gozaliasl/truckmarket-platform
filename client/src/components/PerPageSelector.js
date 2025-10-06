import React from 'react';
import './PerPageSelector.css';

function PerPageSelector({ perPage, onPerPageChange }) {
  const options = [10, 25, 50];

  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    onPerPageChange(value);
    localStorage.setItem('truckmarket_perpage', value.toString());
  };

  return (
    <div className="perpage-selector">
      <label htmlFor="perpage-select">Show:</label>
      <select
        id="perpage-select"
        value={perPage}
        onChange={handleChange}
        className="perpage-select"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option} ads
          </option>
        ))}
      </select>
    </div>
  );
}

export default PerPageSelector;
