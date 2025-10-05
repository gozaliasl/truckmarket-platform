const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const {
  registerUser,
  loginUser,
  authMiddleware,
  getUserById,
  getUserBySubdomain,
  updateUserProfile,
  TIER_CONFIG
} = require('./auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ============= AUTH ROUTES =============

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
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
app.get('/api/trucks', (req, res) => {
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

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM trucks WHERE 1=1';
    const countParams = params.slice(0, -2); // Remove limit and offset

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
app.get('/api/trucks/:id', (req, res) => {
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Truck Platform API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
