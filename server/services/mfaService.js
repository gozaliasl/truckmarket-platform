const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class MFAService {
  constructor() {
    this.issuer = 'Road Vehicle Platform';
    this.algorithm = 'sha512';
    this.digits = 6;
    this.period = 30;
  }

  /**
   * Generate a new MFA secret for a user
   * @param {string} userId - User ID
   * @param {string} userEmail - User email
   * @returns {Object} MFA setup data
   */
  generateSecret(userId, userEmail) {
    const secret = speakeasy.generateSecret({
      name: `${userEmail} (${this.issuer})`,
      issuer: this.issuer,
      length: 32,
      algorithm: this.algorithm
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      backupCodes: this.generateBackupCodes(),
      manualEntryKey: secret.base32
    };
  }

  /**
   * Generate backup codes for MFA recovery
   * @returns {Array} Array of backup codes
   */
  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Verify a TOTP token
   * @param {string} secret - User's MFA secret
   * @param {string} token - Token to verify
   * @param {number} window - Time window for verification (default: 1)
   * @returns {boolean} Whether the token is valid
   */
  verifyToken(secret, token, window = 1) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window,
      algorithm: this.algorithm,
      digits: this.digits,
      step: this.period
    });
  }

  /**
   * Generate QR code for MFA setup
   * @param {string} qrCodeUrl - OTP Auth URL
   * @returns {Promise<string>} Base64 encoded QR code
   */
  async generateQRCode(qrCodeUrl) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }

  /**
   * Verify backup code
   * @param {string} providedCode - Code provided by user
   * @param {Array} validCodes - Array of valid backup codes
   * @returns {Object} Verification result
   */
  verifyBackupCode(providedCode, validCodes) {
    const normalizedCode = providedCode.toUpperCase().trim();
    const index = validCodes.indexOf(normalizedCode);
    
    if (index === -1) {
      return { valid: false, remainingCodes: validCodes };
    }

    // Remove used backup code
    const updatedCodes = validCodes.filter((_, i) => i !== index);
    
    return {
      valid: true,
      remainingCodes: updatedCodes,
      usedCode: normalizedCode
    };
  }

  /**
   * Check if MFA is required for user
   * @param {Object} user - User object
   * @returns {boolean} Whether MFA is required
   */
  isMFARequired(user) {
    // Require MFA for admin users, premium users, or users with sensitive data
    return user.role === 'admin' || 
           user.tier === 'premium' || 
           user.tier === 'enterprise' ||
           user.mfaEnabled === true;
  }

  /**
   * Generate recovery codes for MFA reset
   * @param {string} userId - User ID
   * @returns {Array} Recovery codes
   */
  generateRecoveryCodes(userId) {
    const codes = [];
    for (let i = 0; i < 5; i++) {
      codes.push(crypto.randomBytes(8).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Validate MFA setup
   * @param {string} secret - MFA secret
   * @param {string} token - Test token
   * @returns {boolean} Whether setup is valid
   */
  validateSetup(secret, token) {
    return this.verifyToken(secret, token, 2); // Allow 2 time windows for setup
  }

  /**
   * Get MFA status for user
   * @param {Object} user - User object
   * @returns {Object} MFA status
   */
  getMFAStatus(user) {
    return {
      enabled: user.mfaEnabled || false,
      required: this.isMFARequired(user),
      setupComplete: !!(user.mfaSecret && user.mfaEnabled),
      backupCodesCount: user.mfaBackupCodes ? user.mfaBackupCodes.length : 0,
      lastUsed: user.mfaLastUsed || null
    };
  }

  /**
   * Log MFA event for security monitoring
   * @param {string} eventType - Type of MFA event
   * @param {string} userId - User ID
   * @param {Object} details - Event details
   */
  logMFAEvent(eventType, userId, details = {}) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType: `MFA_${eventType}`,
      userId,
      details,
      severity: this.getEventSeverity(eventType)
    };

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🔐 MFA Event: ${eventType}`, event);
    }

    // In production, this would be sent to a logging service
    return event;
  }

  /**
   * Get severity level for MFA events
   * @param {string} eventType - Event type
   * @returns {string} Severity level
   */
  getEventSeverity(eventType) {
    const severityMap = {
      'SETUP_STARTED': 'info',
      'SETUP_COMPLETED': 'info',
      'SETUP_FAILED': 'warning',
      'VERIFICATION_SUCCESS': 'info',
      'VERIFICATION_FAILED': 'warning',
      'BACKUP_CODE_USED': 'warning',
      'BACKUP_CODE_FAILED': 'warning',
      'RECOVERY_CODE_USED': 'critical',
      'RECOVERY_CODE_FAILED': 'critical',
      'DISABLED': 'warning',
      'ENABLED': 'info'
    };

    return severityMap[eventType] || 'info';
  }
}

module.exports = new MFAService();
