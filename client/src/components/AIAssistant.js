import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ onClose, onSearch, onRecommendation }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you find vehicles, analyze prices, assess quality, and answer any questions about our marketplace. How can I assist you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5001/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: '123e4567-e89b-12d3-a456-426614174000', // Fixed UUID for testing
          context: {
            current_page: window.location.pathname,
            user_agent: navigator.userAgent
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.data.message,
          timestamp: new Date().toISOString(),
          suggestions: data.data.suggestions || [],
          actions: data.data.actions || [],
          data: data.data.data
        };

        // Simulate typing delay
        setTimeout(() => {
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
          setIsLoading(false);

          // Handle actions
          if (data.data.actions && data.data.actions.length > 0) {
            handleActions(data.data.actions, data.data.data);
          }
        }, 1000);
      } else {
        throw new Error(data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Provide a fallback response based on the user's message
      const fallbackResponse = generateFallbackResponse(inputMessage);
      
      const assistantMessage = {
        role: 'assistant',
        content: fallbackResponse.message,
        timestamp: new Date().toISOString(),
        suggestions: fallbackResponse.suggestions,
        actions: fallbackResponse.actions || []
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleActions = (actions, data) => {
    actions.forEach(action => {
      switch (action) {
        case 'execute_search':
          if (data && data.search_query) {
            onSearch(data.search_query);
          }
          break;
        case 'show_pricing_analysis':
          if (data && data.predicted_price) {
            // Show pricing analysis modal or navigate to pricing page
            console.log('Pricing analysis:', data);
          }
          break;
        case 'show_quality_report':
          if (data && data.overall_quality_score) {
            // Show quality report modal
            console.log('Quality report:', data);
          }
          break;
        default:
          console.log('Unhandled action:', action);
      }
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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

  const quickActions = [
    'Find trucks under €50,000',
    'Compare Mercedes vs Scania',
    'What\'s the market price for a 2020 Volvo?',
    'Assess vehicle quality',
    'Show me Euro 6 vehicles',
    'Get market insights'
  ];

  return (
    <div className="ai-assistant-overlay">
      <div className="ai-assistant">
        <div className="ai-assistant-header">
          <div className="ai-assistant-title">
            <div className="ai-avatar">🤖</div>
            <div>
              <h3>AI Assistant</h3>
              <p>Powered by advanced AI</p>
            </div>
          </div>
          <button className="ai-assistant-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ai-assistant-messages">
          {messages.map((message, index) => (
            <div key={index} className={`ai-message ai-message-${message.role}`}>
              <div 
                className="ai-message-content"
                dangerouslySetInnerHTML={{ __html: message.content }}
              />
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="ai-message-suggestions">
                  {message.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="ai-suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div className="ai-message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="ai-message ai-message-assistant">
              <div className="ai-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-assistant-quick-actions">
          <h4>Quick Actions:</h4>
          <div className="ai-quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="ai-quick-action-button"
                onClick={() => handleSuggestionClick(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-assistant-input">
          <div className="ai-input-container">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about vehicles, pricing, or our marketplace..."
              disabled={isLoading}
              className="ai-input-field"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="ai-send-button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
