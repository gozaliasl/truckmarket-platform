/**
 * CDN Configuration for Static Assets
 * Optimizes delivery of static files through CDN
 */

const CDN_CONFIG = {
  // CDN URLs for different environments
  development: {
    baseUrl: 'http://localhost:5001',
    staticUrl: 'http://localhost:5001/static',
    imageUrl: 'http://localhost:5001/images'
  },
  
  production: {
    // Replace with your actual CDN URLs
    baseUrl: 'https://your-cdn-domain.com',
    staticUrl: 'https://static.your-domain.com',
    imageUrl: 'https://images.your-domain.com'
  },
  
  // CDN providers configuration
  providers: {
    cloudflare: {
      name: 'Cloudflare',
      baseUrl: 'https://your-domain.com',
      features: ['Global CDN', 'DDoS Protection', 'SSL/TLS', 'Image Optimization'],
      pricing: 'Free tier available'
    },
    
    aws: {
      name: 'AWS CloudFront',
      baseUrl: 'https://d1234567890.cloudfront.net',
      features: ['Global Edge Locations', 'Lambda@Edge', 'Real-time Metrics'],
      pricing: 'Pay per use'
    },
    
    vercel: {
      name: 'Vercel Edge Network',
      baseUrl: 'https://your-app.vercel.app',
      features: ['Automatic CDN', 'Edge Functions', 'Image Optimization'],
      pricing: 'Free tier available'
    }
  }
};

/**
 * Get CDN URL based on environment and asset type
 */
function getCDNUrl(assetType = 'static', environment = 'development') {
  const config = CDN_CONFIG[environment] || CDN_CONFIG.development;
  
  switch (assetType) {
    case 'images':
      return config.imageUrl;
    case 'static':
      return config.staticUrl;
    default:
      return config.baseUrl;
  }
}

/**
 * Generate optimized image URLs with CDN
 */
function getOptimizedImageUrl(imagePath, options = {}) {
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    cdn = true
  } = options;
  
  if (!cdn) {
    return imagePath;
  }
  
  const cdnUrl = getCDNUrl('images');
  const params = new URLSearchParams();
  
  if (width) params.append('w', width);
  if (height) params.append('h', height);
  if (quality) params.append('q', quality);
  if (format) params.append('f', format);
  
  const queryString = params.toString();
  return `${cdnUrl}${imagePath}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Generate responsive image URLs for different screen sizes
 */
function getResponsiveImageUrls(imagePath, sizes = [400, 800, 1200]) {
  return sizes.map(size => ({
    size,
    url: getOptimizedImageUrl(imagePath, { width: size, quality: 85 }),
    url2x: getOptimizedImageUrl(imagePath, { width: size * 2, quality: 85 })
  }));
}

/**
 * CDN middleware for Express.js
 */
function cdnMiddleware(req, res, next) {
  // Add CDN headers for better caching
  res.set({
    'Cache-Control': 'public, max-age=31536000', // 1 year
    'Expires': new Date(Date.now() + 31536000000).toUTCString(),
    'Vary': 'Accept-Encoding',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  
  // Add CDN-specific headers
  if (process.env.NODE_ENV === 'production') {
    res.set({
      'CDN-Cache-Control': 'public, max-age=31536000',
      'CDN-Edge-Cache-TTL': '31536000'
    });
  }
  
  next();
}

/**
 * Generate preload links for critical resources
 */
function generatePreloadLinks(criticalAssets = []) {
  return criticalAssets.map(asset => {
    const { href, as, type, crossorigin } = asset;
    const cdnUrl = getCDNUrl('static');
    const fullUrl = href.startsWith('http') ? href : `${cdnUrl}${href}`;
    
    return `<link rel="preload" href="${fullUrl}" as="${as}"${type ? ` type="${type}"` : ''}${crossorigin ? ` crossorigin="${crossorigin}"` : ''}>`;
  }).join('\n');
}

/**
 * CDN performance monitoring
 */
class CDNPerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageResponseTime: 0,
      totalBandwidth: 0
    };
  }
  
  recordRequest(responseTime, fromCache = false) {
    this.metrics.requests++;
    this.metrics.totalBandwidth += responseTime; // Simplified metric
    
    if (fromCache) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requests - 1) + responseTime) / 
      this.metrics.requests;
  }
  
  getCacheHitRate() {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.getCacheHitRate()
    };
  }
}

// Create global CDN monitor instance
const cdnMonitor = new CDNPerformanceMonitor();

module.exports = {
  CDN_CONFIG,
  getCDNUrl,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  cdnMiddleware,
  generatePreloadLinks,
  CDNPerformanceMonitor,
  cdnMonitor
};
