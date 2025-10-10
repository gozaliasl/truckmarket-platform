import React from 'react';
import './AdvertisingSidebar.css';

function AdvertisingSidebar() {
  return (
    <div className="advertising-sidebar">
      <div className="sidebar-ad-section">
        <div className="ad-label">Advertisement</div>
        <div className="ad-placeholder ad-large">
          <div className="ad-content">
            <p className="ad-text">Your Ad Here</p>
            <p className="ad-dimensions">300x250</p>
          </div>
        </div>
      </div>

      <div className="sidebar-ad-section">
        <div className="ad-label">Sponsored</div>
        <div className="ad-placeholder ad-medium">
          <div className="ad-content">
            <p className="ad-text">Premium Placement</p>
            <p className="ad-dimensions">300x150</p>
          </div>
        </div>
      </div>

      <div className="sidebar-ad-section">
        <div className="ad-label">Featured Partner</div>
        <div className="ad-placeholder ad-medium">
          <div className="ad-content">
            <p className="ad-text">Partner Ad Space</p>
            <p className="ad-dimensions">300x150</p>
          </div>
        </div>
      </div>

      <div className="sidebar-ad-section">
        <div className="ad-label">Advertisement</div>
        <div className="ad-placeholder ad-large">
          <div className="ad-content">
            <p className="ad-text">Your Ad Here</p>
            <p className="ad-dimensions">300x250</p>
          </div>
        </div>
      </div>

      <div className="advertising-info">
        <h4>📢 Advertise With Us</h4>
        <p>Reach millions of vehicle buyers and sellers. Contact us for premium advertising opportunities.</p>
        <button className="contact-ad-btn">Contact Sales</button>
      </div>
    </div>
  );
}

export default AdvertisingSidebar;
