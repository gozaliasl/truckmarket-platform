const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection with optimizations
const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to optimized SQLite database');
    
    // Enable WAL mode for better concurrency
    db.run('PRAGMA journal_mode = WAL');
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
    
    // Set cache size (negative value means KB)
    db.run('PRAGMA cache_size = -64000'); // 64MB cache
    
    // Set synchronous mode to NORMAL for better performance
    db.run('PRAGMA synchronous = NORMAL');
    
    // Set temp store to memory
    db.run('PRAGMA temp_store = MEMORY');
    
    // Set mmap size for better performance
    db.run('PRAGMA mmap_size = 268435456'); // 256MB
    
    // Optimize for performance
    db.run('PRAGMA optimize');
    
    console.log('Database optimizations applied');
  }
});

// Connection pooling simulation
const connectionPool = {
  active: 0,
  max: 10,
  queue: []
};

// Optimized query execution with connection management
const executeQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    db.all(query, params, (err, rows) => {
      const executionTime = Date.now() - startTime;
      
      if (err) {
        console.error('Query error:', err);
        reject(err);
      } else {
        // Log slow queries (>100ms)
        if (executionTime > 100) {
          console.warn(`Slow query detected (${executionTime}ms):`, query.substring(0, 100));
        }
        
        resolve({
          data: rows,
          executionTime,
          rowCount: rows ? rows.length : 0
        });
      }
    });
  });
};

// Optimized single row query
const executeQuerySingle = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    db.get(query, params, (err, row) => {
      const executionTime = Date.now() - startTime;
      
      if (err) {
        console.error('Query error:', err);
        reject(err);
      } else {
        if (executionTime > 100) {
          console.warn(`Slow query detected (${executionTime}ms):`, query.substring(0, 100));
        }
        
        resolve({
          data: row,
          executionTime,
          found: !!row
        });
      }
    });
  });
};

// Optimized insert/update/delete
const executeUpdate = (query, params = []) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    db.run(query, params, function(err) {
      const executionTime = Date.now() - startTime;
      
      if (err) {
        console.error('Update error:', err);
        reject(err);
      } else {
        if (executionTime > 100) {
          console.warn(`Slow update detected (${executionTime}ms):`, query.substring(0, 100));
        }
        
        resolve({
          changes: this.changes,
          lastID: this.lastID,
          executionTime
        });
      }
    });
  });
};

// Database statistics
const getDatabaseStats = () => {
  return new Promise((resolve, reject) => {
    const stats = {};
    let completed = 0;
    const totalQueries = 4;
    
    const checkComplete = () => {
      completed++;
      if (completed === totalQueries) {
        resolve(stats);
      }
    };
    
    // Get table sizes
    db.all(`
      SELECT name, 
             (SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=m.name) as table_count
      FROM sqlite_master m 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `, (err, tables) => {
      if (!err) {
        stats.tables = tables;
      }
      checkComplete();
    });
    
    // Get database size
    db.get('PRAGMA page_count', (err, pageCount) => {
      if (!err) {
        db.get('PRAGMA page_size', (err, pageSize) => {
          if (!err) {
            stats.databaseSize = pageCount.page_count * pageSize.page_size;
          }
          checkComplete();
        });
      } else {
        checkComplete();
      }
    });
    
    // Get cache stats
    db.get('PRAGMA cache_size', (err, cacheSize) => {
      if (!err) {
        stats.cacheSize = cacheSize.cache_size;
      }
      checkComplete();
    });
    
    // Get connection info
    db.get('PRAGMA journal_mode', (err, journalMode) => {
      if (!err) {
        stats.journalMode = journalMode.journal_mode;
      }
      checkComplete();
    });
  });
};

// Query optimization suggestions
const getOptimizationSuggestions = () => {
  return new Promise((resolve, reject) => {
    const suggestions = [];
    
    // Check for missing indexes
    db.all(`
      SELECT name, sql 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `, (err, tables) => {
      if (err) {
        reject(err);
        return;
      }
      
      tables.forEach(table => {
        // Check if table has indexes
        db.all(`PRAGMA index_list(${table.name})`, (err, indexes) => {
          if (!err && indexes.length === 0) {
            suggestions.push({
              type: 'missing_index',
              table: table.name,
              suggestion: `Consider adding indexes for frequently queried columns in ${table.name}`
            });
          }
        });
      });
      
      // Add general suggestions
      suggestions.push(
        {
          type: 'general',
          suggestion: 'Use prepared statements for better performance'
        },
        {
          type: 'general',
          suggestion: 'Consider database connection pooling for high traffic'
        },
        {
          type: 'general',
          suggestion: 'Monitor slow queries and optimize them'
        }
      );
      
      resolve(suggestions);
    });
  });
};

// Database maintenance
const performMaintenance = () => {
  return new Promise((resolve, reject) => {
    console.log('Starting database maintenance...');
    
    db.serialize(() => {
      db.run('PRAGMA optimize', (err) => {
        if (err) {
          console.error('Optimize error:', err);
        } else {
          console.log('Database optimized');
        }
      });
      
      db.run('VACUUM', (err) => {
        if (err) {
          console.error('Vacuum error:', err);
          reject(err);
        } else {
          console.log('Database vacuumed');
          resolve('Maintenance completed');
        }
      });
    });
  });
};

// Performance monitoring
const performanceMetrics = {
  totalQueries: 0,
  slowQueries: 0,
  averageExecutionTime: 0,
  totalExecutionTime: 0
};

const updatePerformanceMetrics = (executionTime) => {
  performanceMetrics.totalQueries++;
  performanceMetrics.totalExecutionTime += executionTime;
  performanceMetrics.averageExecutionTime = 
    performanceMetrics.totalExecutionTime / performanceMetrics.totalQueries;
  
  if (executionTime > 100) {
    performanceMetrics.slowQueries++;
  }
};

const getPerformanceMetrics = () => {
  return {
    ...performanceMetrics,
    slowQueryPercentage: performanceMetrics.totalQueries > 0 
      ? (performanceMetrics.slowQueries / performanceMetrics.totalQueries * 100).toFixed(2) + '%'
      : '0%'
  };
};

module.exports = {
  db,
  executeQuery,
  executeQuerySingle,
  executeUpdate,
  getDatabaseStats,
  getOptimizationSuggestions,
  performMaintenance,
  updatePerformanceMetrics,
  getPerformanceMetrics
};
