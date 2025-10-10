const fs = require('fs');
const path = require('path');

// Security event logging
const logSecurityEvent = (eventType, details, req) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const url = req.originalUrl || req.url;
  const method = req.method;

  const logEntry = {
    timestamp,
    eventType,
    ip,
    userAgent,
    method,
    url,
    details,
    headers: {
      referer: req.get('Referer'),
      origin: req.get('Origin'),
      host: req.get('Host')
    }
  };

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`🚨 Security Event: ${eventType}`, logEntry);
  }

  // Log to file
  const logDir = path.join(__dirname, '../logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'security.log');
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
};

// Suspicious activity detection
const detectSuspiciousActivity = (req) => {
  const suspiciousPatterns = [
    // SQL injection attempts
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    // XSS attempts
    /(<\s*script|javascript:|vbscript:|onload\s*=|onerror\s*=)/i,
    // Path traversal
    /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e%5c)/i,
    // Command injection
    /(\||&|;|\$\(|\`)/i,
    // LDAP injection
    /(\*\)|\(&|\(|\))/i,
    // NoSQL injection
    /(\$where|\$ne|\$gt|\$lt|\$regex)/i
  ];

  const checkString = (str) => {
    if (typeof str !== 'string') return false;
    return suspiciousPatterns.some(pattern => pattern.test(str));
  };

  const checkObject = (obj) => {
    if (typeof obj === 'string') {
      return checkString(obj);
    }
    if (Array.isArray(obj)) {
      return obj.some(checkObject);
    }
    if (obj && typeof obj === 'object') {
      return Object.values(obj).some(checkObject);
    }
    return false;
  };

  return checkObject(req.body) || checkObject(req.query) || checkObject(req.params);
};

// Rate limiting monitoring
const rateLimitMonitor = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const key = `rate_limit_${ip}`;
  
  // This would integrate with Redis in production
  // For now, we'll just log rate limit hits
  if (res.get('X-RateLimit-Remaining') === '0') {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip,
      limit: res.get('X-RateLimit-Limit'),
      window: res.get('X-RateLimit-Reset')
    }, req);
  }
  
  next();
};

// Authentication monitoring
const authMonitoring = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log failed authentication attempts
    if (req.path.includes('/auth/') && res.statusCode === 401) {
      logSecurityEvent('AUTH_FAILED', {
        endpoint: req.path,
        method: req.method,
        body: req.body
      }, req);
    }
    
    // Log successful authentication
    if (req.path.includes('/auth/login') && res.statusCode === 200) {
      logSecurityEvent('AUTH_SUCCESS', {
        endpoint: req.path,
        userId: req.body?.email
      }, req);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Suspicious activity monitoring
const suspiciousActivityMonitor = (req, res, next) => {
  if (detectSuspiciousActivity(req)) {
    logSecurityEvent('SUSPICIOUS_ACTIVITY', {
      body: req.body,
      query: req.query,
      params: req.params
    }, req);
    
    // In production, you might want to block the request
    if (process.env.NODE_ENV === 'production') {
      return res.status(400).json({
        error: 'Request blocked due to suspicious activity'
      });
    }
  }
  
  next();
};

// File upload monitoring
const fileUploadMonitor = (req, res, next) => {
  if (req.file || req.files) {
    const files = req.files || [req.file];
    
    files.forEach(file => {
      // Check for suspicious file types
      const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (suspiciousExtensions.includes(fileExtension)) {
        logSecurityEvent('SUSPICIOUS_FILE_UPLOAD', {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }, req);
      }
      
      // Log all file uploads
      logSecurityEvent('FILE_UPLOAD', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      }, req);
    });
  }
  
  next();
};

// Error monitoring
const errorMonitoring = (err, req, res, next) => {
  // Log security-related errors
  if (err.status === 401 || err.status === 403 || err.status === 429) {
    logSecurityEvent('SECURITY_ERROR', {
      status: err.status,
      message: err.message,
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    }, req);
  }
  
  // Log other errors
  logSecurityEvent('ERROR', {
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  }, req);
  
  next(err);
};

// Security headers monitoring
const securityHeadersMonitor = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Check if security headers are present
    const requiredHeaders = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => !res.get(header));
    
    if (missingHeaders.length > 0) {
      logSecurityEvent('MISSING_SECURITY_HEADERS', {
        missing: missingHeaders,
        url: req.url
      }, req);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  logSecurityEvent,
  detectSuspiciousActivity,
  rateLimitMonitor,
  authMonitoring,
  suspiciousActivityMonitor,
  fileUploadMonitor,
  errorMonitoring,
  securityHeadersMonitor
};
