import React, { useState } from 'react';
import './AdvancedFilterPanel.css';

function AdvancedFilterPanel({ advancedFilters, onAdvancedFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({
    basicData: false,
    engine: false,
    features: false,
    offerDetails: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (section, filterName, value) => {
    onAdvancedFilterChange({
      ...advancedFilters,
      [section]: {
        ...advancedFilters[section],
        [filterName]: value
      }
    });
  };

  const sections = [
    {
      id: 'basicData',
      title: 'Basic Data',
      icon: '📋',
      filters: [
        { name: 'fuelType', label: 'Fuel Type', type: 'select', options: ['Any', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'CNG'] },
        { name: 'transmission', label: 'Transmission', type: 'select', options: ['Any', 'Automatic', 'Manual', 'Semi-Automatic'] },
        { name: 'color', label: 'Color', type: 'select', options: ['Any', 'White', 'Black', 'Silver', 'Red', 'Blue', 'Green', 'Yellow'] },
        { name: 'axleConfiguration', label: 'Axle Config', type: 'select', options: ['Any', '4x2', '4x4', '6x2', '6x4', '8x4'] }
      ]
    },
    {
      id: 'engine',
      title: 'Engine',
      icon: '⚙️',
      filters: [
        { name: 'engineSizeFrom', label: 'Engine Size From (L)', type: 'number', placeholder: 'e.g. 10' },
        { name: 'engineSizeTo', label: 'Engine Size To (L)', type: 'number', placeholder: 'e.g. 16' },
        { name: 'emissionClass', label: 'Emission Class', type: 'select', options: ['Any', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6'] },
        { name: 'retarder', label: 'Retarder', type: 'select', options: ['Any', 'Yes', 'No'] }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      icon: '✨',
      filters: [
        { name: 'airConditioning', label: 'Air Conditioning', type: 'select', options: ['Any', 'Yes', 'No'] },
        { name: 'cruiseControl', label: 'Cruise Control', type: 'select', options: ['Any', 'Yes', 'No'] },
        { name: 'parkingHeater', label: 'Parking Heater', type: 'select', options: ['Any', 'Yes', 'No'] },
        { name: 'gpsNavigation', label: 'GPS Navigation', type: 'select', options: ['Any', 'Yes', 'No'] }
      ]
    },
    {
      id: 'offerDetails',
      title: 'Offer Details',
      icon: '📝',
      filters: [
        { name: 'serviceHistory', label: 'Service History', type: 'select', options: ['Any', 'Full', 'Partial', 'None'] },
        { name: 'accidentFree', label: 'Accident Free', type: 'select', options: ['Any', 'Yes', 'No'] },
        { name: 'warranty', label: 'Warranty', type: 'select', options: ['Any', 'Yes', 'No'] },
        { name: 'previousOwners', label: 'Previous Owners', type: 'number', placeholder: 'Max owners' }
      ]
    }
  ];

  return (
    <div className="advanced-filter-panel">
      <div className="advanced-filter-header">
        <h3>🔍 Advanced Filters</h3>
        <button
          className="reset-advanced-btn"
          onClick={() => onAdvancedFilterChange({})}
        >
          Reset All
        </button>
      </div>

      {sections.map(section => (
        <div key={section.id} className="filter-accordion-section">
          <button
            className={`accordion-header ${expandedSections[section.id] ? 'expanded' : ''}`}
            onClick={() => toggleSection(section.id)}
          >
            <span className="accordion-title">
              <span className="accordion-icon">{section.icon}</span>
              {section.title}
            </span>
            <span className="accordion-arrow">{expandedSections[section.id] ? '▼' : '▶'}</span>
          </button>

          {expandedSections[section.id] && (
            <div className="accordion-content">
              <div className="filter-grid">
                {section.filters.map(filter => (
                  <div key={filter.name} className="filter-field">
                    <label>{filter.label}</label>
                    {filter.type === 'select' ? (
                      <select
                        value={advancedFilters[section.id]?.[filter.name] || 'Any'}
                        onChange={(e) => handleFilterChange(section.id, filter.name, e.target.value)}
                      >
                        {filter.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={filter.type}
                        placeholder={filter.placeholder}
                        value={advancedFilters[section.id]?.[filter.name] || ''}
                        onChange={(e) => handleFilterChange(section.id, filter.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AdvancedFilterPanel;
