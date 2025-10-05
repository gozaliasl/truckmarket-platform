const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'trucks.db');
const db = new sqlite3.Database(dbPath);

async function addAdminRole() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Add role column to users table
      db.run(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`, (err) => {
        if (err) {
          if (err.message.includes('duplicate column name')) {
            console.log('✓ Role column already exists');
          } else {
            console.error('Error adding role column:', err);
            return reject(err);
          }
        } else {
          console.log('✓ Added role column to users table');
        }

        // Update existing users to have 'user' role
        db.run(`UPDATE users SET role = 'user' WHERE role IS NULL`, (err) => {
          if (err) {
            console.error('Error updating existing users:', err);
            return reject(err);
          }
          console.log('✓ Updated existing users with user role');

          // Create admin account
          const adminEmail = 'admin@truckmarket.com';
          const adminPassword = 'admin123'; // Should be changed on first login

          bcrypt.hash(adminPassword, 10, (err, hashedPassword) => {
            if (err) {
              console.error('Error hashing password:', err);
              return reject(err);
            }

            db.run(`
              INSERT OR REPLACE INTO users
              (email, password, name, phone, company_name, tier, role, is_verified, is_active, listing_limit)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              adminEmail,
              hashedPassword,
              'System Administrator',
              '+1234567890',
              'TruckMarket Platform',
              'professional',
              'admin',
              1,
              1,
              999999
            ], (err) => {
              if (err) {
                console.error('Error creating admin account:', err);
                return reject(err);
              }
              console.log('✓ Created admin account');
              console.log('  Email: admin@truckmarket.com');
              console.log('  Password: admin123');
              console.log('  ⚠️  IMPORTANT: Change this password after first login!');
              resolve();
            });
          });
        });
      });
    });
  });
}

// Run migration
addAdminRole()
  .then(() => {
    console.log('\n✅ Admin role migration completed successfully!');
    db.close();
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Migration failed:', err);
    db.close();
    process.exit(1);
  });
