import React from 'react';
import './Logo.css';
import roadLogo from '../assets/road-logo.png';

const Logo = ({ size = 'medium', variant = 'full' }) => {
  const sizes = {
    small: { height: 80 },
    medium: { height: 140 },
    large: { height: 180 }
  };

  const { height } = sizes[size];

  // Use the new Road logo
  return (
    <div className={`logo-container logo-${size}`}>
      <img
        src={roadLogo}
        alt="Road Logo"
        className="logo-image"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};

export default Logo;
