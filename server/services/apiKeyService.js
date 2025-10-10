const crypto = require('crypto');
const db = require('../database');
const { generateSecureToken, hashApiKey, verifyApiKey } = require('../middleware/databaseEncryption');

class APIKeyService {
  constructor() {
    this.keyPrefix = 'rk_'; // Road Key prefix
    this.keyLength = 32;
    this.scopes = {
      read: 'Read access to public data',
      write: 'Write access to user data',
      admin: 'Administrative access',
      ai: 'AI features access',
      upload: 'File upload access'
    };
  }

  /**
   * Generate a new API key
   * @param {Object} options - Key generation options
   * @returns {Object} Generated API key data
   */
  generateAPIKey(options = {}) {
    const {
      userId,
      name = 'API Key',
      scopes = ['read'],
      expiresAt = null,
      rateLimit = 1000 // requests per hour
    } = options;

    // Generate secure key
    const keyValue = this.keyPrefix + generateSecureToken(this.keyLength);
    const keyHash = hashApiKey(keyValue);
    
    // Generate key ID
    const keyId = generateSecureToken(16);

    return {
      keyId,
      keyValue, // Only returned once during creation
      keyHash,
      userId,
      name,
      scopes: Array.isArray(scopes) ? scopes : [scopes],
      expiresAt,
      rateLimit,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      isActive: true
    };
  }

