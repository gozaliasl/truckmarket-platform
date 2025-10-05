import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Header.css';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo-link">
            <Logo size="medium" variant="full" />
          </Link>

          <nav className="nav">
            <Link to="/">Buy Trucks</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-admin">👑 Admin Panel</Link>
                ) : (
                  <Link to="/dashboard" className="btn btn-outline">Dashboard</Link>
                )}
                <Link to="/profile" className="user-info">
                  👤 {user?.name}
                  {user?.tier && <span className="tier-badge">{user.tier}</span>}
                  {user?.role === 'admin' && <span className="tier-badge admin-badge">ADMIN</span>}
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
