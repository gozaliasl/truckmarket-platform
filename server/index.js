const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./database');
const simpleAIRoutes = require('./routes/simpleAIRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const securityRoutes = require('./routes/securityRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const advancedAIRoutes = require('./routes/advancedAIRoutes');
const { 
  cacheVehicles, 
  cacheUser, 
  cacheSearch, 
  cacheAI,
  invalidateVehicleCache,
  invalidateUserCache
} = require('./middleware/caching');
const {
  registerUser,
  loginUser,
  authMiddleware,
  getUserById,
  getUserBySubdomain,
  updateUserProfile,
  TIER_CONFIG
} = require('./auth');
const {
  sanitizeInput,
  validateUserRegistration,
  validateUserLogin,
  validateVehicleListing,
  validateAIChat,
  preventSQLInjection
} = require('./middleware/validation');
const {
  rateLimitMonitor,
  authMonitoring,
  suspiciousActivityMonitor,
  fileUploadMonitor,
  errorMonitoring,
  securityHeadersMonitor
} = require('./middleware/securityMonitoring');
const {
  encryptSensitiveData,
  decryptSensitiveData,
  encryptUserData,
  decryptUserData
} = require('./middleware/databaseEncryption');

const app = express();
const PORT = process.env.PORT || 5001;

// Security Headers Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true,
});

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:5001',
      'https://yourdomain.com', // Replace with your production domain
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(sanitizeInput);
app.use(preventSQLInjection);
app.use(rateLimitMonitor);
app.use(authMonitoring);
app.use(suspiciousActivityMonitor);
app.use(fileUploadMonitor);
app.use(securityHeadersMonitor);

// Additional Security Headers
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
});

// ============= AUTH ROUTES =============

