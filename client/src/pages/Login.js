import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  // Demo account quick login
  const quickLogin = async (email) => {
    setFormData({ email, password: 'demo123' });
    setLoading(true);
    const result = await login(email, 'demo123');
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo-container">
          <Link to="/">
            <Logo size="large" variant="full" />
          </Link>
        </div>
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Road account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Demo Accounts (Quick Login)</h3>
          <div className="demo-buttons">
            <button
              onClick={() => quickLogin('free@demo.com')}
              className="demo-btn free-demo"
              disabled={loading}
            >
              🆓 Free Account
            </button>
            <button
              onClick={() => quickLogin('premium@demo.com')}
              className="demo-btn premium-demo"
              disabled={loading}
            >
              ⭐ Premium Account
            </button>
            <button
              onClick={() => quickLogin('professional@demo.com')}
              className="demo-btn pro-demo"
              disabled={loading}
            >
              👑 Professional Account
            </button>
          </div>
          <p className="demo-note">All demo accounts use password: demo123</p>
        </div>

        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          <div className="register-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
