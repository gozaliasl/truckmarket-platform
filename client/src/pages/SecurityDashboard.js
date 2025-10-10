import React, { useState, useEffect } from 'react';
import './SecurityDashboard.css';

const SecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    blockedRequests: 0,
    authFailures: 0,
    suspiciousActivity: 0,
    activeUsers: 0,
    systemHealth: 'healthy'
  });
  const [realTimeEvents, setRealTimeEvents] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load real-time security data
  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        // Load metrics
        const metricsResponse = await fetch('http://localhost:5001/api/security/metrics');
        if (metricsResponse.ok) {
          const metricsData = await metricsResponse.json();
          setMetrics(metricsData.data);
        }

        // Load real-time events
        const eventsResponse = await fetch('http://localhost:5001/api/security/events/realtime');
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          setRealTimeEvents(eventsData.data);
        }

        setIsConnected(true);
      } catch (error) {
        console.error('Failed to load security data:', error);
        setIsConnected(false);
      }
    };

    // Load initial data
    loadSecurityData();

    // Set up real-time updates every 5 seconds
    const interval = setInterval(loadSecurityData, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load historical security events
  useEffect(() => {
    const loadSecurityEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/security/events?limit=100');
        if (response.ok) {
          const data = await response.json();
          setSecurityEvents(data.data);
        }
      } catch (error) {
        console.error('Failed to load security events:', error);
      }
    };

    loadSecurityEvents();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getEventTypeIcon = (eventType) => {
    switch (eventType) {
      case 'AUTH_FAILED': return '🔐';
      case 'AUTH_SUCCESS': return '✅';
      case 'RATE_LIMIT_EXCEEDED': return '⏱️';
      case 'SUSPICIOUS_ACTIVITY': return '🚨';
      case 'SQL_INJECTION_ATTEMPT': return '💉';
      case 'XSS_ATTEMPT': return '🛡️';
      case 'FILE_UPLOAD': return '📁';
      case 'API_KEY_USAGE': return '🔑';
      case 'MFA_SETUP': return '🔒';
      case 'MFA_VERIFICATION': return '🔐';
      default: return '📊';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="security-dashboard">
      <div className="dashboard-header">
        <h1>🛡️ Security Dashboard</h1>
        <div className="connection-status">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Total Requests</h3>
            <p className="metric-value">{metrics.totalRequests.toLocaleString()}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚫</div>
          <div className="metric-content">
            <h3>Blocked Requests</h3>
            <p className="metric-value">{metrics.blockedRequests}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔐</div>
          <div className="metric-content">
            <h3>Auth Failures</h3>
            <p className="metric-value">{metrics.authFailures}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚨</div>
          <div className="metric-content">
            <h3>Suspicious Activity</h3>
            <p className="metric-value">{metrics.suspiciousActivity}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Active Users</h3>
            <p className="metric-value">{metrics.activeUsers}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💚</div>
          <div className="metric-content">
            <h3>System Health</h3>
            <p className="metric-value">{metrics.systemHealth}</p>
          </div>
        </div>
      </div>

      {/* Real-time Events */}
      <div className="dashboard-section">
        <h2>🔴 Real-time Security Events</h2>
        <div className="events-container">
          {realTimeEvents.length === 0 ? (
            <div className="no-events">No recent security events</div>
          ) : (
            realTimeEvents.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-icon">{getEventTypeIcon(event.eventType)}</div>
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-type">{event.eventType}</span>
                    <span 
                      className="event-severity"
                      style={{ color: getSeverityColor(event.severity) }}
                    >
                      {event.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="event-details">
                    <p>{event.details}</p>
                    <div className="event-meta">
                      <span>IP: {event.ip}</span>
                      <span>Time: {formatTimestamp(event.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historical Events */}
      <div className="dashboard-section">
        <h2>📈 Historical Security Events</h2>
        <div className="events-table-container">
          <table className="events-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event Type</th>
                <th>Severity</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {securityEvents.map((event) => (
                <tr key={event.id}>
                  <td>{formatTimestamp(event.timestamp)}</td>
                  <td>
                    <span className="event-type-cell">
                      {getEventTypeIcon(event.eventType)} {event.eventType}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="severity-badge"
                      style={{ backgroundColor: getSeverityColor(event.severity) }}
                    >
                      {event.severity}
                    </span>
                  </td>
                  <td>{event.ip}</td>
                  <td>{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Status */}
      <div className="dashboard-section">
        <h2>🛡️ Security Status</h2>
        <div className="security-status-grid">
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>HTTPS Enforcement</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>Rate Limiting</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>Input Validation</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>SQL Injection Protection</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>XSS Protection</h4>
              <p>Active</p>
            </div>
          </div>
          <div className="status-item">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h4>MFA System</h4>
              <p>Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
