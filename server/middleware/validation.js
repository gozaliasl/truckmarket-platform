const validator = require('validator');
const { body, validationResult } = require('express-validator');

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Recursively sanitize all string inputs
  const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
      return validator.escape(obj.trim());
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Vehicle listing validation
const validateVehicleListing = [
  body('brand')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Brand must be between 2 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-&.]+$/)
    .withMessage('Brand contains invalid characters'),
  body('model')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Model must be between 1 and 100 characters'),
  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid year'),
  body('price')
    .isFloat({ min: 0, max: 10000000 })
    .withMessage('Price must be a valid positive number'),
  body('mileage')
    .optional()
    .isInt({ min: 0, max: 2000000 })
    .withMessage('Mileage must be a valid positive number'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Country can only contain letters and spaces'),
  handleValidationErrors
];

// AI Chat validation
const validateAIChat = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters')
    .matches(/^[a-zA-Z0-9\s\.,!?\-@#$%^&*()_+=\[\]{}|;:'"<>\/\\€£¥]+$/)
    .withMessage('Message contains invalid characters'),
  body('userId')
    .optional()
    .isUUID()
    .withMessage('User ID must be a valid UUID'),
  handleValidationErrors
];

// Search query validation
const validateSearchQuery = [
  body('query')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Search query must be between 1 and 500 characters'),
  body('filters')
    .optional()
    .isObject()
    .withMessage('Filters must be an object'),
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const files = req.files || [req.file];
  
  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' 
      });
    }
    
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
  }

  next();
};

// SQL injection prevention
const preventSQLInjection = (req, res, next) => {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/i,
    /(\b(OR|AND)\s+['"]\s*LIKE\s*['"])/i,
    /(UNION\s+SELECT)/i,
    /(DROP\s+TABLE)/i,
    /(DELETE\s+FROM)/i,
    /(INSERT\s+INTO)/i,
    /(UPDATE\s+SET)/i,
    /(CREATE\s+TABLE)/i,
    /(ALTER\s+TABLE)/i,
    /(EXEC\s*\()/i,
    /(SCRIPT\s*\()/i,
    /(<\s*script)/i,
    /(javascript:)/i,
    /(vbscript:)/i,
    /(onload\s*=)/i,
    /(onerror\s*=)/i
  ];

  const checkForSQLInjection = (obj) => {
    if (typeof obj === 'string') {
      for (const pattern of sqlInjectionPatterns) {
        if (pattern.test(obj)) {
          return true;
        }
      }
    } else if (Array.isArray(obj)) {
      return obj.some(checkForSQLInjection);
    } else if (obj && typeof obj === 'object') {
      return Object.values(obj).some(checkForSQLInjection);
    }
    return false;
  };

  if (checkForSQLInjection(req.body) || 
      checkForSQLInjection(req.query) || 
      checkForSQLInjection(req.params)) {
    return res.status(400).json({ 
      error: 'Invalid input detected. Please check your request.' 
    });
  }

  next();
};

module.exports = {
  sanitizeInput,
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateVehicleListing,
  validateAIChat,
  validateSearchQuery,
  validateFileUpload,
  preventSQLInjection
};
