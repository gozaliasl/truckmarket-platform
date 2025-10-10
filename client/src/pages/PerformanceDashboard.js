import React, { useState, useEffect } from 'react';
import './PerformanceDashboard.css';

const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] = useState({
    cacheStats: {
      vehicleCache: { hits: 0, misses: 0, sets: 0 },
      userCache: { hits: 0, misses: 0, sets: 0 },
      searchCache: { hits: 0, misses: 0, sets: 0 },
      aiCache: { hits: 0, misses: 0, sets: 0 },
      total: { hits: 0, misses: 0, sets: 0, hitRate: '0%' }
    },
    databaseStats: {
      tables: [],
      databaseSize: 0,
      cacheSize: 0,
      journalMode: 'WAL'
    },
    performanceMetrics: {
      totalQueries: 0,
      slowQueries: 0,
      averageExecutionTime: 0,
      slowQueryPercentage: '0%'
    },
    systemMetrics: {
      memoryUsage: 0,
      cpuUsage: 0,
      responseTime: 0,
      throughput: 0
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPerformanceData = async () => {
      try {
        setIsLoading(true);
        
        // Load cache statistics
        const cacheResponse = await fetch('http://localhost:5001/api/performance/cache-stats');
        if (cacheResponse.ok) {
          const cacheData = await cacheResponse.json();
          setPerformanceData(prev => ({
            ...prev,
            cacheStats: cacheData.data
          }));
        }

        // Load database statistics
        const dbResponse = await fetch('http://localhost:5001/api/performance/database-stats');
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          setPerformanceData(prev => ({
            ...prev,
            databaseStats: dbData.data
          }));
        }

        // Load performance metrics
        const perfResponse = await fetch('http://localhost:5001/api/performance/metrics');
        if (perfResponse.ok) {
          const perfData = await perfResponse.json();
          setPerformanceData(prev => ({
            ...prev,
            performanceMetrics: perfData.data
          }));
        }

        // Load system metrics
        const systemResponse = await fetch('http://localhost:5001/api/performance/system');
        if (systemResponse.ok) {
          const systemData = await systemResponse.json();
          setPerformanceData(prev => ({
            ...prev,
            systemMetrics: systemData.data
          }));
        }

      } catch (error) {
        console.error('Failed to load performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load initial data
    loadPerformanceData();

    // Set up real-time updates every 10 seconds
    const interval = setInterval(loadPerformanceData, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return '#10b981';
    if (value <= thresholds.warning) return '#f59e0b';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div className="performance-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-dashboard">
      <div className="dashboard-header">
        <h1>⚡ Performance Dashboard</h1>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* System Overview */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">💾</div>
          <div className="metric-content">
            <h3>Memory Usage</h3>
            <p className="metric-value">{formatBytes(performanceData.systemMetrics.memoryUsage)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Response Time</h3>
            <p 
              className="metric-value"
              style={{ color: getPerformanceColor(performanceData.systemMetrics.responseTime, { good: 100, warning: 500 }) }}
            >
              {formatTime(performanceData.systemMetrics.responseTime)}
            </p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Throughput</h3>
            <p className="metric-value">{performanceData.systemMetrics.throughput} req/s</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🗄️</div>
          <div className="metric-content">
            <h3>Database Size</h3>
            <p className="metric-value">{formatBytes(performanceData.databaseStats.databaseSize)}</p>
          </div>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="dashboard-section">
        <h2>🚀 Cache Performance</h2>
        <div className="cache-stats-grid">
          <div className="cache-stat-card">
            <h4>Vehicle Cache</h4>
            <div className="cache-metrics">
              <div className="cache-metric">
                <span>Hits:</span>
                <span>{performanceData.cacheStats.vehicleCache.hits}</span>
              </div>
              <div className="cache-metric">
                <span>Misses:</span>
                <span>{performanceData.cacheStats.vehicleCache.misses}</span>
              </div>
              <div className="cache-metric">
                <span>Hit Rate:</span>
                <span style={{ color: '#10b981' }}>
                  {performanceData.cacheStats.vehicleCache.hits + performanceData.cacheStats.vehicleCache.misses > 0 
                    ? ((performanceData.cacheStats.vehicleCache.hits / (performanceData.cacheStats.vehicleCache.hits + performanceData.cacheStats.vehicleCache.misses)) * 100).toFixed(1) + '%'
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="cache-stat-card">
            <h4>User Cache</h4>
            <div className="cache-metrics">
              <div className="cache-metric">
                <span>Hits:</span>
                <span>{performanceData.cacheStats.userCache.hits}</span>
              </div>
              <div className="cache-metric">
                <span>Misses:</span>
                <span>{performanceData.cacheStats.userCache.misses}</span>
              </div>
              <div className="cache-metric">
                <span>Hit Rate:</span>
                <span style={{ color: '#10b981' }}>
                  {performanceData.cacheStats.userCache.hits + performanceData.cacheStats.userCache.misses > 0 
                    ? ((performanceData.cacheStats.userCache.hits / (performanceData.cacheStats.userCache.hits + performanceData.cacheStats.userCache.misses)) * 100).toFixed(1) + '%'
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="cache-stat-card">
            <h4>Search Cache</h4>
            <div className="cache-metrics">
              <div className="cache-metric">
                <span>Hits:</span>
                <span>{performanceData.cacheStats.searchCache.hits}</span>
              </div>
              <div className="cache-metric">
                <span>Misses:</span>
                <span>{performanceData.cacheStats.searchCache.misses}</span>
              </div>
              <div className="cache-metric">
                <span>Hit Rate:</span>
                <span style={{ color: '#10b981' }}>
                  {performanceData.cacheStats.searchCache.hits + performanceData.cacheStats.searchCache.misses > 0 
                    ? ((performanceData.cacheStats.searchCache.hits / (performanceData.cacheStats.searchCache.hits + performanceData.cacheStats.searchCache.misses)) * 100).toFixed(1) + '%'
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="cache-stat-card">
            <h4>AI Cache</h4>
            <div className="cache-metrics">
              <div className="cache-metric">
                <span>Hits:</span>
                <span>{performanceData.cacheStats.aiCache.hits}</span>
              </div>
              <div className="cache-metric">
                <span>Misses:</span>
                <span>{performanceData.cacheStats.aiCache.misses}</span>
              </div>
              <div className="cache-metric">
                <span>Hit Rate:</span>
                <span style={{ color: '#10b981' }}>
                  {performanceData.cacheStats.aiCache.hits + performanceData.cacheStats.aiCache.misses > 0 
                    ? ((performanceData.cacheStats.aiCache.hits / (performanceData.cacheStats.aiCache.hits + performanceData.cacheStats.aiCache.misses)) * 100).toFixed(1) + '%'
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="total-cache-stats">
          <h3>Overall Cache Performance</h3>
          <div className="total-stats">
            <div className="total-stat">
              <span>Total Hits:</span>
              <span>{performanceData.cacheStats.total.hits}</span>
            </div>
            <div className="total-stat">
              <span>Total Misses:</span>
              <span>{performanceData.cacheStats.total.misses}</span>
            </div>
            <div className="total-stat">
              <span>Overall Hit Rate:</span>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                {performanceData.cacheStats.total.hitRate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Database Performance */}
      <div className="dashboard-section">
        <h2>🗄️ Database Performance</h2>
        <div className="db-stats-grid">
          <div className="db-stat-card">
            <h4>Query Performance</h4>
            <div className="db-metrics">
              <div className="db-metric">
                <span>Total Queries:</span>
                <span>{performanceData.performanceMetrics.totalQueries}</span>
              </div>
              <div className="db-metric">
                <span>Slow Queries:</span>
                <span style={{ color: getPerformanceColor(performanceData.performanceMetrics.slowQueries, { good: 5, warning: 20 }) }}>
                  {performanceData.performanceMetrics.slowQueries}
                </span>
              </div>
              <div className="db-metric">
                <span>Avg Execution Time:</span>
                <span style={{ color: getPerformanceColor(performanceData.performanceMetrics.averageExecutionTime, { good: 50, warning: 200 }) }}>
                  {formatTime(performanceData.performanceMetrics.averageExecutionTime)}
                </span>
              </div>
              <div className="db-metric">
                <span>Slow Query %:</span>
                <span style={{ color: getPerformanceColor(parseFloat(performanceData.performanceMetrics.slowQueryPercentage), { good: 5, warning: 15 }) }}>
                  {performanceData.performanceMetrics.slowQueryPercentage}
                </span>
              </div>
            </div>
          </div>

          <div className="db-stat-card">
            <h4>Database Info</h4>
            <div className="db-metrics">
              <div className="db-metric">
                <span>Database Size:</span>
                <span>{formatBytes(performanceData.databaseStats.databaseSize)}</span>
              </div>
              <div className="db-metric">
                <span>Cache Size:</span>
                <span>{formatBytes(performanceData.databaseStats.cacheSize)}</span>
              </div>
              <div className="db-metric">
                <span>Journal Mode:</span>
                <span>{performanceData.databaseStats.journalMode}</span>
              </div>
              <div className="db-metric">
                <span>Tables:</span>
                <span>{performanceData.databaseStats.tables.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Recommendations */}
      <div className="dashboard-section">
        <h2>💡 Performance Recommendations</h2>
        <div className="recommendations">
          <div className="recommendation-card">
            <div className="recommendation-icon">🚀</div>
            <div className="recommendation-content">
              <h4>Enable CDN</h4>
              <p>Implement a Content Delivery Network for static assets to reduce load times globally.</p>
            </div>
          </div>

          <div className="recommendation-card">
            <div className="recommendation-icon">🗄️</div>
            <div className="recommendation-content">
              <h4>Database Indexing</h4>
              <p>Add indexes to frequently queried columns to improve database performance.</p>
            </div>
          </div>

          <div className="recommendation-card">
            <div className="recommendation-icon">📦</div>
            <div className="recommendation-content">
              <h4>Code Splitting</h4>
              <p>Implement code splitting to reduce initial bundle size and improve load times.</p>
            </div>
          </div>

          <div className="recommendation-card">
            <div className="recommendation-icon">🖼️</div>
            <div className="recommendation-content">
              <h4>Image Optimization</h4>
              <p>Compress and optimize images to reduce bandwidth usage and improve page load times.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
