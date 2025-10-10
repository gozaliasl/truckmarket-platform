const encryptionService = require('../services/encryptionService');

/**
 * Middleware to automatically encrypt sensitive data before database operations
 */
const encryptSensitiveData = (req, res, next) => {
  // Store original body for potential decryption
  req.originalBody = { ...req.body };

  // Encrypt sensitive fields in request body
  if (req.body) {
    const sensitiveFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'mfaSecret'];
    
    sensitiveFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = encryptionService.encryptField(req.body[field], field);
      }
    });
  }

  next();
};

/**
 * Middleware to automatically decrypt sensitive data after database operations
 */
const decryptSensitiveData = (req, res, next) => {
  // Override res.json to decrypt data before sending
  const originalJson = res.json;
  
  res.json = function(data) {
    if (data && typeof data === 'object') {
      data = decryptObject(data);
    }
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Recursively decrypt sensitive fields in an object
 * @param {Object} obj - Object to decrypt
 * @returns {Object} Object with decrypted sensitive fields
 */
function decryptObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(decryptObject);
  }

  const decrypted = { ...obj };
  const sensitiveFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'mfaSecret'];

  sensitiveFields.forEach(field => {
    if (decrypted[field]) {
      try {
        decrypted[field] = encryptionService.decryptField(decrypted[field]);
      } catch (error) {
        // If decryption fails, keep original value (might not be encrypted)
        console.warn(`Failed to decrypt field ${field}:`, error.message);
      }
    }
  });

  // Recursively decrypt nested objects
  Object.keys(decrypted).forEach(key => {
    if (typeof decrypted[key] === 'object' && decrypted[key] !== null) {
      decrypted[key] = decryptObject(decrypted[key]);
    }
  });

  return decrypted;
}

/**
 * Middleware for specific routes that need encryption
 */
const encryptUserData = (req, res, next) => {
  if (req.body) {
    req.body = encryptionService.encryptUserData(req.body);
  }
  next();
};

/**
 * Middleware for specific routes that need decryption
 */
const decryptUserData = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    if (data && data.user) {
      data.user = encryptionService.decryptUserData(data.user);
    }
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Encrypt API key before storing
 * @param {string} apiKey - API key to encrypt
 * @returns {string} Encrypted API key
 */
const encryptApiKey = (apiKey) => {
  return encryptionService.encryptField(apiKey, 'apiKey');
};

/**
 * Decrypt API key for verification
 * @param {string} encryptedApiKey - Encrypted API key
 * @returns {string} Decrypted API key
 */
const decryptApiKey = (encryptedApiKey) => {
  return encryptionService.decryptField(encryptedApiKey);
};

/**
 * Hash API key for storage (one-way)
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 */
const hashApiKey = (apiKey) => {
  return encryptionService.hashApiKey(apiKey);
};

/**
 * Verify API key against hash
 * @param {string} apiKey - API key to verify
 * @param {string} hash - Hash to verify against
 * @returns {boolean} Whether the API key matches
 */
const verifyApiKey = (apiKey, hash) => {
  return encryptionService.verifyApiKey(apiKey, hash);
};

/**
 * Encrypt file upload data
 * @param {Buffer} fileBuffer - File content
 * @param {string} key - Encryption key (optional)
 * @returns {Object} Encrypted file data
 */
const encryptFile = (fileBuffer, key = null) => {
  return encryptionService.encryptFile(fileBuffer, key);
};

/**
 * Decrypt file data
 * @param {Object} encryptedFileData - Encrypted file data
 * @param {string} key - Decryption key (optional)
 * @returns {Buffer} Decrypted file content
 */
const decryptFile = (encryptedFileData, key = null) => {
  return encryptionService.decryptFile(encryptedFileData, key);
};

/**
 * Generate secure token for sensitive operations
 * @param {number} length - Token length in bytes
 * @returns {string} Secure token
 */
const generateSecureToken = (length = 32) => {
  return encryptionService.generateSecureToken(length);
};

/**
 * Generate secure random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
const generateSecureString = (length = 16) => {
  return encryptionService.generateSecureString(length);
};

/**
 * Log encryption/decryption events for audit
 * @param {string} operation - Operation type (encrypt/decrypt)
 * @param {string} field - Field name
 * @param {string} userId - User ID (optional)
 */
const logEncryptionEvent = (operation, field, userId = null) => {
  const event = {
    timestamp: new Date().toISOString(),
    operation,
    field,
    userId,
    severity: 'info'
  };

  if (process.env.NODE_ENV !== 'production') {
    console.log(`🔐 Encryption Event: ${operation}`, event);
  }

  // In production, this would be sent to a logging service
  return event;
};

module.exports = {
  encryptSensitiveData,
  decryptSensitiveData,
  encryptUserData,
  decryptUserData,
  encryptApiKey,
  decryptApiKey,
  hashApiKey,
  verifyApiKey,
  encryptFile,
  decryptFile,
  generateSecureToken,
  generateSecureString,
  logEncryptionEvent
};
