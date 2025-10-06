import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', variant = 'full' }) => {
  const sizes = {
    small: { height: 50 },
    medium: { height: 70 },
    large: { height: 90 }
  };

  const { height } = sizes[size];

  // Use the new logo image
  return (
    <div className={`logo-container logo-${size}`}>
      <img
        src="/images/logo/logo.png"
        alt="TruckMarket Logo"
        className="logo-image"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default Logo;
