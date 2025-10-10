import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import AIAssistant from './AIAssistant';
import './Header.css';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme') || 'warm-sunset';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    return saved;
  });

  const [isDark, setIsDark] = React.useState(() => {
    const saved = localStorage.getItem('isDark') === 'true';
    return saved;
  });

  const [showAIAssistant, setShowAIAssistant] = React.useState(false);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('isDark', newIsDark.toString());
    
    // Apply dark variant based on current theme
    if (typeof document !== 'undefined') {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      let newTheme;
      
      if (newIsDark) {
        // Apply dark variant
        if (currentTheme === 'modern-night') {
          newTheme = 'modern-night-dark';
        } else if (currentTheme === 'playful-pop') {
          newTheme = 'playful-pop-dark';
        } else {
          newTheme = 'modern-night-dark'; // Default dark theme
        }
      } else {
        // Remove dark variant
        if (currentTheme === 'modern-night-dark') {
          newTheme = 'modern-night';
        } else if (currentTheme === 'playful-pop-dark') {
          newTheme = 'playful-pop';
        } else {
          newTheme = currentTheme.replace('-dark', '');
        }
      }
      
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const handleThemeSelect = (e) => {
    const selected = e.target.value;
    setTheme(selected);
    if (typeof document !== 'undefined') {
      // Apply dark variant if dark mode is enabled
      const finalTheme = isDark ? selected + '-dark' : selected;
      document.documentElement.setAttribute('data-theme', finalTheme);
    }
    localStorage.setItem('theme', selected);
  };

  return (
    <header className="header">
      {/* Hero Image Section */}
      <div className="header-hero-section" style={{backgroundImage: 'url(/images/hero-bg.png)'}}>
        <div className="header-hero-content">
          <h1>Road is yours!</h1>
          <p>Find, buy, and sell your future cars or trucks.</p>
        </div>
      </div>
      
      <div className="container">
        <div className="header-content">
          <nav className="nav">
            <Link to="/">Browse Vehicles</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-actions">
            <button 
              className="header-btn ai-assistant-btn" 
              onClick={() => setShowAIAssistant(true)}
              aria-label="Open AI Assistant"
            >
              🤖 AI Assistant
            </button>
            <select aria-label="Theme" value={theme} onChange={handleThemeSelect} className="header-select">
              <option value="warm-sunset">Warm Sunset</option>
              <option value="modern-night">Modern Night</option>
              <option value="classic-editorial">Classic Editorial</option>
              <option value="minimal-neutral">Minimal Neutral</option>
              <option value="playful-pop">Playful Pop</option>
            </select>
            <button className="header-btn" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <>
                    <Link to="/admin" className="btn btn-admin">👑 Admin Panel</Link>
                    <Link to="/security-dashboard" className="btn btn-outline">🛡️ Security</Link>
                    <Link to="/performance-dashboard" className="btn btn-outline">⚡ Performance</Link>
                    <Link to="/advanced-ai" className="btn btn-outline">🤖 Advanced AI</Link>
                  </>
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
      
      {showAIAssistant && (
        <AIAssistant 
          onClose={() => setShowAIAssistant(false)}
          onSearch={(searchQuery) => {
            // Handle search action
            console.log('Search query:', searchQuery);
          }}
          onRecommendation={(recommendation) => {
            // Handle recommendation action
            console.log('Recommendation:', recommendation);
          }}
        />
      )}
    </header>
  );
}

export default Header;
