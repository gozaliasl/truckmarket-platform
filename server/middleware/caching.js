const NodeCache = require('node-cache');

// Create cache instances for different data types
const vehicleCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  useClones: false 
});

const userCache = new NodeCache({ 
  stdTTL: 600, // 10 minutes
  checkperiod: 120 
});

const searchCache = new NodeCache({ 
  stdTTL: 180, // 3 minutes
  checkperiod: 60 
});

const aiCache = new NodeCache({ 
  stdTTL: 900, // 15 minutes
  checkperiod: 120 
});

// Cache statistics
let cacheStats = {
  vehicleCache: { hits: 0, misses: 0, sets: 0 },
  userCache: { hits: 0, misses: 0, sets: 0 },
  searchCache: { hits: 0, misses: 0, sets: 0 },
  aiCache: { hits: 0, misses: 0, sets: 0 }
};

// Vehicle caching middleware
const cacheVehicles = (req, res, next) => {
  const cacheKey = `vehicles_${JSON.stringify(req.query)}`;
  
  const cachedData = vehicleCache.get(cacheKey);
  if (cachedData) {
    cacheStats.vehicleCache.hits++;
    return res.json({
      success: true,
      data: cachedData,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }
  
  cacheStats.vehicleCache.misses++;
  
  // Store original res.json
  const originalJson = res.json;
  
  // Override res.json to cache the response
  res.json = function(data) {
    if (data.success && data.data) {
      vehicleCache.set(cacheKey, data.data);
      cacheStats.vehicleCache.sets++;
    }
    return originalJson.call(this, data);
  };
  
  next();
};

// User caching middleware
const cacheUser = (req, res, next) => {
  const userId = req.params.id || req.user?.id;
  if (!userId) return next();
  
  const cacheKey = `user_${userId}`;
  
  const cachedData = userCache.get(cacheKey);
  if (cachedData) {
    cacheStats.userCache.hits++;
    return res.json({
      success: true,
      data: cachedData,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }
  
  cacheStats.userCache.misses++;
  
  const originalJson = res.json;
  res.json = function(data) {
    if (data.success && data.data) {
      userCache.set(cacheKey, data.data);
      cacheStats.userCache.sets++;
    }
    return originalJson.call(this, data);
  };
  
  next();
};

// Search caching middleware
const cacheSearch = (req, res, next) => {
  const searchKey = `search_${JSON.stringify(req.body)}`;
  
  const cachedData = searchCache.get(searchKey);
  if (cachedData) {
    cacheStats.searchCache.hits++;
    return res.json({
      success: true,
      data: cachedData,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }
  
  cacheStats.searchCache.misses++;
  
  const originalJson = res.json;
  res.json = function(data) {
    if (data.success && data.data) {
      searchCache.set(searchKey, data.data);
      cacheStats.searchCache.sets++;
    }
    return originalJson.call(this, data);
  };
  
  next();
};

// AI caching middleware
const cacheAI = (req, res, next) => {
  const aiKey = `ai_${req.body.message}_${JSON.stringify(req.body)}`;
  
  const cachedData = aiCache.get(aiKey);
  if (cachedData) {
    cacheStats.aiCache.hits++;
    return res.json({
      success: true,
      data: cachedData,
      cached: true,
      timestamp: new Date().toISOString()
    });
  }
  
  cacheStats.aiCache.misses++;
  
  const originalJson = res.json;
  res.json = function(data) {
    if (data.success && data.data) {
      aiCache.set(aiKey, data.data);
      cacheStats.aiCache.sets++;
    }
    return originalJson.call(this, data);
  };
  
  next();
};

// Cache invalidation functions
const invalidateVehicleCache = (vehicleId) => {
  const keys = vehicleCache.keys();
  keys.forEach(key => {
    if (key.includes('vehicles_')) {
      vehicleCache.del(key);
    }
  });
};

const invalidateUserCache = (userId) => {
  userCache.del(`user_${userId}`);
};

const invalidateSearchCache = () => {
  searchCache.flushAll();
};

const invalidateAICache = () => {
  aiCache.flushAll();
};

// Cache statistics endpoint
const getCacheStats = () => {
  const totalHits = Object.values(cacheStats).reduce((sum, stat) => sum + stat.hits, 0);
  const totalMisses = Object.values(cacheStats).reduce((sum, stat) => sum + stat.misses, 0);
  const totalSets = Object.values(cacheStats).reduce((sum, stat) => sum + stat.sets, 0);
  
  const hitRate = totalHits + totalMisses > 0 ? (totalHits / (totalHits + totalMisses) * 100).toFixed(2) : 0;
  
  return {
    ...cacheStats,
    total: {
      hits: totalHits,
      misses: totalMisses,
      sets: totalSets,
      hitRate: `${hitRate}%`
    },
    memory: {
      vehicleCache: vehicleCache.getStats(),
      userCache: userCache.getStats(),
      searchCache: searchCache.getStats(),
      aiCache: aiCache.getStats()
    }
  };
};

// Clear all caches
const clearAllCaches = () => {
  vehicleCache.flushAll();
  userCache.flushAll();
  searchCache.flushAll();
  aiCache.flushAll();
  
  // Reset stats
  Object.keys(cacheStats).forEach(key => {
    cacheStats[key] = { hits: 0, misses: 0, sets: 0 };
  });
};

module.exports = {
  cacheVehicles,
  cacheUser,
  cacheSearch,
  cacheAI,
  invalidateVehicleCache,
  invalidateUserCache,
  invalidateSearchCache,
  invalidateAICache,
  getCacheStats,
  clearAllCaches,
  vehicleCache,
  userCache,
  searchCache,
  aiCache
};
