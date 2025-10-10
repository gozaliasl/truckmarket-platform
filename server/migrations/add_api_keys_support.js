const db = require('../database');

// Create API keys table
const createAPIKeysTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS api_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT NOT NULL UNIQUE,
        key_hash TEXT NOT NULL UNIQUE,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        scopes TEXT NOT NULL,
        expires_at TEXT,
        rate_limit INTEGER DEFAULT 1000,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_used TEXT,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ API keys table created');
        resolve();
      }
    });
  });
};

// Create API key usage table for tracking
const createAPIKeyUsageTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS api_key_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key_id TEXT NOT NULL,
        endpoint TEXT NOT NULL,
        method TEXT NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        response_status INTEGER,
        response_time INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (key_id) REFERENCES api_keys (key_id) ON DELETE CASCADE
      )
    `;

    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ API key usage table created');
        resolve();
      }
    });
  });
};

// Create indexes for better performance
const createIndexes = () => {
  return new Promise((resolve, reject) => {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_api_keys_key_id ON api_keys(key_id)',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash)',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON api_keys(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_api_keys_expires_at ON api_keys(expires_at)',
      'CREATE INDEX IF NOT EXISTS idx_api_key_usage_key_id ON api_key_usage(key_id)',
      'CREATE INDEX IF NOT EXISTS idx_api_key_usage_created_at ON api_key_usage(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_api_key_usage_endpoint ON api_key_usage(endpoint)'
    ];

    const createIndexPromises = indexes.map(sql => {
      return new Promise((resolveIdx, rejectIdx) => {
        db.run(sql, (err) => {
          if (err) {
            rejectIdx(err);
          } else {
            resolveIdx();
          }
        });
      });
    });

    Promise.all(createIndexPromises)
      .then(() => {
        console.log('✅ API key indexes created');
        resolve();
      })
      .catch(reject);
  });
};

// Main migration function
const runMigration = async () => {
  try {
    console.log('🔄 Starting API keys migration...');
    
    await createAPIKeysTable();
    await createAPIKeyUsageTable();
    await createIndexes();
    
    console.log('✅ API keys migration completed successfully');
  } catch (error) {
    console.error('❌ API keys migration failed:', error);
    throw error;
  }
};

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = {
  createAPIKeysTable,
  createAPIKeyUsageTable,
  createIndexes,
  runMigration
};
