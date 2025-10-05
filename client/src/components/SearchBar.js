import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar-container">
      <div className="search-hero">
        <h1>Find Your Perfect Commercial Truck</h1>
        <p>Browse thousands of trucks from dealers across Europe and worldwide</p>
      </div>

      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by brand, model, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="btn btn-primary search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