// Register user
app.post('/api/auth/register', authLimiter, validateUserRegistration, encryptUserData, async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', authLimiter, validateUserLogin, async (req, res) => {
  try {
    const { email, password, mfaToken } = req.body;
    const result = await loginUser(email, password, mfaToken);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, decryptUserData, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update user profile
app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  try {
    const result = await updateUserProfile(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tier information
app.get('/api/tiers', (req, res) => {
  res.json(TIER_CONFIG);
});

// ============= USER/DEALER ROUTES =============

// Get dealer by subdomain
app.get('/api/dealers/:subdomain', async (req, res) => {
  try {
    const dealer = await getUserBySubdomain(req.params.subdomain);
    res.json(dealer);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get dealer's trucks
app.get('/api/dealers/:subdomain/trucks', (req, res) => {
  db.get('SELECT id FROM users WHERE subdomain = ?', [req.params.subdomain], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    db.all(
      'SELECT * FROM trucks WHERE user_id = ? AND status = ? ORDER BY created_at DESC',
      [user.id, 'active'],
      (err, trucks) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ trucks, total: trucks.length });
      }
    );
  });
});

// Get all trucks with filters
app.get('/api/trucks', cacheVehicles, (req, res) => {
  const {
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    category,
    country,
    condition,
    transmission,
    fuelType,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = req.query;

  let query = 'SELECT * FROM trucks WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND brand = ?';
    params.push(brand);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  if (minYear) {
    query += ' AND year >= ?';
    params.push(parseInt(minYear));
  }

  if (maxYear) {
    query += ' AND year <= ?';
    params.push(parseInt(maxYear));
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }

  if (condition) {
    query += ' AND condition = ?';
    params.push(condition);
  }

  if (transmission) {
    query += ' AND transmission = ?';
    params.push(transmission);
  }

  if (fuelType) {
    query += ' AND fuel_type = ?';
    params.push(fuelType);
  }

  if (search) {
    query += ' AND (title LIKE ? OR brand LIKE ? OR model LIKE ? OR description LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  // Add sorting
  const allowedSortColumns = ['price', 'year', 'mileage', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order}`;

  // Add pagination
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get total count - rebuild the query without LIMIT/OFFSET
    let countQuery = 'SELECT COUNT(*) as total FROM trucks WHERE 1=1';
    const countParams = [];

    if (brand) {
      countQuery += ' AND brand = ?';
      countParams.push(brand);
    }
    if (minPrice) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }
    if (minYear) {
      countQuery += ' AND year >= ?';
      countParams.push(parseInt(minYear));
    }
    if (maxYear) {
      countQuery += ' AND year <= ?';
      countParams.push(parseInt(maxYear));
    }
    if (category) {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }
    if (country) {
      countQuery += ' AND country = ?';
      countParams.push(country);
    }
    if (condition) {
      countQuery += ' AND condition = ?';
      countParams.push(condition);
    }
    if (transmission) {
      countQuery += ' AND transmission = ?';
      countParams.push(transmission);
    }
    if (fuelType) {
      countQuery += ' AND fuel_type = ?';
      countParams.push(fuelType);
    }
    if (search) {
      countQuery += ' AND (title LIKE ? OR brand LIKE ? OR model LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        trucks: rows,
        total: countRow.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    });
  });
});

// Get single truck by ID
app.get('/api/trucks/:id', cacheUser, (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM trucks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Truck not found' });
      return;
    }
    res.json(row);
  });
});

// Get unique filter values
app.get('/api/filters', (req, res) => {
  const filters = {};

  db.all('SELECT DISTINCT brand FROM trucks ORDER BY brand', [], (err, brands) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    filters.brands = brands.map(b => b.brand);

    db.all('SELECT DISTINCT category FROM trucks ORDER BY category', [], (err, categories) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      filters.categories = categories.map(c => c.category);

      db.all('SELECT DISTINCT country FROM trucks ORDER BY country', [], (err, countries) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        filters.countries = countries.map(c => c.country);

        db.all('SELECT MIN(price) as min, MAX(price) as max FROM trucks', [], (err, priceRange) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          filters.priceRange = priceRange[0];

          db.all('SELECT MIN(year) as min, MAX(year) as max FROM trucks', [], (err, yearRange) => {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }
            filters.yearRange = yearRange[0];

            res.json(filters);
          });
        });
      });
    });
  });
});

// Create contact/inquiry
app.post('/api/contacts', (req, res) => {
  const { truck_id, name, email, phone, message } = req.body;

  db.run(
    'INSERT INTO contacts (truck_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
    [truck_id, name, email, phone, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Contact saved successfully' });
    }
  );
});

// ============= USER TRUCK MANAGEMENT =============

// Get user's own listings
app.get('/api/my-trucks', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM trucks WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, trucks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ trucks, total: trucks.length });
    }
  );
});

// Get single truck listing (owned by user)
app.get('/api/my-trucks/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.get(
    'SELECT * FROM trucks WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    (err, truck) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!truck) {
        return res.status(404).json({ error: 'Truck not found or unauthorized' });
      }
      res.json(truck);
    }
  );
});

// Create new truck listing
app.post('/api/my-trucks', authMiddleware, (req, res) => {
  const {
    title, brand, model, year, price, currency, mileage, condition,
    location, country, category, engine_power, transmission, fuel_type,
    axle_configuration, color, description, image_url
  } = req.body;

  // Check listing limit
  db.get('SELECT COUNT(*) as count FROM trucks WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row.count >= req.user.listing_limit) {
      return res.status(403).json({
        error: `Listing limit reached. Your ${req.user.tier} tier allows ${req.user.listing_limit} listings.`
      });
    }

    // Insert truck
    db.run(
      `INSERT INTO trucks (
        user_id, title, brand, model, year, price, currency, mileage, condition,
        location, country, category, engine_power, transmission, fuel_type,
        axle_configuration, color, description, seller_name, seller_phone,
        seller_email, image_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id, title, brand, model, year, price, currency, mileage, condition,
        location, country, category, engine_power, transmission, fuel_type,
        axle_configuration, color, description, req.user.name, req.user.phone,
        req.user.email, image_url, 'active'
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, message: 'Truck listing created successfully' });
      }
    );
  });
});

