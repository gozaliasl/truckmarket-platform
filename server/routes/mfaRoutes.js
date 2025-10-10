const express = require('express');
const router = express.Router();
const mfaService = require('../services/mfaService');
const { authMiddleware } = require('../auth');
const db = require('../database');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateMFA = [
  body('token')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Token must be a 6-digit number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

const validateBackupCode = [
  body('code')
    .isLength({ min: 8, max: 8 })
    .matches(/^[A-F0-9]+$/)
    .withMessage('Backup code must be 8 hexadecimal characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * GET /api/mfa/status
 * Get MFA status for current user
 */
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const mfaStatus = mfaService.getMFAStatus(user);
    res.json({
      success: true,
      data: mfaStatus
    });
  } catch (error) {
    console.error('MFA status error:', error);
    res.status(500).json({ error: 'Failed to get MFA status' });
  }
});

/**
 * POST /api/mfa/setup
 * Start MFA setup process
 */
router.post('/setup', authMiddleware, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.mfaEnabled) {
      return res.status(400).json({ error: 'MFA is already enabled for this user' });
    }

    // Generate MFA secret
    const mfaData = mfaService.generateSecret(user.id, user.email);
    
    // Generate QR code
    const qrCode = await mfaService.generateQRCode(mfaData.qrCodeUrl);

    // Store temporary secret (not enabled yet)
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET mfaSecret = ?, mfaBackupCodes = ? WHERE id = ?',
        [mfaData.secret, JSON.stringify(mfaData.backupCodes), user.id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    mfaService.logMFAEvent('SETUP_STARTED', user.id, { email: user.email });

    res.json({
      success: true,
      data: {
        qrCode,
        manualEntryKey: mfaData.manualEntryKey,
        backupCodes: mfaData.backupCodes,
        message: 'Scan the QR code with your authenticator app or enter the manual key'
      }
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    res.status(500).json({ error: 'Failed to setup MFA' });
  }
});

/**
 * POST /api/mfa/verify-setup
 * Verify MFA setup with a test token
 */
router.post('/verify-setup', authMiddleware, validateMFA, async (req, res) => {
  try {
    const { token } = req.body;

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.mfaSecret) {
      return res.status(400).json({ error: 'MFA setup not started. Please start setup first.' });
    }

    if (user.mfaEnabled) {
      return res.status(400).json({ error: 'MFA is already enabled' });
    }

    // Verify the token
    const isValid = mfaService.validateSetup(user.mfaSecret, token);

    if (!isValid) {
      mfaService.logMFAEvent('SETUP_FAILED', user.id, { 
        email: user.email,
        reason: 'Invalid token'
      });
      return res.status(400).json({ error: 'Invalid token. Please try again.' });
    }

    // Enable MFA
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET mfaEnabled = 1, mfaLastUsed = ? WHERE id = ?',
        [new Date().toISOString(), user.id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    mfaService.logMFAEvent('SETUP_COMPLETED', user.id, { email: user.email });

    res.json({
      success: true,
      message: 'MFA has been successfully enabled',
      data: {
        backupCodes: JSON.parse(user.mfaBackupCodes || '[]'),
        enabled: true
      }
    });
  } catch (error) {
    console.error('MFA verify setup error:', error);
    res.status(500).json({ error: 'Failed to verify MFA setup' });
  }
});

/**
 * POST /api/mfa/verify
 * Verify MFA token for login
 */
router.post('/verify', authMiddleware, validateMFA, async (req, res) => {
  try {
    const { token } = req.body;

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.mfaEnabled || !user.mfaSecret) {
      return res.status(400).json({ error: 'MFA is not enabled for this user' });
    }

    // Verify the token
    const isValid = mfaService.verifyToken(user.mfaSecret, token);

    if (!isValid) {
      mfaService.logMFAEvent('VERIFICATION_FAILED', user.id, { 
        email: user.email,
        ip: req.ip
      });
      return res.status(400).json({ error: 'Invalid MFA token' });
    }

    // Update last used timestamp
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET mfaLastUsed = ? WHERE id = ?',
        [new Date().toISOString(), user.id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    mfaService.logMFAEvent('VERIFICATION_SUCCESS', user.id, { 
      email: user.email,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'MFA verification successful'
    });
  } catch (error) {
    console.error('MFA verify error:', error);
    res.status(500).json({ error: 'Failed to verify MFA token' });
  }
});

/**
 * POST /api/mfa/verify-backup
 * Verify backup code
 */
router.post('/verify-backup', authMiddleware, validateBackupCode, async (req, res) => {
  try {
    const { code } = req.body;

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.mfaEnabled) {
      return res.status(400).json({ error: 'MFA is not enabled for this user' });
    }

    const backupCodes = JSON.parse(user.mfaBackupCodes || '[]');
    const verification = mfaService.verifyBackupCode(code, backupCodes);

    if (!verification.valid) {
      mfaService.logMFAEvent('BACKUP_CODE_FAILED', user.id, { 
        email: user.email,
        ip: req.ip,
        providedCode: code
      });
      return res.status(400).json({ error: 'Invalid backup code' });
    }

    // Update backup codes (remove used one)
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET mfaBackupCodes = ? WHERE id = ?',
        [JSON.stringify(verification.remainingCodes), user.id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    mfaService.logMFAEvent('BACKUP_CODE_USED', user.id, { 
      email: user.email,
      ip: req.ip,
      usedCode: verification.usedCode,
      remainingCodes: verification.remainingCodes.length
    });

    res.json({
      success: true,
      message: 'Backup code verification successful',
      data: {
        remainingCodes: verification.remainingCodes.length
      }
    });
  } catch (error) {
    console.error('MFA backup verify error:', error);
    res.status(500).json({ error: 'Failed to verify backup code' });
  }
});

/**
 * POST /api/mfa/disable
 * Disable MFA for user
 */
router.post('/disable', authMiddleware, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.mfaEnabled) {
      return res.status(400).json({ error: 'MFA is not enabled for this user' });
    }

    // Check if MFA is required for this user
    if (mfaService.isMFARequired(user)) {
      return res.status(400).json({ 
        error: 'MFA cannot be disabled for your account type. Contact support for assistance.' 
      });
    }

    // Disable MFA
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET mfaEnabled = 0, mfaSecret = NULL, mfaBackupCodes = NULL WHERE id = ?',
        [user.id],
        function(err) {
          if (err) reject(err);
          else resolve(this);
        }
      );
    });

    mfaService.logMFAEvent('DISABLED', user.id, { 
      email: user.email,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'MFA has been disabled'
    });
  } catch (error) {
    console.error('MFA disable error:', error);
    res.status(500).json({ error: 'Failed to disable MFA' });
  }
});

/**
 * GET /api/mfa/backup-codes
 * Get remaining backup codes
 */
router.get('/backup-codes', authMiddleware, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT mfaBackupCodes FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const backupCodes = JSON.parse(user.mfaBackupCodes || '[]');

    res.json({
      success: true,
      data: {
        backupCodes,
        count: backupCodes.length
      }
    });
  } catch (error) {
    console.error('MFA backup codes error:', error);
    res.status(500).json({ error: 'Failed to get backup codes' });
  }
});

module.exports = router;
