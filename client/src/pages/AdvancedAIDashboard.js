import React, { useState, useEffect } from 'react';
import './AdvancedAIDashboard.css';

const AdvancedAIDashboard = () => {
  const [activeTab, setActiveTab] = useState('chatbot');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStats, setAiStats] = useState({
    totalQueries: 0,
    successfulPredictions: 0,
    averageConfidence: 0,
    popularIntents: []
  });

  // Sample AI capabilities for demonstration
  const aiCapabilities = [
    {
      title: 'Price Prediction',
      description: 'AI-powered price estimation using ML models',
      icon: '💰',
      features: ['Market analysis', 'Condition assessment', 'Trend prediction']
    },
    {
      title: 'Quality Assessment',
      description: 'Comprehensive vehicle quality evaluation',
      icon: '🔍',
      features: ['Mileage analysis', 'Service history', 'Accident records']
    },
    {
      title: 'Smart Recommendations',
      description: 'Personalized vehicle recommendations',
      icon: '🎯',
      features: ['Preference matching', 'Budget optimization', 'Feature analysis']
    },
    {
      title: 'Market Intelligence',
      description: 'Real-time market insights and trends',
      icon: '📊',
      features: ['Demand forecasting', 'Price trends', 'Market analysis']
    },
    {
      title: 'Vehicle Comparison',
      description: 'AI-powered vehicle comparison engine',
      icon: '⚖️',
      features: ['Spec comparison', 'Performance analysis', 'Value assessment']
    },
    {
      title: 'Natural Language Processing',
      description: 'Advanced NLP for intuitive interactions',
      icon: '🗣️',
      features: ['Intent recognition', 'Entity extraction', 'Sentiment analysis']
    }
  ];

  const quickActions = [
    {
      title: 'Find trucks under €50,000',
      description: 'AI-powered search with smart filtering',
      action: () => sendMessage('Find trucks under €50,000')
    },
    {
      title: 'Compare Mercedes vs Scania',
      description: 'Detailed comparison with AI insights',
      action: () => sendMessage('Compare Mercedes vs Scania trucks')
    },
    {
      title: 'Get price estimate',
      description: 'ML-based price prediction',
      action: () => sendMessage('What is the market price for a 2020 Volvo truck?')
    },
    {
      title: 'Quality assessment',
      description: 'Comprehensive quality evaluation',
      action: () => sendMessage('Assess the quality of this vehicle')
    },
    {
      title: 'Market insights',
      description: 'Current market trends and analysis',
      action: () => sendMessage('Show me current market trends for trucks')
    },
    {
      title: 'Smart recommendations',
      description: 'Personalized vehicle suggestions',
      action: () => sendMessage('Recommend the best trucks for me')
    }
  ];

  const sendMessage = async (message = currentMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/ai/advanced/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userId: 'demo-user',
          context: { dashboard: true }
        })
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: data.data.message,
          intent: data.data.nlp_analysis?.intent,
          confidence: data.data.nlp_analysis?.confidence,
          entities: data.data.nlp_analysis?.entities,
          suggestions: data.data.suggestions || [],
          timestamp: new Date().toISOString()
        };

        setChatHistory(prev => [...prev, aiMessage]);
        
        // Update AI stats
        setAiStats(prev => ({
          ...prev,
          totalQueries: prev.totalQueries + 1,
          successfulPredictions: prev.successfulPredictions + 1,
          averageConfidence: ((prev.averageConfidence * prev.totalQueries) + (data.data.nlp_analysis?.confidence || 0)) / (prev.totalQueries + 1)
        }));
      } else {
        throw new Error(data.message || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        isError: true,
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const renderChatMessage = (message) => {
    return (
      <div key={message.id} className={`chat-message ${message.type}`}>
        <div className="message-header">
          <span className="message-type">
            {message.type === 'user' ? '👤 You' : '🤖 AI Assistant'}
          </span>
          <span className="message-time">{formatTimestamp(message.timestamp)}</span>
        </div>
        
        <div className="message-content">
          {message.type === 'ai' && message.intent && (
            <div className="ai-analysis">
              <span className="intent-badge">Intent: {message.intent}</span>
              {message.confidence && (
                <span className="confidence-badge">
                  Confidence: {Math.round(message.confidence * 100)}%
                </span>
              )}
            </div>
          )}
          
          <div 
            className="message-text"
            dangerouslySetInnerHTML={{ __html: message.content }}
          />
          
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="message-suggestions">
              <h4>Suggestions:</h4>
              <div className="suggestion-buttons">
                {message.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="advanced-ai-dashboard">
      <div className="dashboard-header">
        <h1>🤖 Advanced AI Dashboard</h1>
        <div className="ai-stats">
          <div className="stat-item">
            <span className="stat-value">{aiStats.totalQueries}</span>
            <span className="stat-label">Total Queries</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Math.round(aiStats.averageConfidence * 100)}%</span>
            <span className="stat-label">Avg Confidence</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{aiStats.successfulPredictions}</span>
            <span className="stat-label">Successful</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'chatbot' ? 'active' : ''}`}
          onClick={() => setActiveTab('chatbot')}
        >
          💬 AI Chatbot
        </button>
        <button 
          className={`tab ${activeTab === 'capabilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('capabilities')}
        >
          🚀 AI Capabilities
        </button>
        <button 
          className={`tab ${activeTab === 'quick-actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('quick-actions')}
        >
          ⚡ Quick Actions
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'chatbot' && (
          <div className="chatbot-section">
            <div className="chat-container">
              <div className="chat-header">
                <h3>AI Assistant</h3>
                <button className="clear-btn" onClick={clearChat}>Clear Chat</button>
              </div>
              
              <div className="chat-messages">
                {chatHistory.length === 0 ? (
                  <div className="welcome-message">
                    <h4>Welcome to the Advanced AI Assistant! 🤖</h4>
                    <p>I can help you with:</p>
                    <ul>
                      <li>🔍 Finding vehicles with smart search</li>
                      <li>💰 Price estimation and market analysis</li>
                      <li>⚖️ Vehicle comparison and recommendations</li>
                      <li>📊 Market insights and trends</li>
                      <li>🎯 Quality assessment and evaluation</li>
                    </ul>
                    <p>Try asking me something like "Find trucks under €50,000" or "Compare Mercedes vs Scania"</p>
                  </div>
                ) : (
                  chatHistory.map(renderChatMessage)
                )}
                
                {isLoading && (
                  <div className="loading-message">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>AI is thinking...</span>
                  </div>
                )}
              </div>
              
              <div className="chat-input">
                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about vehicles, pricing, or market insights..."
                  rows="2"
                />
                <button 
                  onClick={() => sendMessage()}
                  disabled={!currentMessage.trim() || isLoading}
                  className="send-btn"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="capabilities-section">
            <h3>AI Capabilities Overview</h3>
            <div className="capabilities-grid">
              {aiCapabilities.map((capability, index) => (
                <div key={index} className="capability-card">
                  <div className="capability-icon">{capability.icon}</div>
                  <h4>{capability.title}</h4>
                  <p>{capability.description}</p>
                  <div className="capability-features">
                    {capability.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quick-actions' && (
          <div className="quick-actions-section">
            <h3>Quick Actions</h3>
            <p>Try these AI-powered features:</p>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <div key={index} className="quick-action-card" onClick={action.action}>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                  <div className="action-arrow">→</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAIDashboard;
