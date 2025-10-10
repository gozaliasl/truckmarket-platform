/**
 * AI-Powered Search Features
 * Phase 2: Search History and Saved Searches
 */

const db = require('../database');

/**
 * Record a search query in history
 */
async function recordSearchHistory(userId, searchQuery, filters, resultsCount, clickedTruckId = null) {
  return new Promise((resolve, reject) => {
    const filtersJson = JSON.stringify(filters);

    db.run(
      `INSERT INTO search_history (user_id, search_query, filters, results_count, clicked_truck_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, searchQuery, filtersJson, resultsCount, clickedTruckId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID });
      }
    );
  });
}

/**
 * Get user's search history
 */
async function getSearchHistory(userId, limit = 20) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, search_query, filters, results_count, clicked_truck_id, created_at
       FROM search_history
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [userId, limit],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const history = rows.map(row => ({
          ...row,
          filters: JSON.parse(row.filters || '{}')
        }));

        resolve(history);
      }
    );
  });
}

/**
 * Get popular searches (trending)
 */
async function getPopularSearches(limit = 10) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT search_query, COUNT(*) as search_count, MAX(created_at) as last_searched
       FROM search_history
       WHERE search_query IS NOT NULL AND search_query != ''
       AND created_at >= datetime('now', '-7 days')
       GROUP BY search_query
       ORDER BY search_count DESC
       LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

/**
 * Create a saved search
 */
async function createSavedSearch(userId, name, searchQuery, filters, notificationEnabled = false) {
  return new Promise((resolve, reject) => {
    const filtersJson = JSON.stringify(filters);

    db.run(
      `INSERT INTO saved_searches (user_id, name, search_query, filters, notification_enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, name, searchQuery, filtersJson, notificationEnabled ? 1 : 0],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID });
      }
    );
  });
}

/**
 * Get user's saved searches
 */
async function getSavedSearches(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, name, search_query, filters, notification_enabled, notification_frequency,
              results_count, created_at, updated_at
       FROM saved_searches
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const searches = rows.map(row => ({
          ...row,
          filters: JSON.parse(row.filters || '{}'),
          notification_enabled: Boolean(row.notification_enabled)
        }));

        resolve(searches);
      }
    );
  });
}

/**
 * Update saved search
 */
async function updateSavedSearch(userId, searchId, updates) {
  return new Promise((resolve, reject) => {
    const allowedFields = ['name', 'search_query', 'filters', 'notification_enabled', 'notification_frequency'];
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        if (key === 'filters') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else if (key === 'notification_enabled') {
          fields.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    }

    if (fields.length === 0) {
      reject(new Error('No valid fields to update'));
      return;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(searchId, userId);

    db.run(
      `UPDATE saved_searches SET ${fields.join(', ')}
       WHERE id = ? AND user_id = ?`,
      values,
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ updated: this.changes });
      }
    );
  });
}

/**
 * Delete saved search
 */
async function deleteSavedSearch(userId, searchId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM saved_searches WHERE id = ? AND user_id = ?',
      [searchId, userId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes });
      }
    );
  });
}

/**
 * Add truck to favorites
 */
async function addFavorite(userId, truckId, notes = '') {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO user_favorites (user_id, truck_id, notes)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, truck_id) DO UPDATE SET notes = ?`,
      [userId, truckId, notes, notes],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ id: this.lastID });
      }
    );
  });
}

/**
 * Remove truck from favorites
 */
async function removeFavorite(userId, truckId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM user_favorites WHERE user_id = ? AND truck_id = ?',
      [userId, truckId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes });
      }
    );
  });
}

/**
 * Get user's favorite trucks
 */
async function getFavorites(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT f.id as favorite_id, f.notes, f.created_at as favorited_at, t.*
       FROM user_favorites f
       JOIN trucks t ON f.truck_id = t.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

/**
 * Check if truck is favorited by user
 */
async function isFavorited(userId, truckId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id FROM user_favorites WHERE user_id = ? AND truck_id = ?',
      [userId, truckId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(Boolean(row));
      }
    );
  });
}

/**
 * Get personalized recommendations based on search history
 */
async function getPersonalizedRecommendations(userId, limit = 10) {
  return new Promise((resolve, reject) => {
    // Get user's most common search filters
    db.all(
      `SELECT filters, COUNT(*) as frequency
       FROM search_history
       WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
       GROUP BY filters
       ORDER BY frequency DESC
       LIMIT 5`,
      [userId],
      (err, searches) => {
        if (err) {
          reject(err);
          return;
        }

        if (searches.length === 0) {
          resolve([]);
          return;
        }

        // Parse the most common filters
        const commonFilters = JSON.parse(searches[0].filters || '{}');

        // Build query based on filters
        let query = 'SELECT * FROM trucks WHERE status = "active"';
        const params = [];

        if (commonFilters.brand) {
          query += ' AND brand = ?';
          params.push(commonFilters.brand);
        }

        if (commonFilters.category) {
          query += ' AND category = ?';
          params.push(commonFilters.category);
        }

        if (commonFilters.minYear) {
          query += ' AND year >= ?';
          params.push(commonFilters.minYear);
        }

        if (commonFilters.maxPrice) {
          query += ' AND price <= ?';
          params.push(commonFilters.maxPrice);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        db.all(query, params, (err, trucks) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(trucks.map(truck => ({
            ...truck,
            recommendation_reason: 'Based on your search history'
          })));
        });
      }
    );
  });
}

module.exports = {
  recordSearchHistory,
  getSearchHistory,
  getPopularSearches,
  createSavedSearch,
  getSavedSearches,
  updateSavedSearch,
  deleteSavedSearch,
  addFavorite,
  removeFavorite,
  getFavorites,
  isFavorited,
  getPersonalizedRecommendations
};
