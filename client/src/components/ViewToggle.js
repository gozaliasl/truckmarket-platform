import React from 'react';
import './ViewToggle.css';

function ViewToggle({ view, onViewChange }) {
  const handleChange = (newView) => {
    onViewChange(newView);
    localStorage.setItem('truckmarket_view', newView);
  };

  return (
    <div className="view-toggle">
      <button
        className={`view-btn ${view === 'grid' ? 'active' : ''}`}
        onClick={() => handleChange('grid')}
        title="Grid View"
        aria-label="Switch to grid view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="view-label">Grid</span>
      </button>

      <button
        className={`view-btn ${view === 'list' ? 'active' : ''}`}
        onClick={() => handleChange('list')}
        title="List View"
        aria-label="Switch to list view"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="9" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="2" y="15" width="16" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <span className="view-label">List</span>
      </button>
    </div>
  );
}

export default ViewToggle;
