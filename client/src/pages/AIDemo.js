import React, { useState } from 'react';
import './AIDemo.css';

const AIDemo = () => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [chatMessage, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const [priceEstimate, setPriceEstimate] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [priceTrends, setPriceTrends] = useState(null);

  // Enhanced AI Assistant
  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = { 
      role: 'user', 
      message: chatMessage,
      timestamp: new Date().toISOString()
    };
    setChatHistory([...chatHistory, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/ai/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: chatMessage,
          userId: 'demo-user',
          context: {}
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const botMessage = {
          role: 'assistant',
          message: data.data.message,
          content: data.data.message,
          suggestions: data.data.suggestions || [],
          actions: data.data.actions || [],
          intent: data.data.intent,
          confidence: data.data.confidence,
          data: data.data.data || {},
          timestamp: new Date().toISOString()
        };

        setChatHistory([...chatHistory, userMessage, botMessage]);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
      
      setMessage('');
    } catch (error) {
      console.error('AI Assistant error:', error);
      
      // Generate fallback response
      const fallbackResponse = generateFallbackResponse(chatMessage);
      const botMessage = {
        role: 'assistant',
        message: fallbackResponse.message,
        content: fallbackResponse.message,
        suggestions: fallbackResponse.suggestions || [],
        actions: fallbackResponse.actions || [],
        timestamp: new Date().toISOString()
      };
      
      setChatHistory([...chatHistory, userMessage, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback response generator (same as in AIAssistant component)
  const generateFallbackResponse = (message) => {
    const messageLower = message.toLowerCase();

    // Vehicle search responses
    if (messageLower.includes('truck') || messageLower.includes('vehicle') || messageLower.includes('car')) {
      if (messageLower.includes('mercedes') || messageLower.includes('benz')) {
        return {
          message: "I'd be happy to help you find Mercedes trucks! While our advanced AI features are being set up, you can browse our Mercedes vehicles using the search filters. What specific model or price range are you looking for?",
          suggestions: [
            'Show me Mercedes trucks under €50,000',
            'Find Mercedes Actros models',
            'Browse all Mercedes vehicles'
          ],
          actions: ['search_mercedes']
        };
      } else if (messageLower.includes('scania') || messageLower.includes('volvo')) {
        return {
          message: `I can help you find ${messageLower.includes('scania') ? 'Scania' : 'Volvo'} trucks! These are excellent brands known for their reliability. What's your budget range and preferred model year?`,
          suggestions: [
            'Show me trucks under €40,000',
            'Find trucks from 2020 or newer',
            'Browse all available trucks'
          ],
          actions: ['search_trucks']
        };
      } else {
        return {
          message: "I can help you find the perfect vehicle! We have a great selection of trucks, cars, motorcycles, and more. What type of vehicle are you looking for and what's your budget?",
          suggestions: [
            'Find trucks under €50,000',
            'Show me cars under €30,000',
            'Browse motorcycles',
            'View all vehicles'
          ],
          actions: ['browse_vehicles']
        };
      }
    }

    // Price-related responses
    if (messageLower.includes('price') || messageLower.includes('cost') || messageLower.includes('€') || messageLower.includes('euro')) {
      return {
        message: "I can help with pricing information! Our platform uses advanced AI to provide accurate market prices. What specific vehicle are you interested in? I can give you pricing insights and market trends.",
        suggestions: [
          'Get price estimate for a specific vehicle',
          'View market price trends',
          'Compare vehicle prices',
          'Set up price alerts'
        ],
        actions: ['price_analysis']
      };
    }

    // Quality-related responses
    if (messageLower.includes('quality') || messageLower.includes('condition') || messageLower.includes('assess')) {
      return {
        message: "I can help assess vehicle quality! Our AI system analyzes multiple factors including mileage, maintenance history, and visual condition. Which vehicle would you like me to evaluate?",
        suggestions: [
          'Assess vehicle quality',
          'Check maintenance history',
          'Get quality report',
          'Compare vehicle conditions'
        ],
        actions: ['quality_assessment']
      };
    }

    // Comparison responses
    if (messageLower.includes('compare') || messageLower.includes('vs') || messageLower.includes('versus')) {
      return {
        message: "I'd love to help you compare vehicles! I can analyze different models, brands, and specifications to help you make the best decision. What vehicles would you like to compare?",
        suggestions: [
          'Compare Mercedes vs Scania',
          'Compare different truck models',
          'Compare price vs features',
          'Get comparison report'
        ],
        actions: ['compare_vehicles']
      };
    }

    // General help responses
    if (messageLower.includes('help') || messageLower.includes('how') || messageLower.includes('what')) {
      return {
        message: "I'm here to help you find the perfect vehicle! I can assist with searching, pricing, quality assessment, and comparisons. What would you like to know more about?",
        suggestions: [
          'How to search for vehicles',
          'Understanding vehicle pricing',
          'What to look for when buying',
          'How to list a vehicle'
        ],
        actions: ['general_help']
      };
    }

    // Default response
    return {
      message: "Thanks for your message! I'm your AI assistant for the Road platform. While our advanced AI features are being set up, I can still help you with vehicle searches, pricing information, and general questions. How can I assist you today?",
      suggestions: [
        'Find vehicles by brand',
        'Get pricing information',
        'Learn about our platform',
        'Contact support'
      ],
      actions: ['general_assistance']
    };
  };

  // Smart Search
  const performSmartSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/ai/smart-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error('Smart search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Price Estimation Demo
  const estimatePrice = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/ai/price-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'semi-trailer-trucks',
          brand: 'Mercedes-Benz',
          year: 2020,
          mileage: 350000,
          price: 45000,
          euro_standard: 'Euro 6',
          condition: 'Used',
          retarder: true,
          cruise_control: 'Adaptive'
        })
      });

      const data = await response.json();
      setPriceEstimate(data);
    } catch (error) {
      console.error('Price estimate error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Market Insights
  const fetchMarketInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/ai/market-insights');
      const data = await response.json();
      setMarketInsights(data);
    } catch (error) {
      console.error('Market insights error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Price Trends
  const fetchPriceTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/ai/price-trends?days=30');
      const data = await response.json();
      setPriceTrends(data);
    } catch (error) {
      console.error('Price trends error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-demo-container">
      <div className="ai-demo-header">
        <h1>🤖 AI Features Demo</h1>
        <p>Test all AI-powered features of the Truck & Auto Market Platform</p>
      </div>

      <div className="ai-demo-tabs">
        <button
          className={activeTab === 'chatbot' ? 'active' : ''}
          onClick={() => setActiveTab('chatbot')}
        >
          💬 AI Chatbot
        </button>
        <button
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          🔍 Smart Search
        </button>
        <button
          className={activeTab === 'price' ? 'active' : ''}
          onClick={() => setActiveTab('price')}
        >
          💰 Price AI
        </button>
        <button
          className={activeTab === 'market' ? 'active' : ''}
          onClick={() => setActiveTab('market')}
        >
          📊 Market Insights
        </button>
      </div>

      <div className="ai-demo-content">
        {/* Chatbot Tab */}
        {activeTab === 'chatbot' && (
          <div className="chatbot-section">
            <h2>AI Assistant - Ask Me Anything!</h2>
            <div className="chat-container">
              <div className="chat-history">
                {chatHistory.length === 0 && (
                  <div className="chat-welcome">
                    <p>👋 Hello! I'm your AI assistant. Try asking:</p>
                    <ul>
                      <li>"Show me trucks under €50,000"</li>
                      <li>"Compare Mercedes and Scania"</li>
                      <li>"What are the market trends?"</li>
                      <li>"I need a truck for long-haul transport"</li>
                    </ul>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.role}`}>
                    <div 
                      className="message-content"
                      dangerouslySetInnerHTML={{ __html: msg.content || msg.message }}
                    />

                    {/* Display AI response metadata */}
                    {msg.role === 'assistant' && (msg.intent || msg.confidence) && (
                      <div className="ai-metadata">
                        {msg.intent && <span className="intent-badge">Intent: {msg.intent}</span>}
                        {msg.confidence && <span className="confidence-badge">Confidence: {Math.round(msg.confidence * 100)}%</span>}
                      </div>
                    )}

                    {/* Display vehicle data table if available */}
                    {msg.data && msg.data.tableData && (
                      <div className="vehicle-table-container">
                        <table className="vehicle-results-table">
                          <thead>
                            <tr>
                              {msg.data.tableData.headers.map((header, i) => (
                                <th key={i}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.data.tableData.rows.map((row, i) => (
                              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#f9fafb' : '#ffffff' }}>
                                <td>{row.brand}</td>
                                <td>{row.year}</td>
                                <td>{row.model}</td>
                                <td>{row.mileage}</td>
                                <td>{row.fuelType || 'N/A'}</td>
                                <td>{row.consumption || 'N/A'}</td>
                                <td>{row.price}</td>
                                <td>
                                  <a 
                                    href={row.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="view-link"
                                  >
                                    View
                                  </a>
                                </td>
                              </tr>
                            ))}
                            {msg.data.tableData.summary && (
                              <tr style={{ backgroundColor: '#e5e7eb', fontWeight: 'bold' }}>
                                <td>AVERAGE</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{msg.data.tableData.summary.avgMileage?.toLocaleString()} km</td>
                                <td>-</td>
                                <td>-</td>
                                <td>€{msg.data.tableData.summary.avgPrice?.toLocaleString()}</td>
                                <td>-</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Display truck results as clickable cards (legacy support) */}
                    {msg.results && msg.results.length > 0 && (
                      <div className="truck-results">
                        {msg.results.map((truck) => (
                          <a
                            key={truck.id}
                            href={`/truck/${truck.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truck-card"
                          >
                            <div className="truck-card-content">
                              <div className="truck-header">
                                <span className="truck-brand">{truck.brand}</span>
                                <span className="truck-model">{truck.model}</span>
                              </div>
                              <div className="truck-details">
                                <span className="truck-year">📅 {truck.year}</span>
                                <span className="truck-mileage">🛣️ {truck.mileage?.toLocaleString()} km</span>
                              </div>
                              <div className="truck-price">€{truck.price.toLocaleString()}</div>
                              <div className="truck-location">📍 {truck.location}, {truck.country}</div>
                            </div>
                            <div className="truck-arrow">→</div>
                          </a>
                        ))}
                      </div>
                    )}

                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="suggestions">
                        {msg.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => setMessage(suggestion)}
                            className="suggestion-btn"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {loading && <div className="chat-message bot">Typing...</div>}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                />
                <button onClick={sendChatMessage} disabled={loading}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Smart Search Tab */}
        {activeTab === 'search' && (
          <div className="smart-search-section">
            <h2>Natural Language Search</h2>
            <p>Describe what you're looking for in plain English!</p>

            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSmartSearch()}
                placeholder="e.g., Mercedes Euro 6 with low mileage from 2020"
              />
              <button onClick={performSmartSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResult && (
              <div className="search-result">
                <h3>Parsed Filters:</h3>
                <div className="filters-grid">
                  {searchResult.parsed_filters.brand && (
                    <div className="filter-item">
                      <strong>Brand:</strong> {searchResult.parsed_filters.brand}
                    </div>
                  )}
                  {searchResult.parsed_filters.euroStandard && (
                    <div className="filter-item">
                      <strong>Euro Standard:</strong> {searchResult.parsed_filters.euroStandard}
                    </div>
                  )}
                  {searchResult.parsed_filters.yearFrom && (
                    <div className="filter-item">
                      <strong>Year From:</strong> {searchResult.parsed_filters.yearFrom}
                    </div>
                  )}
                  {searchResult.parsed_filters.maxMileage && (
                    <div className="filter-item">
                      <strong>Max Mileage:</strong> {searchResult.parsed_filters.maxMileage.toLocaleString()} km
                    </div>
                  )}
                  {searchResult.parsed_filters.transmission && (
                    <div className="filter-item">
                      <strong>Transmission:</strong> {searchResult.parsed_filters.transmission}
                    </div>
                  )}
                </div>
                <p className="message-info">✅ {searchResult.message}</p>
              </div>
            )}

            <div className="examples">
              <h4>Try these examples:</h4>
              <button onClick={() => setSearchQuery('Mercedes Actros Euro 6 with low mileage')}>
                Mercedes Euro 6 low mileage
              </button>
              <button onClick={() => setSearchQuery('Scania automatic transmission 2020')}>
                Scania automatic 2020
              </button>
              <button onClick={() => setSearchQuery('Volvo with retarder and sleeper cab')}>
                Volvo with retarder
              </button>
            </div>
          </div>
        )}

        {/* Price AI Tab */}
        {activeTab === 'price' && (
          <div className="price-section">
            <h2>AI Price Estimation</h2>
            <p>Click to estimate the price for a sample Mercedes-Benz truck:</p>

            <button onClick={estimatePrice} disabled={loading} className="action-btn">
              {loading ? 'Calculating...' : 'Estimate Price'}
            </button>

            {priceEstimate && (
              <div className="price-result">
                <h3>Price Analysis</h3>
                <div className="price-grid">
                  <div className="price-card">
                    <h4>AI Estimated Price</h4>
                    <div className="price-value">€{priceEstimate.estimated_price.toLocaleString()}</div>
                  </div>
                  <div className="price-card">
                    <h4>Price Range</h4>
                    <div className="price-range">
                      €{priceEstimate.price_range_min.toLocaleString()} -
                      €{priceEstimate.price_range_max.toLocaleString()}
                    </div>
                  </div>
                  <div className="price-card">
                    <h4>Actual Price</h4>
                    <div className="price-value">€{priceEstimate.actual_price.toLocaleString()}</div>
                  </div>
                  <div className="price-card status">
                    <h4>Status</h4>
                    <div className={`status-badge ${priceEstimate.price_status}`}>
                      {priceEstimate.price_status === 'good_deal' && '✅ Good Deal!'}
                      {priceEstimate.price_status === 'fair' && '👍 Fair Price'}
                      {priceEstimate.price_status === 'overpriced' && '⚠️ Overpriced'}
                    </div>
                  </div>
                </div>
                <p className="confidence">Confidence: {(priceEstimate.confidence * 100).toFixed(0)}%</p>
                <p className="difference">
                  Difference: €{Math.abs(priceEstimate.difference).toLocaleString()}
                  ({priceEstimate.difference_percent}%)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Market Insights Tab */}
        {activeTab === 'market' && (
          <div className="market-section">
            <h2>Market Analytics</h2>

            <div className="market-actions">
              <button onClick={fetchMarketInsights} disabled={loading} className="action-btn">
                {loading ? 'Loading...' : 'Get Market Insights'}
              </button>
              <button onClick={fetchPriceTrends} disabled={loading} className="action-btn">
                {loading ? 'Loading...' : 'Get Price Trends'}
              </button>
            </div>

            {marketInsights && (
              <div className="market-insights">
                <h3>📊 Market Overview</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-label">Total Listings</div>
                    <div className="insight-value">{marketInsights.total_listings}</div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-label">Average Price</div>
                    <div className="insight-value">€{marketInsights.average_price.toLocaleString()}</div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-label">Median Price</div>
                    <div className="insight-value">€{marketInsights.median_price.toLocaleString()}</div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-label">Avg Mileage</div>
                    <div className="insight-value">{marketInsights.average_mileage.toLocaleString()} km</div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-label">Average Year</div>
                    <div className="insight-value">{marketInsights.average_year}</div>
                  </div>
                  <div className="insight-card">
                    <div className="insight-label">Most Popular Brand</div>
                    <div className="insight-value">{marketInsights.most_common_brand}</div>
                  </div>
                </div>

                <div className="brand-distribution">
                  <h4>Brand Distribution (Top 10)</h4>
                  <div className="brand-bars">
                    {Object.entries(marketInsights.brand_distribution)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 10)
                      .map(([brand, count]) => (
                        <div key={brand} className="brand-bar">
                          <span className="brand-name">{brand}</span>
                          <div className="bar-container">
                            <div
                              className="bar-fill"
                              style={{ width: `${(count / marketInsights.total_listings) * 100}%` }}
                            />
                          </div>
                          <span className="brand-count">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {priceTrends && (
              <div className="price-trends">
                <h3>📈 Price Trends ({priceTrends.period_days} days)</h3>
                <div className="trend-summary">
                  <div className={`trend-badge ${priceTrends.trend_direction}`}>
                    {priceTrends.trend_direction === 'up' && '📈 Trending Up'}
                    {priceTrends.trend_direction === 'down' && '📉 Trending Down'}
                    {priceTrends.trend_direction === 'stable' && '➡️ Stable'}
                  </div>
                  <div className="trend-percent">{priceTrends.trend_percent}%</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIDemo;
