import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#2563eb"/>
              <path d="M10 20h20M25 15l5 5-5 5M10 12h15M10 28h15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>TruckMarket</span>
          </Link>

          <nav className="nav">
            <Link to="/">Buy Trucks</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
                <Link to="/profile" className="user-info">
                  👤 {user?.name}
                  {user?.tier && <span className="tier-badge">{user.tier}</span>}
                </Link>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Post Listing</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
