/**
 * Database Migration: Search History and Saved Searches
 * Phase 2: Smart Search Features
 */

const db = require('../database');

function runMigration() {
  console.log('🔄 Running migration: Search History and Saved Searches...');

  const migrations = [
    // Create search_history table
    `CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      search_query TEXT,
      filters TEXT,
      results_count INTEGER,
      clicked_truck_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (clicked_truck_id) REFERENCES trucks(id) ON DELETE SET NULL
    )`,

    // Create saved_searches table
    `CREATE TABLE IF NOT EXISTS saved_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name VARCHAR(255) NOT NULL,
      search_query TEXT,
      filters TEXT NOT NULL,
      notification_enabled BOOLEAN DEFAULT 0,
      notification_frequency VARCHAR(50) DEFAULT 'daily',
      last_notification_at DATETIME,
      results_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    // Create user_favorites table
    `CREATE TABLE IF NOT EXISTS user_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      truck_id INTEGER NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE,
      UNIQUE(user_id, truck_id)
    )`,

    // Create price_alerts table (for Phase 4)
    `CREATE TABLE IF NOT EXISTS price_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      truck_id INTEGER NOT NULL,
      original_price DECIMAL(10,2) NOT NULL,
      alert_threshold_percent INTEGER DEFAULT 5,
      is_triggered BOOLEAN DEFAULT 0,
      triggered_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE,
      UNIQUE(user_id, truck_id)
    )`,

    // Create price_history table (for Phase 4)
    `CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      truck_id INTEGER NOT NULL,
      old_price DECIMAL(10,2) NOT NULL,
      new_price DECIMAL(10,2) NOT NULL,
      change_percent DECIMAL(5,2),
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE
    )`,

    // Add indexes for performance
    `CREATE INDEX IF NOT EXISTS idx_search_history_user ON search_history(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_search_history_created ON search_history(created_at DESC)`,
    `CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_favorites_user ON user_favorites(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_favorites_truck ON user_favorites(truck_id)`,
    `CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_price_alerts_truck ON price_alerts(truck_id)`,
    `CREATE INDEX IF NOT EXISTS idx_price_history_truck ON price_history(truck_id)`,
    `CREATE INDEX IF NOT EXISTS idx_price_history_changed ON price_history(changed_at DESC)`
  ];

  return new Promise((resolve, reject) => {
    const runNext = (index) => {
      if (index >= migrations.length) {
        console.log('✅ Migration completed: Search History and Saved Searches');
        resolve();
        return;
      }

      db.run(migrations[index], (err) => {
        if (err) {
          console.error(`❌ Migration failed at step ${index + 1}:`, err.message);
          reject(err);
          return;
        }
        runNext(index + 1);
      });
    };

    runNext(0);
  });
}

// Run if executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 All migrations completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('💥 Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { runMigration };