// Update truck listing
app.put('/api/my-trucks/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  // Verify ownership
  db.get('SELECT * FROM trucks WHERE id = ? AND user_id = ?', [id, req.user.id], (err, truck) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!truck) {
      return res.status(404).json({ error: 'Truck not found or unauthorized' });
    }

    const allowedFields = [
      'title', 'brand', 'model', 'year', 'price', 'currency', 'mileage', 'condition',
      'location', 'country', 'category', 'engine_power', 'transmission', 'fuel_type',
      'axle_configuration', 'color', 'description', 'image_url', 'status'
    ];

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(req.body)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id, req.user.id);

    db.run(
      `UPDATE trucks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      values,
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ updated: this.changes, message: 'Truck updated successfully' });
      }
    );
  });
});

// Delete truck listing
app.delete('/api/my-trucks/:id', authMiddleware, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM trucks WHERE id = ? AND user_id = ?',
    [id, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Truck not found or unauthorized' });
      }
      res.json({ message: 'Truck deleted successfully' });
    }
  );
});

// Get user dashboard stats
app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as count FROM trucks WHERE user_id = ?', [req.user.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.total_listings = row.count;
    stats.remaining_listings = req.user.listing_limit - row.count;

    db.get('SELECT SUM(views) as total FROM trucks WHERE user_id = ?', [req.user.id], (err, row) => {
      stats.total_views = row.total || 0;

      db.get('SELECT COUNT(*) as count FROM contacts c JOIN trucks t ON c.truck_id = t.id WHERE t.user_id = ?', [req.user.id], (err, row) => {
        stats.total_inquiries = row.count || 0;

        res.json(stats);
      });
    });
  });
});

// ============================================
// AI-POWERED ENDPOINTS
// ============================================
const aiRecommendations = require('./ai/recommendations');

// Get AI recommendations for a specific truck
app.get('/api/ai/recommendations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const recommendations = await aiRecommendations.getRecommendations(id, limit);
    res.json({ recommendations, count: recommendations.length });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get trending vehicles
app.get('/api/ai/trending', async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    const trending = await aiRecommendations.getTrending(category, parseInt(limit));
    res.json({ trending, count: trending.length });
  } catch (error) {
    console.error('AI Trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending vehicles' });
  }
});

// AI Price Estimation
app.post('/api/ai/price-estimate', (req, res) => {
  try {
    const vehicle = req.body;
    const estimation = aiRecommendations.estimatePrice(vehicle);

    // Determine price status
    let priceStatus = 'fair';
    if (vehicle.price < estimation.price_range_min) {
      priceStatus = 'good_deal';
    } else if (vehicle.price > estimation.price_range_max) {
      priceStatus = 'overpriced';
    }

    res.json({
      ...estimation,
      actual_price: vehicle.price,
      price_status: priceStatus,
      difference: vehicle.price - estimation.estimated_price,
      difference_percent: ((vehicle.price - estimation.estimated_price) / estimation.estimated_price * 100).toFixed(1)
    });
  } catch (error) {
    console.error('AI Price Estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate price' });
  }
});

// Calculate match score
app.post('/api/ai/match-score', (req, res) => {
  try {
    const { vehicle, preferences } = req.body;
    const matchScore = aiRecommendations.calculateMatchScore(vehicle, preferences);

    res.json({
      match_score: matchScore,
      match_level: matchScore >= 80 ? 'excellent' : matchScore >= 60 ? 'good' : matchScore >= 40 ? 'fair' : 'poor'
    });
  } catch (error) {
    console.error('AI Match Score error:', error);
    res.status(500).json({ error: 'Failed to calculate match score' });
  }
});

// Natural language smart search
app.post('/api/ai/smart-search', (req, res) => {
  try {
    const { query } = req.body;
    const parsed = aiRecommendations.parseNaturalLanguageQuery(query);

    res.json({
      original_query: query,
      parsed_filters: parsed,
      message: 'Query parsed successfully. Apply these filters to search.'
    });
  } catch (error) {
    console.error('AI Smart Search error:', error);
    res.status(500).json({ error: 'Failed to parse search query' });
  }
});

// ============================================
// PHASE 2: SEARCH HISTORY & SAVED SEARCHES
// ============================================
const searchFeatures = require('./ai/searchFeatures');

// Record search history
app.post('/api/search-history', authMiddleware, async (req, res) => {
  try {
    const { search_query, filters, results_count, clicked_truck_id } = req.body;
    const result = await searchFeatures.recordSearchHistory(
      req.user.id,
      search_query,
      filters,
      results_count,
      clicked_truck_id
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record search history' });
  }
});

// Get search history
app.get('/api/search-history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await searchFeatures.getSearchHistory(req.user.id, limit);
    res.json({ history, count: history.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// Get popular searches
app.get('/api/search-history/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const popular = await searchFeatures.getPopularSearches(limit);
    res.json({ popular_searches: popular, count: popular.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular searches' });
  }
});

// Create saved search
app.post('/api/saved-searches', authMiddleware, async (req, res) => {
  try {
    const { name, search_query, filters, notification_enabled } = req.body;
    const result = await searchFeatures.createSavedSearch(
      req.user.id,
      name,
      search_query,
      filters,
      notification_enabled
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create saved search' });
  }
});

// Get saved searches
app.get('/api/saved-searches', authMiddleware, async (req, res) => {
  try {
    const searches = await searchFeatures.getSavedSearches(req.user.id);
    res.json({ saved_searches: searches, count: searches.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved searches' });
  }
});

// Update saved search
app.put('/api/saved-searches/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await searchFeatures.updateSavedSearch(req.user.id, id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update saved search' });
  }
});

// Delete saved search
app.delete('/api/saved-searches/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await searchFeatures.deleteSavedSearch(req.user.id, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete saved search' });
  }
});

// Add to favorites
app.post('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const { truck_id, notes } = req.body;
    const result = await searchFeatures.addFavorite(req.user.id, truck_id, notes);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove from favorites
app.delete('/api/favorites/:truckId', authMiddleware, async (req, res) => {
  try {
    const { truckId } = req.params;
    const result = await searchFeatures.removeFavorite(req.user.id, truckId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Get favorites
app.get('/api/favorites', authMiddleware, async (req, res) => {
  try {
    const favorites = await searchFeatures.getFavorites(req.user.id);
    res.json({ favorites, count: favorites.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Check if truck is favorited
app.get('/api/favorites/:truckId/status', authMiddleware, async (req, res) => {
  try {
    const { truckId } = req.params;
    const isFavorited = await searchFeatures.isFavorited(req.user.id, truckId);
    res.json({ is_favorited: isFavorited });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check favorite status' });
  }
});

// Get personalized recommendations
app.get('/api/ai/personalized', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recommendations = await searchFeatures.getPersonalizedRecommendations(req.user.id, limit);
    res.json({ recommendations, count: recommendations.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch personalized recommendations' });
  }
});

// ============================================
// PHASE 3: CHATBOT ASSISTANT
// ============================================
const chatbot = require('./ai/chatbot');

// Chatbot conversation endpoint
app.post('/api/chatbot', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await chatbot.processMessage(message, context || {});
    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      message: "I'm having trouble processing that. Could you rephrase?",
      error: true
    });
  }
});

// ============================================
// PHASE 3 & 4: PRICE TRACKING & ANALYTICS
// ============================================
const priceAnalytics = require('./ai/priceAnalytics');

// Create price alert
app.post('/api/price-alerts', authMiddleware, async (req, res) => {
  try {
    const { truck_id, threshold_percent } = req.body;
    const result = await priceAnalytics.createPriceAlert(req.user.id, truck_id, threshold_percent);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// Get user's price alerts
app.get('/api/price-alerts', authMiddleware, async (req, res) => {
  try {
    const alerts = await priceAnalytics.getPriceAlerts(req.user.id);
    res.json({ alerts, count: alerts.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
});

// Delete price alert
app.delete('/api/price-alerts/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await priceAnalytics.deletePriceAlert(req.user.id, id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete price alert' });
  }
});

// Get price history for a truck
app.get('/api/trucks/:id/price-history', async (req, res) => {
  try {
    const { id } = req.params;
    const history = await priceAnalytics.getPriceHistory(id);
    res.json({ price_history: history, count: history.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

// Get market insights
app.get('/api/ai/market-insights', async (req, res) => {
  try {
    const { category, brand } = req.query;
    const insights = await priceAnalytics.getMarketInsights(category, brand);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market insights' });
  }
});

// Get price trends
app.get('/api/ai/price-trends', async (req, res) => {
  try {
    const { category, days = 30 } = req.query;
    const trends = await priceAnalytics.getPriceTrends(category, parseInt(days));
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price trends' });
  }
});

// Predict best time to buy
app.post('/api/ai/best-time-to-buy', async (req, res) => {
  try {
    const { truck_id, category, brand } = req.body;
    const prediction = await priceAnalytics.predictBestTimeToBuy(truck_id, category, brand);
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict best time to buy' });
  }
});

// ============= ADMIN ROUTES =============
const { requireAdmin } = require('./middleware/adminAuth');

// Get all users (admin only)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, search = '', role = '' } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT id, email, name, phone, company_name, tier, role, is_verified, is_active, listing_limit, created_at FROM users WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
  const params = [];
  const countParams = [];

  if (search) {
    query += ' AND (email LIKE ? OR name LIKE ? OR company_name LIKE ?)';
    countQuery += ' AND (email LIKE ? OR name LIKE ? OR company_name LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
    countParams.push(searchPattern, searchPattern, searchPattern);
  }

  if (role) {
    query += ' AND role = ?';
    countQuery += ' AND role = ?';
    params.push(role);
    countParams.push(role);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.get(countQuery, countParams, (err, countRow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.all(query, params, (err, users) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        users,
        total: countRow.total,
        page: parseInt(page),
        totalPages: Math.ceil(countRow.total / limit)
      });
    });
  });
});

// Get all trucks (admin only)
app.get('/api/admin/trucks', requireAdmin, (req, res) => {
  const { page = 1, limit = 20, status = '', category = '' } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT t.*, u.email as user_email, u.name as user_name FROM trucks t LEFT JOIN users u ON t.user_id = u.id WHERE 1=1';
  let countQuery = 'SELECT COUNT(*) as total FROM trucks WHERE 1=1';
  const params = [];
  const countParams = [];

  if (status) {
    query += ' AND t.status = ?';
    countQuery += ' AND status = ?';
    params.push(status);
    countParams.push(status);
  }

  if (category) {
    query += ' AND t.category = ?';
    countQuery += ' AND category = ?';
    params.push(category);
    countParams.push(category);
  }

  query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.get(countQuery, countParams, (err, countRow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.all(query, params, (err, trucks) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({
        trucks,
        total: countRow.total,
        page: parseInt(page),
        totalPages: Math.ceil(countRow.total / limit)
      });
    });
  });
});

// Get platform statistics (admin only)
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const stats = {};

  // Get total users by role
  db.get('SELECT COUNT(*) as total FROM users', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalUsers = result.total;

    db.get('SELECT COUNT(*) as total FROM users WHERE role = ?', ['admin'], (err, result) => {
      stats.totalAdmins = result.total;

      // Get users by tier
      db.all('SELECT tier, COUNT(*) as count FROM users GROUP BY tier', (err, tiers) => {
        stats.usersByTier = tiers || [];

        // Get total trucks
        db.get('SELECT COUNT(*) as total FROM trucks', (err, result) => {
          stats.totalTrucks = result.total;

          // Get trucks by status
          db.all('SELECT status, COUNT(*) as count FROM trucks GROUP BY status', (err, statuses) => {
            stats.trucksByStatus = statuses || [];

            // Get trucks by category
            db.all('SELECT category, COUNT(*) as count FROM trucks GROUP BY category ORDER BY count DESC', (err, categories) => {
              stats.trucksByCategory = categories || [];

              // Get recent registrations (last 30 days)
              db.get(`SELECT COUNT(*) as count FROM users WHERE created_at >= datetime('now', '-30 days')`, (err, result) => {
                stats.recentRegistrations = result.count;

                // Get active listings (last 30 days)
                db.get(`SELECT COUNT(*) as count FROM trucks WHERE created_at >= datetime('now', '-30 days')`, (err, result) => {
                  stats.recentListings = result.count;

                  res.json(stats);
                });
              });
            });
          });
        });
      });
    });
  });
});

// Update user status (admin only)
app.put('/api/admin/users/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { is_active, is_verified } = req.body;

  const updates = [];
  const params = [];

  if (typeof is_active !== 'undefined') {
    updates.push('is_active = ?');
    params.push(is_active ? 1 : 0);
  }

  if (typeof is_verified !== 'undefined') {
    updates.push('is_verified = ?');
    params.push(is_verified ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No updates provided' });
  }

  params.push(id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ success: true, message: 'User status updated' });
    }
  );
});

// Update truck status (admin only)
app.put('/api/admin/trucks/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'sold', 'pending', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run(
    'UPDATE trucks SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Truck not found' });
      }
      res.json({ success: true, message: 'Truck status updated' });
    }
  );
});

// Delete user (admin only)
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  // Don't allow deleting admin users
  db.get('SELECT role FROM users WHERE id = ?', [id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete user's trucks first
    db.run('DELETE FROM trucks WHERE user_id = ?', [id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Delete user
      db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'User and their listings deleted' });
      });
    });
  });
});

// Delete truck (admin only)
app.delete('/api/admin/trucks/:id', requireAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM trucks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Truck not found' });
    }
    res.json({ success: true, message: 'Truck listing deleted' });
  });
});

// ============= CARS API ENDPOINTS =============

// Get all cars with filters
app.get('/api/cars', (req, res) => {
  const {
    brand,
    model,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    bodyType,
    fuelType,
    transmission,
    maxMileage,
    condition,
    search,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = req.query;

  let query = 'SELECT * FROM cars WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND brand LIKE ?';
    params.push(`%${brand}%`);
  }

  if (model) {
    query += ' AND model LIKE ?';
    params.push(`%${model}%`);
  }

  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }

  if (minYear) {
    query += ' AND year >= ?';
    params.push(parseInt(minYear));
  }

  if (maxYear) {
    query += ' AND year <= ?';
    params.push(parseInt(maxYear));
  }

  if (bodyType) {
    query += ' AND body_type = ?';
    params.push(bodyType);
  }

  if (fuelType) {
    query += ' AND fuel_type = ?';
    params.push(fuelType);
  }

  if (transmission) {
    query += ' AND transmission = ?';
    params.push(transmission);
  }

  if (maxMileage) {
    query += ' AND mileage <= ?';
    params.push(parseInt(maxMileage));
  }

  if (condition) {
    query += ' AND condition = ?';
    params.push(condition);
  }

  if (search) {
    query += ' AND (brand LIKE ? OR model LIKE ? OR description LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Add sorting
  const allowedSortColumns = ['price', 'year', 'mileage', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order}`;

  // Add pagination
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM cars WHERE 1=1';
    const countParams = [];

    if (brand) {
      countQuery += ' AND brand LIKE ?';
      countParams.push(`%${brand}%`);
    }
    if (model) {
      countQuery += ' AND model LIKE ?';
      countParams.push(`%${model}%`);
    }
    if (minPrice) {
      countQuery += ' AND price >= ?';
      countParams.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      countQuery += ' AND price <= ?';
      countParams.push(parseFloat(maxPrice));
    }
    if (minYear) {
      countQuery += ' AND year >= ?';
      countParams.push(parseInt(minYear));
    }
    if (maxYear) {
      countQuery += ' AND year <= ?';
      countParams.push(parseInt(maxYear));
    }
    if (bodyType) {
      countQuery += ' AND body_type = ?';
      countParams.push(bodyType);
    }
    if (fuelType) {
      countQuery += ' AND fuel_type = ?';
      countParams.push(fuelType);
    }
    if (transmission) {
      countQuery += ' AND transmission = ?';
      countParams.push(transmission);
    }
    if (maxMileage) {
      countQuery += ' AND mileage <= ?';
      countParams.push(parseInt(maxMileage));
    }
    if (condition) {
      countQuery += ' AND condition = ?';
      countParams.push(condition);
    }
    if (search) {
      countQuery += ' AND (brand LIKE ? OR model LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        cars: rows,
        total: countRow.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    });
  });
});

