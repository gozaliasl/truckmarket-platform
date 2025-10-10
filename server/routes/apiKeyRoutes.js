const express = require('express');
const router = express.Router();
const apiKeyService = require('../services/apiKeyService');
const { authMiddleware } = require('../auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateAPIKeyCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('scopes')
    .isArray()
    .withMessage('Scopes must be an array'),
  body('scopes.*')
    .isIn(Object.keys(apiKeyService.getAvailableScopes()))
    .withMessage('Invalid scope provided'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expires at must be a valid ISO 8601 date'),
  body('rateLimit')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Rate limit must be between 1 and 10000'),
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
 * GET /api/api-keys
 * Get user's API keys
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const apiKeys = await apiKeyService.getUserAPIKeys(req.user.id);
    
    res.json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to get API keys' });
  }
});

/**
 * POST /api/api-keys
 * Create new API key
 */
router.post('/', authMiddleware, validateAPIKeyCreation, async (req, res) => {
  try {
    const { name, scopes, expiresAt, rateLimit } = req.body;
    
    // Validate scopes
    const scopeValidation = apiKeyService.validateScopes(scopes);
    if (!scopeValidation.valid) {
      return res.status(400).json({
        error: 'Invalid scopes',
        invalidScopes: scopeValidation.invalidScopes,
        availableScopes: scopeValidation.availableScopes
      });
    }

    // Generate API key
    const keyData = apiKeyService.generateAPIKey({
      userId: req.user.id,
      name,
      scopes,
      expiresAt,
      rateLimit: rateLimit || 1000
    });

    // Store API key
    const createdKey = await apiKeyService.createAPIKey(keyData);

    res.status(201).json({
      success: true,
      message: 'API key created successfully',
      data: {
        keyId: createdKey.keyId,
        keyValue: createdKey.keyValue, // Only returned once
        name: createdKey.name,
        scopes: createdKey.scopes,
        expiresAt: createdKey.expiresAt,
        rateLimit: createdKey.rateLimit,
        createdAt: createdKey.createdAt
      },
      warning: 'Store the key value securely. It will not be shown again.'
    });
  } catch (error) {
    console.error('Create API key error:', error);
    res.status(500).json({ error: 'Failed to create API key' });
  }
});

/**
 * PUT /api/api-keys/:keyId
 * Update API key
 */
router.put('/:keyId', authMiddleware, async (req, res) => {
  try {
    const { keyId } = req.params;
    const updates = req.body;

    // Validate scopes if provided
    if (updates.scopes) {
      const scopeValidation = apiKeyService.validateScopes(updates.scopes);
      if (!scopeValidation.valid) {
        return res.status(400).json({
          error: 'Invalid scopes',
          invalidScopes: scopeValidation.invalidScopes,
          availableScopes: scopeValidation.availableScopes
        });
      }
    }

    const success = await apiKeyService.updateAPIKey(keyId, updates);
    
    if (!success) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({
      success: true,
      message: 'API key updated successfully'
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

/**
 * DELETE /api/api-keys/:keyId
 * Delete API key
 */
router.delete('/:keyId', authMiddleware, async (req, res) => {
  try {
    const { keyId } = req.params;
    
    const success = await apiKeyService.deleteAPIKey(keyId, req.user.id);
    
    if (!success) {
      return res.status(404).json({ error: 'API key not found' });
    }

    res.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Delete API key error:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

/**
 * GET /api/api-keys/scopes
 * Get available scopes
 */
router.get('/scopes', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: apiKeyService.getAvailableScopes()
  });
});

/**
 * GET /api/api-keys/:keyId/rate-limit
 * Get API key rate limit status
 */
router.get('/:keyId/rate-limit', authMiddleware, async (req, res) => {
  try {
    const { keyId } = req.params;
    
    const rateLimit = await apiKeyService.checkRateLimit(keyId);
    
    res.json({
      success: true,
      data: rateLimit
    });
  } catch (error) {
    console.error('Get rate limit error:', error);
    res.status(500).json({ error: 'Failed to get rate limit status' });
  }
});

/**
 * POST /api/api-keys/verify
 * Verify API key (for testing)
 */
router.post('/verify', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    const verification = await apiKeyService.verifyAPIKey(apiKey);
    
    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Verify API key error:', error);
    res.status(500).json({ error: 'Failed to verify API key' });
  }
});

/**
 * GET /api/api-keys/usage/:keyId
 * Get API key usage statistics (placeholder)
 */
router.get('/usage/:keyId', authMiddleware, async (req, res) => {
  try {
    const { keyId } = req.params;
    
    // In a real implementation, this would query usage statistics
    res.json({
      success: true,
      data: {
        keyId,
        requestsToday: 0,
        requestsThisMonth: 0,
        lastUsed: null,
        rateLimit: 1000,
        message: 'Usage statistics not yet implemented'
      }
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

module.exports = router;
