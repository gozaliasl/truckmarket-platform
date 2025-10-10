import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1>About RoadName</h1>
          <p>Europe's Leading Online Marketplace for Commercial Vehicles</p>
        </div>
      </div>

      <div className="container about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            RoadName is dedicated to connecting vehicle buyers and sellers across Europe and worldwide.
            We provide a transparent, efficient, and trustworthy platform for trading commercial vehicles,
            making it easier than ever to buy or sell trucks, trailers, and heavy equipment.
          </p>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">200,000+</div>
            <div className="stat-label">Daily Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">80,000</div>
            <div className="stat-label">Units Sold Monthly</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">80</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">7M+</div>
            <div className="stat-label">Monthly Visitors</div>
          </div>
        </section>

        <section className="about-section">
          <h2>Why Choose RoadName?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Reach</h3>
              <p>Access to buyers and sellers from 80 countries worldwide</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Trading</h3>
              <p>Verified sellers and secure payment options</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Market Insights</h3>
              <p>Real-time pricing data and market analytics</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Transactions</h3>
              <p>Quick listing approval and efficient communication</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Services</h2>
          <ul className="services-list">
            <li>Buy and sell trucks, trailers, and commercial vehicles</li>
            <li>Professional dealer accounts with custom branding</li>
            <li>Featured listings and premium advertising</li>
            <li>Market analytics and insights</li>
            <li>Financing and insurance partnerships</li>
            <li>International shipping assistance</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Join Our Growing Community</h2>
          <p>
            Whether you're an individual seller, a professional dealer, or a fleet manager,
            RoadName has the right solution for you. Start with a free account or upgrade
            to Premium or Professional for advanced features.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