  /**
   * Create and store API key
   * @param {Object} keyData - API key data
   * @returns {Promise<Object>} Created API key
   */
  async createAPIKey(keyData) {
    return new Promise((resolve, reject) => {
      const {
        keyId,
        keyHash,
        userId,
        name,
        scopes,
        expiresAt,
        rateLimit,
        createdAt,
        isActive
      } = keyData;

      const sql = `
        INSERT INTO api_keys (
          key_id, key_hash, user_id, name, scopes, 
          expires_at, rate_limit, created_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [
        keyId,
        keyHash,
        userId,
        name,
        JSON.stringify(scopes),
        expiresAt,
        rateLimit,
        createdAt,
        isActive ? 1 : 0
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            keyId,
            keyValue: keyData.keyValue, // Return the actual key value
            name,
            scopes,
            expiresAt,
            rateLimit,
            createdAt
          });
        }
      });
    });
  }

  /**
   * Verify API key
   * @param {string} apiKey - API key to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifyAPIKey(apiKey) {
    return new Promise((resolve, reject) => {
      const keyHash = hashApiKey(apiKey);
      
      const sql = `
        SELECT ak.*, u.email, u.role, u.tier 
        FROM api_keys ak
        JOIN users u ON ak.user_id = u.id
        WHERE ak.key_hash = ? AND ak.is_active = 1
      `;

      db.get(sql, [keyHash], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve({ valid: false, reason: 'Invalid or inactive API key' });
        } else {
          // Check expiration
          if (row.expires_at && new Date(row.expires_at) < new Date()) {
            resolve({ valid: false, reason: 'API key has expired' });
            return;
          }

          // Update last used timestamp
          db.run(
            'UPDATE api_keys SET last_used = ? WHERE key_id = ?',
            [new Date().toISOString(), row.key_id],
            (err) => {
              if (err) {
                console.error('Failed to update API key last used:', err);
              }
            }
          );

          resolve({
            valid: true,
            keyId: row.key_id,
            userId: row.user_id,
            scopes: JSON.parse(row.scopes || '[]'),
            rateLimit: row.rate_limit,
            user: {
              email: row.email,
              role: row.role,
              tier: row.tier
            }
          });
        }
      });
    });
  }

  /**
   * Get API keys for user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} User's API keys
   */
  async getUserAPIKeys(userId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT key_id, name, scopes, expires_at, rate_limit, 
               created_at, last_used, is_active
        FROM api_keys 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;

      db.all(sql, [userId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const keys = rows.map(row => ({
            keyId: row.key_id,
            name: row.name,
            scopes: JSON.parse(row.scopes || '[]'),
            expiresAt: row.expires_at,
            rateLimit: row.rate_limit,
            createdAt: row.created_at,
            lastUsed: row.last_used,
            isActive: Boolean(row.is_active)
          }));
          resolve(keys);
        }
      });
    });
  }

  /**
   * Update API key
   * @param {string} keyId - API key ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} Success status
   */
  async updateAPIKey(keyId, updates) {
    return new Promise((resolve, reject) => {
      const allowedUpdates = ['name', 'scopes', 'expires_at', 'rate_limit', 'is_active'];
      const updateFields = [];
      const updateValues = [];

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updateFields.push(`${key} = ?`);
          updateValues.push(
            key === 'scopes' ? JSON.stringify(updates[key]) : updates[key]
          );
        }
      });

      if (updateFields.length === 0) {
        resolve(false);
        return;
      }

      updateValues.push(keyId);

      const sql = `
        UPDATE api_keys 
        SET ${updateFields.join(', ')}
        WHERE key_id = ?
      `;

      db.run(sql, updateValues, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Delete API key
   * @param {string} keyId - API key ID
   * @param {number} userId - User ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteAPIKey(keyId, userId) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM api_keys WHERE key_id = ? AND user_id = ?';

      db.run(sql, [keyId, userId], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  /**
   * Check API key rate limit
   * @param {string} keyId - API key ID
   * @returns {Promise<Object>} Rate limit status
   */
  async checkRateLimit(keyId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT rate_limit FROM api_keys WHERE key_id = ?';
      
      db.get(sql, [keyId], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve({ allowed: false, reason: 'API key not found' });
        } else {
          // In a real implementation, you would check against a rate limiting service
          // For now, we'll just return the rate limit
          resolve({
            allowed: true,
            rateLimit: row.rate_limit,
            remaining: row.rate_limit, // This would be calculated from actual usage
            resetTime: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
          });
        }
      });
    });
  }

  /**
   * Get available scopes
   * @returns {Object} Available scopes
   */
  getAvailableScopes() {
    return this.scopes;
  }

  /**
   * Validate scopes
   * @param {Array} scopes - Scopes to validate
   * @returns {Object} Validation result
   */
  validateScopes(scopes) {
    const availableScopes = Object.keys(this.scopes);
    const invalidScopes = scopes.filter(scope => !availableScopes.includes(scope));
    
    return {
      valid: invalidScopes.length === 0,
      invalidScopes,
      availableScopes
    };
  }

  /**
   * Log API key usage
   * @param {string} keyId - API key ID
   * @param {string} endpoint - API endpoint
   * @param {Object} req - Request object
   */
  logAPIKeyUsage(keyId, endpoint, req) {
    const event = {
      timestamp: new Date().toISOString(),
      keyId,
      endpoint,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      method: req.method
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 API Key Usage:', event);
    }

    // In production, this would be stored in a database or logging service
    return event;
  }

  /**
   * Create API key middleware
   * @param {Array} requiredScopes - Required scopes
   * @returns {Function} Express middleware
   */
  createAPIKeyMiddleware(requiredScopes = []) {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ 
            error: 'API key required',
            message: 'Include API key in Authorization header as Bearer token'
          });
        }

        const apiKey = authHeader.substring(7);
        const verification = await this.verifyAPIKey(apiKey);

        if (!verification.valid) {
          return res.status(401).json({ 
            error: 'Invalid API key',
            message: verification.reason
          });
        }

        // Check scopes
        if (requiredScopes.length > 0) {
          const hasRequiredScopes = requiredScopes.every(scope => 
            verification.scopes.includes(scope)
          );

          if (!hasRequiredScopes) {
            return res.status(403).json({ 
              error: 'Insufficient permissions',
              message: `Required scopes: ${requiredScopes.join(', ')}`,
              userScopes: verification.scopes
            });
          }
        }

        // Check rate limit
        const rateLimit = await this.checkRateLimit(verification.keyId);
        if (!rateLimit.allowed) {
          return res.status(429).json({ 
            error: 'Rate limit exceeded',
            message: rateLimit.reason
          });
        }

        // Add API key info to request
        req.apiKey = {
          keyId: verification.keyId,
          userId: verification.userId,
          scopes: verification.scopes,
          user: verification.user
        };

        // Log usage
        this.logAPIKeyUsage(verification.keyId, req.path, req);

        next();
      } catch (error) {
        console.error('API key middleware error:', error);
        res.status(500).json({ error: 'API key verification failed' });
      }
    };
  }
}

module.exports = new APIKeyService();
