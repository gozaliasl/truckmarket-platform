const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

// Security events storage (in production, use Redis or database)
let securityEvents = [];
let securityMetrics = {
  totalRequests: 0,
  blockedRequests: 0,
  authFailures: 0,
  suspiciousActivity: 0,
  activeUsers: 0,
  systemHealth: 'healthy'
};

// Middleware to track security events
const trackSecurityEvent = (req, res, next) => {
  const event = {
    id: Date.now() + Math.random(),
    timestamp: new Date().toISOString(),
    eventType: req.method + '_' + req.path.replace(/\//g, '_'),
    severity: 'info',
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent') || 'Unknown',
    details: `${req.method} request to ${req.path}`,
    location: 'Unknown'
  };

  securityEvents.unshift(event);
  securityEvents = securityEvents.slice(0, 1000); // Keep last 1000 events
  
  securityMetrics.totalRequests++;
  
  next();
};

// Apply tracking to all routes
router.use(trackSecurityEvent);

// Get security metrics
router.get('/metrics', (req, res) => {
  try {
    // Calculate additional metrics from events
    const recentEvents = securityEvents.filter(event => {
      const eventTime = new Date(event.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return eventTime > oneHourAgo;
    });

    const authFailures = recentEvents.filter(event => 
      event.eventType.includes('AUTH_FAILED') || 
      event.eventType.includes('login') && event.severity === 'warning'
    ).length;

    const blockedRequests = recentEvents.filter(event => 
      event.severity === 'critical'
    ).length;

    const suspiciousActivity = recentEvents.filter(event => 
      event.eventType.includes('SUSPICIOUS') ||
      event.eventType.includes('INJECTION') ||
      event.eventType.includes('XSS')
    ).length;

    const activeUsers = new Set(
      recentEvents
        .filter(event => event.userAgent && event.userAgent !== 'Unknown')
        .map(event => event.ip)
    ).size;

    const updatedMetrics = {
      ...securityMetrics,
      authFailures,
      blockedRequests,
      suspiciousActivity,
      activeUsers,
      systemHealth: blockedRequests > 10 ? 'warning' : 'healthy'
    };

    res.json({
      success: true,
      data: updatedMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting security metrics:', error);
    res.status(500).json({
      error: 'Failed to get security metrics',
      message: 'Unable to retrieve security data'
    });
  }
});

// Get security events
router.get('/events', (req, res) => {
  try {
    const { limit = 50, severity, eventType } = req.query;
    
    let filteredEvents = [...securityEvents];
    
    if (severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }
    
    if (eventType) {
      filteredEvents = filteredEvents.filter(event => 
        event.eventType.toLowerCase().includes(eventType.toLowerCase())
      );
    }
    
    const limitedEvents = filteredEvents.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: limitedEvents,
      total: filteredEvents.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting security events:', error);
    res.status(500).json({
      error: 'Failed to get security events',
      message: 'Unable to retrieve security events'
    });
  }
});

// Get real-time events (WebSocket simulation)
router.get('/events/realtime', (req, res) => {
  try {
    const recentEvents = securityEvents.filter(event => {
      const eventTime = new Date(event.timestamp);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      return eventTime > fiveMinutesAgo;
    });

    res.json({
      success: true,
      data: recentEvents,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting real-time events:', error);
    res.status(500).json({
      error: 'Failed to get real-time events',
      message: 'Unable to retrieve real-time security events'
    });
  }
});

// Get security status
router.get('/status', (req, res) => {
  try {
    const securityStatus = {
      httpsEnforcement: true,
      rateLimiting: true,
      inputValidation: true,
      sqlInjectionProtection: true,
      xssProtection: true,
      mfaSystem: true,
      fileUploadSecurity: true,
      apiKeyManagement: true,
      securityMonitoring: true,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: securityStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting security status:', error);
    res.status(500).json({
      error: 'Failed to get security status',
      message: 'Unable to retrieve security status'
    });
  }
});

// Add custom security event (for testing)
router.post('/events', (req, res) => {
  try {
    const { eventType, severity, details, ip, userAgent } = req.body;
    
    const event = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      eventType: eventType || 'CUSTOM_EVENT',
      severity: severity || 'info',
      ip: ip || req.ip || 'Unknown',
      userAgent: userAgent || req.get('User-Agent') || 'Unknown',
      details: details || 'Custom security event',
      location: 'Unknown'
    };

    securityEvents.unshift(event);
    securityEvents = securityEvents.slice(0, 1000);

    res.json({
      success: true,
      data: event,
      message: 'Security event added successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error adding security event:', error);
    res.status(500).json({
      error: 'Failed to add security event',
      message: 'Unable to add security event'
    });
  }
});

// Get security dashboard summary
router.get('/dashboard', (req, res) => {
  try {
    const recentEvents = securityEvents.filter(event => {
      const eventTime = new Date(event.timestamp);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return eventTime > oneHourAgo;
    });

    const summary = {
      totalEvents: securityEvents.length,
      recentEvents: recentEvents.length,
      criticalEvents: recentEvents.filter(e => e.severity === 'critical').length,
      warningEvents: recentEvents.filter(e => e.severity === 'warning').length,
      infoEvents: recentEvents.filter(e => e.severity === 'info').length,
      topEventTypes: getTopEventTypes(recentEvents),
      topIPs: getTopIPs(recentEvents),
      systemHealth: recentEvents.filter(e => e.severity === 'critical').length > 10 ? 'warning' : 'healthy'
    };

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    res.status(500).json({
      error: 'Failed to get dashboard summary',
      message: 'Unable to retrieve dashboard data'
    });
  }
});

// Helper functions
function getTopEventTypes(events) {
  const eventCounts = {};
  events.forEach(event => {
    eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1;
  });
  
  return Object.entries(eventCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ type, count }));
}

function getTopIPs(events) {
  const ipCounts = {};
  events.forEach(event => {
    ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
  });
  
  return Object.entries(ipCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([ip, count]) => ({ ip, count }));
}

module.exports = router;
