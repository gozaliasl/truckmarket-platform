const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'trucks.db'), (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Create users table with three tiers
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      company_name TEXT,
      tier TEXT DEFAULT 'free',
      subdomain TEXT UNIQUE,
      logo_url TEXT,
      website TEXT,
      address TEXT,
      city TEXT,
      country TEXT,
      description TEXT,
      is_verified INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      listing_limit INTEGER DEFAULT 5,
      custom_colors TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create trucks table
  db.run(`
    CREATE TABLE IF NOT EXISTS trucks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT 'EUR',
      mileage INTEGER,
      condition TEXT,
      location TEXT,
      country TEXT,
      category TEXT,
      engine_power INTEGER,
      transmission TEXT,
      fuel_type TEXT,
      axle_configuration TEXT,
      color TEXT,
      description TEXT,
      seller_name TEXT,
      seller_phone TEXT,
      seller_email TEXT,
      image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create favorites table
  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      truck_id INTEGER,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (truck_id) REFERENCES trucks(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create contacts table for inquiry tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      truck_id INTEGER,
      sender_user_id INTEGER,
      name TEXT,
      email TEXT,
      phone TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (truck_id) REFERENCES trucks(id),
      FOREIGN KEY (sender_user_id) REFERENCES users(id)
    )
  `);

  // Create sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}

module.exports = db;