// Get single car by ID
app.get('/api/cars/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM cars WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Car not found' });
      return;
    }
    res.json(row);
  });
});

// ============= MOTORCYCLES API ENDPOINTS =============

// Get all motorcycles with filters
app.get('/api/motorcycles', (req, res) => {
  const {
    brand,
    model,
    type,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    maxMileage,
    condition,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = req.query;

  let query = 'SELECT * FROM motorcycles WHERE 1=1';
  const params = [];

  if (brand) {
    query += ' AND brand LIKE ?';
    params.push(`%${brand}%`);
  }
  if (model) {
    query += ' AND model LIKE ?';
    params.push(`%${model}%`);
  }
  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(parseFloat(maxPrice));
  }
  if (minYear) {
    query += ' AND year >= ?';
    params.push(parseInt(minYear));
  }
  if (maxYear) {
    query += ' AND year <= ?';
    params.push(parseInt(maxYear));
  }
  if (maxMileage) {
    query += ' AND mileage <= ?';
    params.push(parseInt(maxMileage));
  }
  if (condition) {
    query += ' AND condition = ?';
    params.push(condition);
  }

  const allowedSortColumns = ['price', 'year', 'mileage', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order}`;
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let countQuery = 'SELECT COUNT(*) as total FROM motorcycles WHERE 1=1';
    const countParams = [];
    if (brand) { countQuery += ' AND brand LIKE ?'; countParams.push(`%${brand}%`); }
    if (model) { countQuery += ' AND model LIKE ?'; countParams.push(`%${model}%`); }
    if (type) { countQuery += ' AND type = ?'; countParams.push(type); }
    if (minPrice) { countQuery += ' AND price >= ?'; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countQuery += ' AND price <= ?'; countParams.push(parseFloat(maxPrice)); }
    if (minYear) { countQuery += ' AND year >= ?'; countParams.push(parseInt(minYear)); }
    if (maxYear) { countQuery += ' AND year <= ?'; countParams.push(parseInt(maxYear)); }
    if (maxMileage) { countQuery += ' AND mileage <= ?'; countParams.push(parseInt(maxMileage)); }
    if (condition) { countQuery += ' AND condition = ?'; countParams.push(condition); }

    db.get(countQuery, countParams, (err, countRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ motorcycles: rows, total: countRow.total, limit: parseInt(limit), offset: parseInt(offset) });
    });
  });
});

// Get single motorcycle by ID
app.get('/api/motorcycles/:id', (req, res) => {
  db.get('SELECT * FROM motorcycles WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Motorcycle not found' });
    res.json(row);
  });
});

// ============= E-BIKES API ENDPOINTS =============

// Get all e-bikes
app.get('/api/ebikes', (req, res) => {
  const {
    brand,
    type,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    condition,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = req.query;

  let query = 'SELECT * FROM ebikes WHERE 1=1';
  const params = [];

  if (brand) { query += ' AND brand LIKE ?'; params.push(`%${brand}%`); }
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (minPrice) { query += ' AND price >= ?'; params.push(parseFloat(minPrice)); }
  if (maxPrice) { query += ' AND price <= ?'; params.push(parseFloat(maxPrice)); }
  if (minYear) { query += ' AND year >= ?'; params.push(parseInt(minYear)); }
  if (maxYear) { query += ' AND year <= ?'; params.push(parseInt(maxYear)); }
  if (condition) { query += ' AND condition = ?'; params.push(condition); }

  const allowedSortColumns = ['price', 'year', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let countQuery = 'SELECT COUNT(*) as total FROM ebikes WHERE 1=1';
    const countParams = [];
    if (brand) { countQuery += ' AND brand LIKE ?'; countParams.push(`%${brand}%`); }
    if (type) { countQuery += ' AND type = ?'; countParams.push(type); }
    if (minPrice) { countQuery += ' AND price >= ?'; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countQuery += ' AND price <= ?'; countParams.push(parseFloat(maxPrice)); }
    if (minYear) { countQuery += ' AND year >= ?'; countParams.push(parseInt(minYear)); }
    if (maxYear) { countQuery += ' AND year <= ?'; countParams.push(parseInt(maxYear)); }
    if (condition) { countQuery += ' AND condition = ?'; countParams.push(condition); }

    db.get(countQuery, countParams, (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ebikes: rows, total: countRow.total, limit: parseInt(limit), offset: parseInt(offset) });
    });
  });
});

// Get single e-bike by ID
app.get('/api/ebikes/:id', (req, res) => {
  db.get('SELECT * FROM ebikes WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'E-Bike not found' });
    res.json(row);
  });
});

// ============= CARAVANS API ENDPOINTS =============

// Get all caravans
app.get('/api/caravans', (req, res) => {
  const {
    brand,
    type,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    condition,
    sortBy = 'created_at',
    sortOrder = 'DESC',
    limit = 50,
    offset = 0
  } = req.query;

  let query = 'SELECT * FROM caravans WHERE 1=1';
  const params = [];

  if (brand) { query += ' AND brand LIKE ?'; params.push(`%${brand}%`); }
  if (type) { query += ' AND type = ?'; params.push(type); }
  if (minPrice) { query += ' AND price >= ?'; params.push(parseFloat(minPrice)); }
  if (maxPrice) { query += ' AND price <= ?'; params.push(parseFloat(maxPrice)); }
  if (minYear) { query += ' AND year >= ?'; params.push(parseInt(minYear)); }
  if (maxYear) { query += ' AND year <= ?'; params.push(parseInt(maxYear)); }
  if (condition) { query += ' AND condition = ?'; params.push(condition); }

  const allowedSortColumns = ['price', 'year', 'created_at'];
  const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let countQuery = 'SELECT COUNT(*) as total FROM caravans WHERE 1=1';
    const countParams = [];
    if (brand) { countQuery += ' AND brand LIKE ?'; countParams.push(`%${brand}%`); }
    if (type) { countQuery += ' AND type = ?'; countParams.push(type); }
    if (minPrice) { countQuery += ' AND price >= ?'; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countQuery += ' AND price <= ?'; countParams.push(parseFloat(maxPrice)); }
    if (minYear) { countQuery += ' AND year >= ?'; countParams.push(parseInt(minYear)); }
    if (maxYear) { countQuery += ' AND year <= ?'; countParams.push(parseInt(maxYear)); }
    if (condition) { countQuery += ' AND condition = ?'; countParams.push(condition); }

    db.get(countQuery, countParams, (err, countRow) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ caravans: rows, total: countRow.total, limit: parseInt(limit), offset: parseInt(offset) });
    });
  });
});

// Get single caravan by ID
app.get('/api/caravans/:id', (req, res) => {
  db.get('SELECT * FROM caravans WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Caravan not found' });
    res.json(row);
  });
});

// AI Routes - Advanced routes first to avoid conflicts
app.use('/api/ai/advanced', cacheAI, advancedAIRoutes);
app.use('/api/ai', validateAIChat, cacheAI, simpleAIRoutes);

// MFA Routes
app.use('/api/mfa', mfaRoutes);

// File Upload Routes
app.use('/api/upload', fileUploadRoutes);
app.use('/api/files', fileUploadRoutes);

// API Key Routes
app.use('/api/api-keys', apiKeyRoutes);

// Security Routes
app.use('/api/security', securityRoutes);

// Performance Routes
app.use('/api/performance', performanceRoutes);

// Advanced AI Routes - Already registered above

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Vehicle Platform API is running',
    security: 'Enhanced security features enabled',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorMonitoring);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested resource does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('🔐 Enhanced Security Features:');
  console.log('  - HTTPS enforcement and security headers');
  console.log('  - Rate limiting and DDoS protection');
  console.log('  - Input validation and sanitization');
  console.log('  - SQL injection prevention');
  console.log('  - XSS protection');
  console.log('  - Security monitoring and logging');
  console.log('🤖 AI-Powered features enabled:');
  console.log('  - Smart recommendations');
  console.log('  - Price estimation');
  console.log('  - Match scoring');
  console.log('  - Natural language search');
  console.log('  - Trending vehicles');
  console.log('👑 Admin panel enabled at /admin');
  console.log('Connected to SQLite database');
});
