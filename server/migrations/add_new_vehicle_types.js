const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database.db');
const db = new sqlite3.Database(dbPath);

// Migration to add Cars, Motorcycles, E-Bikes, and Caravans tables

db.serialize(() => {
  console.log('🚗 Creating Cars table...');

  // Cars Table
  db.run(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,

      -- Basic Info
      brand VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',

      -- Vehicle Details
      body_type VARCHAR(50), -- Sedan, SUV, Station Wagon, Convertible, Coupe, etc.
      fuel_type VARCHAR(50), -- Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid
      transmission VARCHAR(50), -- Manual, Automatic, Semi-automatic
      mileage INTEGER,
      engine_size INTEGER, -- in cc
      power_hp INTEGER,
      power_kw INTEGER,
      doors INTEGER,
      seats INTEGER,
      color VARCHAR(50),
      interior_color VARCHAR(50),

      -- Condition
      condition VARCHAR(50) DEFAULT 'Used', -- New, Used, Certified Pre-Owned
      previous_owners INTEGER,
      accident_free BOOLEAN DEFAULT 1,
      service_history BOOLEAN DEFAULT 0,

      -- Features & Equipment
      air_conditioning BOOLEAN DEFAULT 0,
      cruise_control BOOLEAN DEFAULT 0,
      navigation_system BOOLEAN DEFAULT 0,
      parking_sensors BOOLEAN DEFAULT 0,
      parking_camera BOOLEAN DEFAULT 0,
      leather_seats BOOLEAN DEFAULT 0,
      heated_seats BOOLEAN DEFAULT 0,
      sunroof BOOLEAN DEFAULT 0,
      alloy_wheels BOOLEAN DEFAULT 0,

      -- Safety Features
      abs BOOLEAN DEFAULT 0,
      airbags INTEGER,
      esp BOOLEAN DEFAULT 0,
      traction_control BOOLEAN DEFAULT 0,
      lane_assist BOOLEAN DEFAULT 0,
      blind_spot_monitor BOOLEAN DEFAULT 0,

      -- Environmental
      co2_emissions INTEGER, -- g/km
      emission_class VARCHAR(20), -- Euro 6, Euro 5, etc.
      fuel_consumption_city DECIMAL(4, 2),
      fuel_consumption_highway DECIMAL(4, 2),
      fuel_consumption_combined DECIMAL(4, 2),

      -- Electric Vehicle Specific
      battery_capacity INTEGER, -- kWh
      electric_range INTEGER, -- km
      charging_time DECIMAL(4, 2), -- hours

      -- Location & Contact
      country VARCHAR(100),
      city VARCHAR(100),
      postal_code VARCHAR(20),

      -- Listing Details
      description TEXT,
      images TEXT, -- JSON array of image URLs
      video_url VARCHAR(500),

      -- Commercial
      vat_deductible BOOLEAN DEFAULT 0,
      warranty_months INTEGER,
      availability VARCHAR(50) DEFAULT 'Available', -- Available, Sold, Reserved

      -- Registration
      first_registration DATE,
      last_inspection DATE,
      vin VARCHAR(17),
      license_plate VARCHAR(20),

      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating cars table:', err);
    else console.log('✅ Cars table created');
  });

  console.log('🏍️  Creating Motorcycles table...');

  // Motorcycles Table
  db.run(`
    CREATE TABLE IF NOT EXISTS motorcycles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,

      -- Basic Info
      brand VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',

      -- Vehicle Details
      type VARCHAR(50), -- Sport, Cruiser, Touring, Adventure, Scooter, etc.
      engine_size INTEGER, -- in cc
      power_hp INTEGER,
      power_kw INTEGER,
      mileage INTEGER,
      fuel_type VARCHAR(50), -- Petrol, Electric
      transmission VARCHAR(50), -- Manual, Automatic
      color VARCHAR(50),

      -- Motorcycle Specific
      cylinders INTEGER,
      stroke VARCHAR(20), -- 2-stroke, 4-stroke
      cooling VARCHAR(50), -- Air-cooled, Liquid-cooled
      top_speed INTEGER,
      weight INTEGER, -- kg
      seat_height INTEGER, -- cm
      fuel_capacity DECIMAL(4, 1), -- liters

      -- Condition
      condition VARCHAR(50) DEFAULT 'Used',
      previous_owners INTEGER,
      accident_free BOOLEAN DEFAULT 1,
      service_history BOOLEAN DEFAULT 0,

      -- Features
      abs BOOLEAN DEFAULT 0,
      traction_control BOOLEAN DEFAULT 0,
      riding_modes BOOLEAN DEFAULT 0,
      heated_grips BOOLEAN DEFAULT 0,
      luggage_rack BOOLEAN DEFAULT 0,

      -- Location & Contact
      country VARCHAR(100),
      city VARCHAR(100),
      postal_code VARCHAR(20),

      -- Listing Details
      description TEXT,
      images TEXT,
      video_url VARCHAR(500),

      -- Registration
      first_registration DATE,
      vin VARCHAR(17),
      license_plate VARCHAR(20),

      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating motorcycles table:', err);
    else console.log('✅ Motorcycles table created');
  });

  console.log('🚴 Creating E-Bikes table...');

  // E-Bikes Table
  db.run(`
    CREATE TABLE IF NOT EXISTS ebikes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,

      -- Basic Info
      brand VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',

      -- Bike Details
      type VARCHAR(50), -- City, Mountain, Trekking, Cargo, Folding, etc.
      frame_size VARCHAR(20), -- XS, S, M, L, XL or in cm
      frame_material VARCHAR(50), -- Aluminum, Carbon, Steel
      color VARCHAR(50),
      weight DECIMAL(4, 1), -- kg

      -- E-Bike Specific
      motor_type VARCHAR(50), -- Mid-drive, Hub motor
      motor_power INTEGER, -- watts
      battery_capacity INTEGER, -- Wh
      battery_voltage DECIMAL(4, 1), -- V
      range_min INTEGER, -- km
      range_max INTEGER, -- km
      charging_time DECIMAL(4, 2), -- hours
      pedal_assist_levels INTEGER,
      max_speed INTEGER, -- km/h

      -- Components
      gears INTEGER,
      gear_system VARCHAR(100), -- Shimano Deore, SRAM, etc.
      brakes VARCHAR(100), -- Hydraulic disc, Mechanical disc
      suspension VARCHAR(50), -- Front, Full, Hardtail, None
      tire_size VARCHAR(20), -- 26", 27.5", 29", 700c, etc.

      -- Features
      lights BOOLEAN DEFAULT 0,
      fenders BOOLEAN DEFAULT 0,
      rack BOOLEAN DEFAULT 0,
      kickstand BOOLEAN DEFAULT 0,
      display_type VARCHAR(50), -- LCD, LED, Color display

      -- Condition
      condition VARCHAR(50) DEFAULT 'Used',
      mileage INTEGER, -- km
      previous_owners INTEGER,

      -- Location & Contact
      country VARCHAR(100),
      city VARCHAR(100),
      postal_code VARCHAR(20),

      -- Listing Details
      description TEXT,
      images TEXT,
      video_url VARCHAR(500),
      warranty_months INTEGER,

      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating ebikes table:', err);
    else console.log('✅ E-Bikes table created');
  });

  console.log('🚐 Creating Caravans table...');

  // Caravans Table
  db.run(`
    CREATE TABLE IF NOT EXISTS caravans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,

      -- Basic Info
      brand VARCHAR(100) NOT NULL,
      model VARCHAR(100) NOT NULL,
      year INTEGER NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      currency VARCHAR(10) DEFAULT 'EUR',

      -- Caravan Details
      type VARCHAR(50), -- Travel Trailer, Motorhome, Camper Van, Fifth Wheel, etc.
      length DECIMAL(4, 2), -- meters
      width DECIMAL(4, 2), -- meters
      height DECIMAL(4, 2), -- meters
      weight_empty INTEGER, -- kg
      weight_total INTEGER, -- kg (GVWR)
      sleeping_capacity INTEGER,

      -- Interior
      beds INTEGER,
      bed_type VARCHAR(100), -- Fixed bed, Bunk beds, Convertible, etc.
      bathroom BOOLEAN DEFAULT 0,
      shower BOOLEAN DEFAULT 0,
      toilet BOOLEAN DEFAULT 0,
      kitchen BOOLEAN DEFAULT 0,
      refrigerator BOOLEAN DEFAULT 0,
      heating BOOLEAN DEFAULT 0,
      air_conditioning BOOLEAN DEFAULT 0,

      -- Technical
      axles INTEGER,
      brakes VARCHAR(50), -- Disc, Drum
      water_tank_capacity INTEGER, -- liters
      waste_water_capacity INTEGER, -- liters
      gas_bottles INTEGER,

      -- Motorhome Specific
      engine_type VARCHAR(50), -- Diesel, Petrol
      engine_size INTEGER, -- cc
      power_hp INTEGER,
      transmission VARCHAR(50),
      mileage INTEGER,
      fuel_capacity INTEGER, -- liters

      -- Power & Utilities
      solar_panels BOOLEAN DEFAULT 0,
      generator BOOLEAN DEFAULT 0,
      battery_capacity INTEGER, -- Ah
      electric_hookup BOOLEAN DEFAULT 0,
      tv BOOLEAN DEFAULT 0,
      awning BOOLEAN DEFAULT 0,

      -- Condition
      condition VARCHAR(50) DEFAULT 'Used',
      previous_owners INTEGER,
      service_history BOOLEAN DEFAULT 0,

      -- Location & Contact
      country VARCHAR(100),
      city VARCHAR(100),
      postal_code VARCHAR(20),

      -- Listing Details
      description TEXT,
      images TEXT,
      video_url VARCHAR(500),

      -- Registration
      first_registration DATE,
      vin VARCHAR(17),
      license_plate VARCHAR(20),

      -- Timestamps
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.error('Error creating caravans table:', err);
    else console.log('✅ Caravans table created');
  });

  // Create indexes for better query performance
  console.log('📊 Creating indexes...');

  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand)',
    'CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price)',
    'CREATE INDEX IF NOT EXISTS idx_cars_year ON cars(year)',
    'CREATE INDEX IF NOT EXISTS idx_cars_body_type ON cars(body_type)',
    'CREATE INDEX IF NOT EXISTS idx_cars_fuel_type ON cars(fuel_type)',
    'CREATE INDEX IF NOT EXISTS idx_motorcycles_brand ON motorcycles(brand)',
    'CREATE INDEX IF NOT EXISTS idx_motorcycles_type ON motorcycles(type)',
    'CREATE INDEX IF NOT EXISTS idx_ebikes_brand ON ebikes(brand)',
    'CREATE INDEX IF NOT EXISTS idx_ebikes_type ON ebikes(type)',
    'CREATE INDEX IF NOT EXISTS idx_caravans_brand ON caravans(brand)',
    'CREATE INDEX IF NOT EXISTS idx_caravans_type ON caravans(type)'
  ];

  indexes.forEach(indexSql => {
    db.run(indexSql, (err) => {
      if (err) console.error('Error creating index:', err);
    });
  });

  console.log('✅ All indexes created');
  console.log('🎉 Migration completed successfully!');
});

db.close();
