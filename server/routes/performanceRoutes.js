const express = require('express');
const router = express.Router();
const { 
  getCacheStats, 
  clearAllCaches,
  vehicleCache,
  userCache,
  searchCache,
  aiCache
} = require('../middleware/caching');
const { 
  getDatabaseStats, 
  getOptimizationSuggestions, 
  performMaintenance,
  getPerformanceMetrics
} = require('../middleware/databaseOptimization');

// Get cache statistics
router.get('/cache-stats', (req, res) => {
  try {
    const stats = getCacheStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({
      error: 'Failed to get cache statistics',
      message: 'Unable to retrieve cache data'
    });
  }
});

// Clear all caches
router.post('/cache/clear', (req, res) => {
  try {
    clearAllCaches();
    res.json({
      success: true,
      message: 'All caches cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing caches:', error);
    res.status(500).json({
      error: 'Failed to clear caches',
      message: 'Unable to clear cache data'
    });
  }
});

// Get database statistics
router.get('/database-stats', async (req, res) => {
  try {
    const stats = await getDatabaseStats();
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting database stats:', error);
    res.status(500).json({
      error: 'Failed to get database statistics',
      message: 'Unable to retrieve database data'
    });
  }
});

// Get performance metrics
router.get('/metrics', (req, res) => {
  try {
    const metrics = getPerformanceMetrics();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({
      error: 'Failed to get performance metrics',
      message: 'Unable to retrieve performance data'
    });
  }
});

// Get optimization suggestions
router.get('/optimization-suggestions', async (req, res) => {
  try {
    const suggestions = await getOptimizationSuggestions();
    res.json({
      success: true,
      data: suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    res.status(500).json({
      error: 'Failed to get optimization suggestions',
      message: 'Unable to retrieve optimization data'
    });
  }
});

// Perform database maintenance
router.post('/maintenance', async (req, res) => {
  try {
    const result = await performMaintenance();
    res.json({
      success: true,
      message: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error performing maintenance:', error);
    res.status(500).json({
      error: 'Failed to perform maintenance',
      message: 'Unable to complete database maintenance'
    });
  }
});

// Get system metrics (simulated)
router.get('/system', (req, res) => {
  try {
    // Simulate system metrics
    const systemMetrics = {
      memoryUsage: Math.floor(Math.random() * 1000000000) + 500000000, // 500MB - 1.5GB
      cpuUsage: Math.floor(Math.random() * 30) + 10, // 10-40%
      responseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      throughput: Math.floor(Math.random() * 100) + 50 // 50-150 req/s
    };

    res.json({
      success: true,
      data: systemMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({
      error: 'Failed to get system metrics',
      message: 'Unable to retrieve system data'
    });
  }
});

// Get performance summary
router.get('/summary', async (req, res) => {
  try {
    const [cacheStats, dbStats, performanceMetrics, systemMetrics] = await Promise.all([
      Promise.resolve(getCacheStats()),
      getDatabaseStats(),
      Promise.resolve(getPerformanceMetrics()),
      Promise.resolve({
        memoryUsage: Math.floor(Math.random() * 1000000000) + 500000000,
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        responseTime: Math.floor(Math.random() * 200) + 50,
        throughput: Math.floor(Math.random() * 100) + 50
      })
    ]);

    const summary = {
      cache: {
        hitRate: cacheStats.total.hitRate,
        totalHits: cacheStats.total.hits,
        totalMisses: cacheStats.total.misses
      },
      database: {
        size: dbStats.databaseSize,
        tables: dbStats.tables.length,
        slowQueries: performanceMetrics.slowQueries,
        avgExecutionTime: performanceMetrics.averageExecutionTime
      },
      system: {
        memoryUsage: systemMetrics.memoryUsage,
        responseTime: systemMetrics.responseTime,
        throughput: systemMetrics.throughput
      },
      health: {
        status: performanceMetrics.slowQueries < 10 && systemMetrics.responseTime < 200 ? 'healthy' : 'warning',
        score: Math.max(0, 100 - (performanceMetrics.slowQueries * 2) - (systemMetrics.responseTime / 10))
      }
    };

    res.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting performance summary:', error);
    res.status(500).json({
      error: 'Failed to get performance summary',
      message: 'Unable to retrieve performance summary'
    });
  }
});

// Performance monitoring endpoint
router.get('/monitor', (req, res) => {
  try {
    const startTime = Date.now();
    
    // Simulate some processing
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      
      res.json({
        success: true,
        data: {
          responseTime,
          timestamp: new Date().toISOString(),
          status: responseTime < 100 ? 'excellent' : responseTime < 300 ? 'good' : 'needs_improvement'
        }
      });
    }, Math.random() * 50); // Random delay up to 50ms
    
  } catch (error) {
    console.error('Error in performance monitoring:', error);
    res.status(500).json({
      error: 'Performance monitoring failed',
      message: 'Unable to monitor performance'
    });
  }
});

module.exports = router;
