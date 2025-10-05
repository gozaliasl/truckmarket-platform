const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const JWT_SECRET = 'truckmarket-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Tier configurations
const TIER_CONFIG = {
  free: {
    listing_limit: 5,
    features: ['basic_listing', 'search', 'contact_form'],
    price: 0
  },
  premium: {
    listing_limit: 25,
    features: ['basic_listing', 'search', 'contact_form', 'featured_listings', 'priority_support', 'analytics'],
    price: 29.99
  },
  professional: {
    listing_limit: 999,
    features: ['basic_listing', 'search', 'contact_form', 'featured_listings', 'priority_support', 'analytics', 'custom_dealer_page', 'subdomain', 'custom_branding', 'api_access'],
    price: 99.99
  }
};

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Compare password
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate unique subdomain
function generateSubdomain(companyName) {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
}

// Register user
async function registerUser(userData) {
  return new Promise(async (resolve, reject) => {
    const { email, password, name, phone, company_name, tier } = userData;

    // Validate tier
    if (!['free', 'premium', 'professional'].includes(tier)) {
      return reject(new Error('Invalid tier'));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate subdomain for professional tier
    let subdomain = null;
    if (tier === 'professional' && company_name) {
      subdomain = generateSubdomain(company_name);

      // Check if subdomain is already taken
      db.get('SELECT id FROM users WHERE subdomain = ?', [subdomain], (err, row) => {
        if (row) {
          subdomain = `${subdomain}-${Date.now().toString(36)}`;
        }
      });
    }

    const tierConfig = TIER_CONFIG[tier];

    // Insert user
    db.run(
      `INSERT INTO users (email, password, name, phone, company_name, tier, subdomain, listing_limit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, phone, company_name, tier, subdomain, tierConfig.listing_limit],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return reject(new Error('Email already registered'));
          }
          return reject(err);
        }

        const userId = this.lastID;
        const token = generateToken(userId);

        // Create session
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        db.run(
          'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
          [userId, token, expiresAt.toISOString()],
          (err) => {
            if (err) return reject(err);

            resolve({
              user: {
                id: userId,
                email,
                name,
                tier,
                subdomain,
                listing_limit: tierConfig.listing_limit
              },
              token
            });
          }
        );
      }
    );
  });
}

// Login user
async function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error('Invalid credentials'));

      const isValid = await comparePassword(password, user.password);
      if (!isValid) return reject(new Error('Invalid credentials'));

      if (!user.is_active) return reject(new Error('Account is deactivated'));

      const token = generateToken(user.id);

      // Create session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      db.run(
        'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, token, expiresAt.toISOString()],
        (err) => {
          if (err) return reject(err);

          resolve({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              tier: user.tier,
              subdomain: user.subdomain,
              company_name: user.company_name,
              listing_limit: user.listing_limit
            },
            token
          });
        }
      );
    });
  });
}

// Middleware to verify authentication
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Check session
  db.get(
    'SELECT s.*, u.* FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > datetime("now")',
    [token],
    (err, session) => {
      if (err || !session) {
        return res.status(401).json({ error: 'Session expired' });
      }

      req.user = {
        id: session.user_id,
        email: session.email,
        name: session.name,
        tier: session.tier,
        subdomain: session.subdomain,
        company_name: session.company_name,
        listing_limit: session.listing_limit
      };
      next();
    }
  );
}

// Get user by ID
function getUserById(userId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error('User not found'));

      delete user.password;
      resolve(user);
    });
  });
}

// Get user by subdomain
function getUserBySubdomain(subdomain) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE subdomain = ?', [subdomain], (err, user) => {
      if (err) return reject(err);
      if (!user) return reject(new Error('Dealer not found'));

      delete user.password;
      resolve(user);
    });
  });
}

// Update user profile
function updateUserProfile(userId, updates) {
  return new Promise((resolve, reject) => {
    const allowedFields = ['name', 'phone', 'company_name', 'website', 'address', 'city', 'country', 'description', 'logo_url'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return reject(new Error('No valid fields to update'));
    }

    values.push(userId);

    db.run(
      `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function(err) {
        if (err) return reject(err);
        resolve({ updated: this.changes });
      }
    );
  });
}

module.exports = {
  registerUser,
  loginUser,
  authMiddleware,
  getUserById,
  getUserBySubdomain,
  updateUserProfile,
  TIER_CONFIG,
  generateSubdomain
};
