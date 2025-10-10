const db = require('../database');

// Add MFA support to users table
const addMFASupport = () => {
  return new Promise((resolve, reject) => {
    // Check if MFA columns already exist
    db.get("PRAGMA table_info(users)", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      // Get all column names
      db.all("PRAGMA table_info(users)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }

        const columnNames = columns.map(col => col.name);
        const mfaColumns = [
          'mfaEnabled',
          'mfaSecret', 
          'mfaBackupCodes',
          'mfaLastUsed',
          'mfaRecoveryCodes'
        ];

        const missingColumns = mfaColumns.filter(col => !columnNames.includes(col));

        if (missingColumns.length === 0) {
          console.log('✅ MFA columns already exist');
          resolve();
          return;
        }

        // Add missing MFA columns
        const addColumnPromises = missingColumns.map(column => {
          return new Promise((resolveCol, rejectCol) => {
            let sql;
            switch (column) {
              case 'mfaEnabled':
                sql = 'ALTER TABLE users ADD COLUMN mfaEnabled INTEGER DEFAULT 0';
                break;
              case 'mfaSecret':
                sql = 'ALTER TABLE users ADD COLUMN mfaSecret TEXT';
                break;
              case 'mfaBackupCodes':
                sql = 'ALTER TABLE users ADD COLUMN mfaBackupCodes TEXT';
                break;
              case 'mfaLastUsed':
                sql = 'ALTER TABLE users ADD COLUMN mfaLastUsed TEXT';
                break;
              case 'mfaRecoveryCodes':
                sql = 'ALTER TABLE users ADD COLUMN mfaRecoveryCodes TEXT';
                break;
              default:
                rejectCol(new Error(`Unknown column: ${column}`));
                return;
            }

            db.run(sql, (err) => {
              if (err) {
                rejectCol(err);
              } else {
                console.log(`✅ Added column: ${column}`);
                resolveCol();
              }
            });
          });
        });

        Promise.all(addColumnPromises)
          .then(() => {
            console.log('✅ MFA support added to users table');
            resolve();
          })
          .catch(reject);
      });
    });
  });
};

// Create MFA sessions table for temporary MFA verification
const createMFASessionsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS mfa_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        sessionToken TEXT NOT NULL UNIQUE,
        expiresAt TEXT NOT NULL,
        verified BOOLEAN DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ MFA sessions table created');
        resolve();
      }
    });
  });
};

// Create MFA events table for audit logging
const createMFAEventsTable = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS mfa_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        eventType TEXT NOT NULL,
        details TEXT,
        ipAddress TEXT,
        userAgent TEXT,
        severity TEXT DEFAULT 'info',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ MFA events table created');
        resolve();
      }
    });
  });
};

// Create indexes for better performance
const createIndexes = () => {
  return new Promise((resolve, reject) => {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_mfa_sessions_userId ON mfa_sessions(userId)',
      'CREATE INDEX IF NOT EXISTS idx_mfa_sessions_token ON mfa_sessions(sessionToken)',
      'CREATE INDEX IF NOT EXISTS idx_mfa_sessions_expires ON mfa_sessions(expiresAt)',
      'CREATE INDEX IF NOT EXISTS idx_mfa_events_userId ON mfa_events(userId)',
      'CREATE INDEX IF NOT EXISTS idx_mfa_events_type ON mfa_events(eventType)',
      'CREATE INDEX IF NOT EXISTS idx_mfa_events_created ON mfa_events(createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_users_mfa_enabled ON users(mfaEnabled)'
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
        console.log('✅ MFA indexes created');
        resolve();
      })
      .catch(reject);
  });
};

// Main migration function
const runMigration = async () => {
  try {
    console.log('🔄 Starting MFA migration...');
    
    await addMFASupport();
    await createMFASessionsTable();
    await createMFAEventsTable();
    await createIndexes();
    
    console.log('✅ MFA migration completed successfully');
  } catch (error) {
    console.error('❌ MFA migration failed:', error);
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
  addMFASupport,
  createMFASessionsTable,
  createMFAEventsTable,
  createIndexes,
  runMigration
};
