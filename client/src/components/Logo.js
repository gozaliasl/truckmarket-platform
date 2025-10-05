import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium', variant = 'full' }) => {
  const sizes = {
    small: { width: 120, height: 40, fontSize: '18px', iconSize: 32 },
    medium: { width: 180, height: 50, fontSize: '24px', iconSize: 40 },
    large: { width: 240, height: 70, fontSize: '32px', iconSize: 56 }
  };

  const { width, height, fontSize, iconSize } = sizes[size];

  // Icon only variant for mobile/compact spaces
  if (variant === 'icon') {
    return (
      <div className={`logo-container logo-${size}`}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none" className="logo-icon">
          {/* Stylized truck with TM letters integrated */}
          <defs>
            <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Truck cabin and cargo */}
          <rect x="8" y="20" width="20" height="24" rx="2" fill="url(#truckGradient)" />
          <rect x="28" y="16" width="28" height="28" rx="2" fill="url(#truckGradient)" />

          {/* Windows */}
          <rect x="11" y="23" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
          <rect x="19" y="23" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.8" />

          {/* TM letters on cargo */}
          <text x="32" y="34" fontSize="16" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">TM</text>

          {/* Wheels */}
          <circle cx="18" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx="38" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx="50" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />

          {/* Wheel centers */}
          <circle cx="18" cy="48" r="2" fill="#94a3b8" />
          <circle cx="38" cy="48" r="2" fill="#94a3b8" />
          <circle cx="50" cy="48" r="2" fill="#94a3b8" />

          {/* Speed lines for dynamic effect */}
          <line x1="2" y1="26" x2="6" y2="26" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="32" x2="5" y2="32" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="38" x2="4" y2="38" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`logo-container logo-${size}`}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 64 64" fill="none" className="logo-icon">
        <defs>
          <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
          </linearGradient>
        </defs>

        {/* Truck cabin and cargo */}
        <rect x="8" y="20" width="20" height="24" rx="2" fill="url(#truckGradient)" />
        <rect x="28" y="16" width="28" height="28" rx="2" fill="url(#truckGradient)" />

        {/* Windows */}
        <rect x="11" y="23" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.8" />
        <rect x="19" y="23" width="6" height="6" rx="1" fill="#60a5fa" opacity="0.8" />

        {/* TM letters on cargo */}
        <text x="32" y="34" fontSize="16" fontWeight="bold" fill="white" fontFamily="Arial, sans-serif">TM</text>

        {/* Wheels */}
        <circle cx="18" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <circle cx="38" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        <circle cx="50" cy="48" r="6" fill="#1e293b" stroke="#475569" strokeWidth="2" />

        {/* Wheel centers */}
        <circle cx="18" cy="48" r="2" fill="#94a3b8" />
        <circle cx="38" cy="48" r="2" fill="#94a3b8" />
        <circle cx="50" cy="48" r="2" fill="#94a3b8" />

        {/* Speed lines */}
        <line x1="2" y1="26" x2="6" y2="26" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="32" x2="5" y2="32" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
        <line x1="2" y1="38" x2="4" y2="38" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <div className="logo-text" style={{ fontSize }}>
        <span className="logo-truck">Truck</span>
        <span className="logo-market">Market</span>
      </div>
    </div>
  );
};

export default Logo;
