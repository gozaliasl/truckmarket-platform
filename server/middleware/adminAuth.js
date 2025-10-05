const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'trucks.db');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to check if user is authenticated as admin
const requireAdmin = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Check if user is admin
      const db = new sqlite3.Database(dbPath);
      db.get(
        'SELECT id, email, name, role FROM users WHERE id = ?',
        [decoded.userId],
        (err, user) => {
          db.close();

          if (err || !user) {
            return res.status(401).json({ error: 'User not found' });
          }

          if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
          }

          // Attach user info to request
          req.user = user;
          next();
        }
      );
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Middleware to check if current user is admin (for client-side checks)
const checkAdminStatus = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.isAdmin = false;
      return next();
    }

    const token = authHeader.substring(7);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        req.isAdmin = false;
        return next();
      }

      const db = new sqlite3.Database(dbPath);
      db.get(
        'SELECT role FROM users WHERE id = ?',
        [decoded.userId],
        (err, user) => {
          db.close();
          req.isAdmin = user && user.role === 'admin';
          next();
        }
      );
    });
  } catch (error) {
    req.isAdmin = false;
    next();
  }
};

module.exports = { requireAdmin, checkAdminStatus };
