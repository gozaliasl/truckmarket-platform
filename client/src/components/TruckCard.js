import React from 'react';
import { Link } from 'react-router-dom';
import './TruckCard.css';

function TruckCard({ truck, view = 'grid' }) {
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' km';
  };

  return (
    <Link to={`/truck/${truck.id}`} className={`truck-card truck-card-${view}`}>
      <div className="truck-card-image">
        <img src={truck.image_url} alt={truck.title} />
        <div className="truck-card-badge">{truck.condition}</div>
      </div>

      <div className="truck-card-content">
        <h3 className="truck-card-title">{truck.title}</h3>

        <div className="truck-card-details">
          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="#6b7280" strokeWidth="1.5"/>
              <path d="M8 5v3l2 2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{truck.year}</span>
          </div>

          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8h-3M5 8H2M8 2v3M8 11v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{formatMileage(truck.mileage)}</span>
          </div>

          <div className="detail-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v6l4 2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{truck.engine_power} HP</span>
          </div>
        </div>

        <div className="truck-card-meta">
          <div className="location">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="#6b7280" strokeWidth="1.5"/>
              <path d="M7 13c3-3 5-5.5 5-8a5 5 0 0 0-10 0c0 2.5 2 5 5 8z" stroke="#6b7280" strokeWidth="1.5"/>
            </svg>
            <span>{truck.location}, {truck.country}</span>
          </div>

          <div className="transmission">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="3" y="2" width="8" height="10" rx="1" stroke="#6b7280" strokeWidth="1.5"/>
              <path d="M6 5h2M6 7h2M6 9h2" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{truck.transmission}</span>
          </div>
        </div>

        <div className="truck-card-footer">
          <div className="price">{formatPrice(truck.price, truck.currency)}</div>
          <div className="category-tag">{truck.category}</div>
        </div>
      </div>
    </Link>
  );
}

export default TruckCard;
