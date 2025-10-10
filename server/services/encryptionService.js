const crypto = require('crypto');
const CryptoJS = require('crypto-js');

class EncryptionService {
  constructor() {
    // In production, these should be stored in environment variables
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'road-platform-encryption-key-2024';
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
  }

  /**
   * Generate a secure encryption key
   * @returns {string} Base64 encoded encryption key
   */
  generateKey() {
    return crypto.randomBytes(this.keyLength).toString('base64');
  }

  /**
   * Derive key from password using PBKDF2
   * @param {string} password - Password to derive key from
   * @param {string} salt - Salt for key derivation
   * @returns {Buffer} Derived key
   */
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   * @param {string} text - Text to encrypt
   * @param {string} key - Encryption key (optional, uses default if not provided)
   * @returns {Object} Encrypted data with IV and tag
   */
  encrypt(text, key = null) {
    try {
      const encryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.encryptionKey, 'utf8');
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, encryptionKey);
      cipher.setAAD(Buffer.from('road-platform', 'utf8'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt sensitive data using AES-256-GCM
   * @param {Object} encryptedData - Encrypted data object
   * @param {string} key - Decryption key (optional, uses default if not provided)
   * @returns {string} Decrypted text
   */
  decrypt(encryptedData, key = null) {
    try {
      const { encrypted, iv, tag, algorithm } = encryptedData;
      
      if (!encrypted || !iv || !tag) {
        throw new Error('Invalid encrypted data format');
      }

      const encryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.encryptionKey, 'utf8');
      const decipher = crypto.createDecipher(algorithm, encryptionKey);
      decipher.setAAD(Buffer.from('road-platform', 'utf8'));
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Encrypt using CryptoJS (for compatibility)
   * @param {string} text - Text to encrypt
   * @param {string} key - Encryption key
   * @returns {string} Encrypted text
   */
  encryptCryptoJS(text, key = null) {
    try {
      const encryptionKey = key || this.encryptionKey;
      const encrypted = CryptoJS.AES.encrypt(text, encryptionKey).toString();
      return encrypted;
    } catch (error) {
      throw new Error(`CryptoJS encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt using CryptoJS (for compatibility)
   * @param {string} encryptedText - Encrypted text
   * @param {string} key - Decryption key
   * @returns {string} Decrypted text
   */
  decryptCryptoJS(encryptedText, key = null) {
    try {
      const encryptionKey = key || this.encryptionKey;
      const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      throw new Error(`CryptoJS decryption failed: ${error.message}`);
    }
  }

  /**
   * Hash sensitive data (one-way)
   * @param {string} text - Text to hash
   * @param {string} salt - Salt for hashing (optional)
   * @returns {Object} Hash with salt
   */
  hash(text, salt = null) {
    try {
      const hashSalt = salt || crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(text, hashSalt, 100000, 64, 'sha512');
      return {
        hash: hash.toString('hex'),
        salt: hashSalt
      };
    } catch (error) {
      throw new Error(`Hashing failed: ${error.message}`);
    }
  }

  /**
   * Verify hash
   * @param {string} text - Text to verify
   * @param {string} hash - Hash to verify against
   * @param {string} salt - Salt used for hashing
   * @returns {boolean} Whether the hash matches
   */
  verifyHash(text, hash, salt) {
    try {
      const testHash = crypto.pbkdf2Sync(text, salt, 100000, 64, 'sha512');
      return testHash.toString('hex') === hash;
    } catch (error) {
      throw new Error(`Hash verification failed: ${error.message}`);
    }
  }

  /**
   * Encrypt database field
   * @param {string} value - Value to encrypt
   * @param {string} fieldType - Type of field (email, phone, etc.)
   * @returns {string} JSON string of encrypted data
   */
  encryptField(value, fieldType = 'general') {
    if (!value) return null;
    
    try {
      const encrypted = this.encrypt(value);
      return JSON.stringify({
        ...encrypted,
        fieldType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Failed to encrypt field ${fieldType}:`, error);
      return null;
    }
  }

  /**
   * Decrypt database field
   * @param {string} encryptedValue - Encrypted value from database
   * @returns {string} Decrypted value
   */
  decryptField(encryptedValue) {
    if (!encryptedValue) return null;
    
    try {
      const encryptedData = JSON.parse(encryptedValue);
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error('Failed to decrypt field:', error);
      return null;
    }
  }

  /**
   * Encrypt user sensitive data
   * @param {Object} userData - User data object
   * @returns {Object} User data with encrypted sensitive fields
   */
  encryptUserData(userData) {
    const encrypted = { ...userData };
    
    // Encrypt sensitive fields
    const sensitiveFields = ['email', 'phone', 'firstName', 'lastName', 'address'];
    
    sensitiveFields.forEach(field => {
      if (encrypted[field]) {
        encrypted[field] = this.encryptField(encrypted[field], field);
      }
    });

    return encrypted;
  }

  /**
   * Decrypt user sensitive data
   * @param {Object} userData - User data object with encrypted fields
   * @returns {Object} User data with decrypted sensitive fields
   */
  decryptUserData(userData) {
    const decrypted = { ...userData };
    
    // Decrypt sensitive fields
    const sensitiveFields = ['email', 'phone', 'firstName', 'lastName', 'address'];
    
    sensitiveFields.forEach(field => {
      if (decrypted[field]) {
        decrypted[field] = this.decryptField(decrypted[field]);
      }
    });

    return decrypted;
  }

  /**
   * Generate secure random token
   * @param {number} length - Token length in bytes
   * @returns {string} Base64 encoded token
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('base64');
  }

  /**
   * Generate secure random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  generateSecureString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Create secure hash for API keys
   * @param {string} apiKey - API key to hash
   * @returns {string} Hashed API key
   */
  hashApiKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Verify API key hash
   * @param {string} apiKey - API key to verify
   * @param {string} hash - Hash to verify against
   * @returns {boolean} Whether the API key matches the hash
   */
  verifyApiKey(apiKey, hash) {
    const apiKeyHash = this.hashApiKey(apiKey);
    return apiKeyHash === hash;
  }

  /**
   * Encrypt file content
   * @param {Buffer} fileBuffer - File content as buffer
   * @param {string} key - Encryption key
   * @returns {Object} Encrypted file data
   */
  encryptFile(fileBuffer, key = null) {
    try {
      const encryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.encryptionKey, 'utf8');
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, encryptionKey);
      
      const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
      const tag = cipher.getAuthTag();

      return {
        encrypted: encrypted.toString('base64'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      throw new Error(`File encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypt file content
   * @param {Object} encryptedFileData - Encrypted file data
   * @param {string} key - Decryption key
   * @returns {Buffer} Decrypted file content
   */
  decryptFile(encryptedFileData, key = null) {
    try {
      const { encrypted, iv, tag, algorithm } = encryptedFileData;
      
      const encryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.encryptionKey, 'utf8');
      const decipher = crypto.createDecipher(algorithm, encryptionKey);
      decipher.setAuthTag(Buffer.from(tag, 'hex'));

      const encryptedBuffer = Buffer.from(encrypted, 'base64');
      const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);

      return decrypted;
    } catch (error) {
      throw new Error(`File decryption failed: ${error.message}`);
    }
  }
}

module.exports = new EncryptionService();
