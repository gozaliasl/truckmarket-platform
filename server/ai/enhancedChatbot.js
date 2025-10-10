/**
 * Enhanced AI Chatbot with External AI Integration
 * World-class conversational AI for vehicle marketplace
 */

const axios = require('axios');
const AdvancedNLP = require('./advancedNLP');
const AdvancedPricingAI = require('./advancedPricingAI');
const VehicleQualityAI = require('./vehicleQualityAI');

class EnhancedChatbot {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.claudeApiKey = process.env.CLAUDE_API_KEY;
    this.nlp = new AdvancedNLP();
    this.pricingAI = new AdvancedPricingAI();
    this.qualityAI = new VehicleQualityAI();
    this.conversationHistory = new Map();
    this.userPreferences = new Map();
  }

  /**
   * Main Chat Processing with Advanced AI
   */
  async processMessage(userId, message, context = {}) {
    try {
      // 1. Advanced NLP Analysis
      const nlpResult = await this.nlp.understandQuery(message, context);
      
      // 2. Update conversation history
      this.updateConversationHistory(userId, message, nlpResult);
      
      // 3. Determine response strategy
      const responseStrategy = await this.determineResponseStrategy(nlpResult, context);
      
      // 4. Generate response using appropriate AI
      const response = await this.generateAdvancedResponse(userId, message, nlpResult, responseStrategy, context);
      
      // 5. Update user preferences
      this.updateUserPreferences(userId, nlpResult, response);
      
      return {
        message: response.message,
        intent: nlpResult.intent.intent,
        confidence: nlpResult.confidence,
        suggestions: response.suggestions,
        actions: response.actions,
        data: response.data,
        conversation_id: this.getConversationId(userId),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Enhanced chatbot error:', error);
      return {
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        intent: 'error',
        confidence: 0,
        suggestions: ['Try rephrasing your question', 'Contact support if the issue persists'],
        actions: [],
        data: null
      };
    }
  }

  /**
   * Determine Response Strategy
   */
  async determineResponseStrategy(nlpResult, context) {
    const { intent, entities, sentiment, complexity } = nlpResult;
    
    // High complexity queries need advanced AI
    if (complexity.complexity_score > 0.7) {
      return {
        method: 'advanced_ai',
        ai_model: 'gpt-4',
        requires_data: true,
        requires_analysis: true
      };
    }
    
    // Specific intents need specialized handling
    switch (intent.intent) {
      case 'price_inquiry':
        return {
          method: 'pricing_ai',
          ai_model: 'pricing_system',
          requires_data: true,
          requires_analysis: true
        };
      
      case 'technical_question':
        return {
          method: 'technical_ai',
          ai_model: 'gpt-4',
          requires_data: false,
          requires_analysis: true
        };
      
      case 'market_analysis':
        return {
          method: 'market_ai',
          ai_model: 'claude-3',
          requires_data: true,
          requires_analysis: true
        };
      
      case 'quality_assessment':
        return {
          method: 'quality_ai',
          ai_model: 'quality_system',
          requires_data: true,
          requires_analysis: true
        };
      
      default:
        return {
          method: 'standard_ai',
          ai_model: 'gpt-4',
          requires_data: false,
          requires_analysis: false
        };
    }
  }

  /**
   * Generate Advanced Response
   */
  async generateAdvancedResponse(userId, message, nlpResult, strategy, context) {
    switch (strategy.method) {
      case 'advanced_ai':
        return await this.generateAdvancedAIResponse(message, nlpResult, context);
      
      case 'pricing_ai':
        return await this.generatePricingResponse(message, nlpResult, context);
      
      case 'technical_ai':
        return await this.generateTechnicalResponse(message, nlpResult, context);
      
      case 'market_ai':
        return await this.generateMarketResponse(message, nlpResult, context);
      
      case 'quality_ai':
        return await this.generateQualityResponse(message, nlpResult, context);
      
      default:
        return await this.generateStandardResponse(message, nlpResult, context);
    }
  }

  /**
   * Advanced AI Response with GPT-4
   */
  async generateAdvancedAIResponse(message, nlpResult, context) {
    try {
      const conversationContext = this.getConversationContext(nlpResult);
      
      const prompt = `
      You are an expert vehicle marketplace AI assistant. Provide comprehensive, helpful responses.
      
      User Query: "${message}"
      
      Context:
      - Intent: ${nlpResult.intent.intent}
      - Entities: ${JSON.stringify(nlpResult.entities)}
      - Sentiment: ${nlpResult.sentiment.sentiment}
      - Complexity: ${nlpResult.complexity.level}
      
      Conversation Context: ${conversationContext}
      
      User Context: ${JSON.stringify(context)}
      
      Provide a detailed, helpful response that:
      1. Directly addresses the user's query
      2. Provides relevant information and insights
      3. Offers actionable suggestions
      4. Maintains a professional, friendly tone
      5. Includes specific details when relevant
      
      If the query involves vehicle data, indicate what information would be helpful to provide more specific answers.
      `;

      const response = await this.callGPT4(prompt);
      
      return {
        message: response,
        suggestions: this.generateAdvancedSuggestions(nlpResult),
        actions: this.generateAdvancedActions(nlpResult),
        data: null
      };
    } catch (error) {
      console.error('Advanced AI response error:', error);
      throw error;
    }
  }

  /**
   * Pricing AI Response
   */
  async generatePricingResponse(message, nlpResult, context) {
    try {
      // Extract vehicle data from query
      const vehicleData = this.extractVehicleDataFromQuery(nlpResult.entities);
      
      if (!vehicleData || Object.keys(vehicleData).length === 0) {
        return {
          message: "I'd be happy to help with pricing information! Could you provide more details about the vehicle you're interested in? For example, the brand, model, year, and mileage?",
          suggestions: [
            'Provide vehicle specifications',
            'Ask about price ranges for specific categories',
            'Request market price analysis'
          ],
          actions: ['collect_vehicle_data'],
          data: null
        };
      }
      
      // Get pricing analysis
      const pricingAnalysis = await this.pricingAI.predictVehiclePrice(vehicleData);
      
      // Generate response
      const prompt = `
      Generate a helpful pricing response based on this analysis:
      
      Vehicle: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
      Mileage: ${vehicleData.mileage} km
      
      Pricing Analysis:
      - Predicted Price: €${pricingAnalysis.predicted_price.toLocaleString()}
      - Price Range: €${pricingAnalysis.price_range.min.toLocaleString()} - €${pricingAnalysis.price_range.max.toLocaleString()}
      - Confidence: ${(pricingAnalysis.confidence * 100).toFixed(0)}%
      
      Factors: ${JSON.stringify(pricingAnalysis.factors)}
      Recommendations: ${JSON.stringify(pricingAnalysis.recommendations)}
      
      Create a natural, informative response about the pricing.
      `;

      const response = await this.callGPT4(prompt);
      
      return {
        message: response,
        suggestions: [
          'View similar vehicles in this price range',
          'Get detailed pricing breakdown',
          'Set up price alerts'
        ],
        actions: ['show_similar_vehicles', 'detailed_pricing'],
        data: pricingAnalysis
      };
    } catch (error) {
      console.error('Pricing response error:', error);
      throw error;
    }
  }

  /**
   * Technical AI Response
   */
  async generateTechnicalResponse(message, nlpResult, context) {
    try {
      const prompt = `
      You are a vehicle technical expert. Answer this technical question:
      
      Question: "${message}"
      
      Context:
      - Intent: ${nlpResult.intent.intent}
      - Entities: ${JSON.stringify(nlpResult.entities)}
      
      Provide:
      1. Clear technical explanation
      2. Relevant specifications
      3. Practical implications
      4. Related information
      5. Maintenance considerations if applicable
      
      Be accurate, detailed, and helpful.
      `;

      const response = await this.callGPT4(prompt);
      
      return {
        message: response,
        suggestions: [
          'Find vehicles with these specifications',
          'Compare technical features',
          'Get maintenance information'
        ],
        actions: ['search_by_specs', 'compare_features'],
        data: null
      };
    } catch (error) {
      console.error('Technical response error:', error);
      throw error;
    }
  }

  /**
   * Market AI Response with Claude
   */
  async generateMarketResponse(message, nlpResult, context) {
    try {
      const prompt = `
      You are a vehicle market analyst. Provide market insights for this query:
      
      Query: "${message}"
      
      Context:
      - Intent: ${nlpResult.intent.intent}
      - Entities: ${JSON.stringify(nlpResult.entities)}
      
      Provide:
      1. Current market trends
      2. Price analysis
      3. Demand indicators
      4. Future outlook
      5. Strategic recommendations
      
      Be analytical, data-driven, and insightful.
      `;

      const response = await this.callClaude(prompt);
      
      return {
        message: response,
        suggestions: [
          'View market trends dashboard',
          'Get detailed market report',
          'Set up market alerts'
        ],
        actions: ['market_dashboard', 'detailed_report'],
        data: null
      };
    } catch (error) {
      console.error('Market response error:', error);
      throw error;
    }
  }

  /**
   * Quality AI Response
   */
  async generateQualityResponse(message, nlpResult, context) {
    try {
      const vehicleData = this.extractVehicleDataFromQuery(nlpResult.entities);
      
      if (!vehicleData) {
        return {
          message: "I can help assess vehicle quality! Please provide details about the vehicle you'd like me to evaluate, including brand, model, year, mileage, and any specific concerns you have.",
          suggestions: [
            'Provide vehicle details',
            'Ask about quality indicators',
            'Request quality assessment guide'
          ],
          actions: ['collect_vehicle_data'],
          data: null
        };
      }
      
      // Get quality assessment
      const qualityAssessment = await this.qualityAI.assessVehicleQuality(vehicleData);
      
      const prompt = `
      Generate a quality assessment response based on this analysis:
      
      Vehicle: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}
      
      Quality Assessment:
      - Overall Score: ${qualityAssessment.overall_quality_score} (${qualityAssessment.quality_grade})
      - Visual Condition: ${qualityAssessment.visual_condition.score}
      - Mechanical Condition: ${qualityAssessment.mechanical_condition.overall_score}
      - Risk Level: ${qualityAssessment.risk_assessment.risk_level}
      
      Recommendations: ${JSON.stringify(qualityAssessment.recommendations)}
      
      Create a comprehensive quality assessment response.
      `;

      const response = await this.callGPT4(prompt);
      
      return {
        message: response,
        suggestions: [
          'Get detailed quality report',
          'View quality checklist',
          'Find similar quality vehicles'
        ],
        actions: ['detailed_quality_report', 'quality_checklist'],
        data: qualityAssessment
      };
    } catch (error) {
      console.error('Quality response error:', error);
      throw error;
    }
  }

  /**
   * Standard AI Response
   */
  async generateStandardResponse(message, nlpResult, context) {
    try {
      const prompt = `
      You are a helpful vehicle marketplace assistant. Respond to this query:
      
      Query: "${message}"
      
      Context:
      - Intent: ${nlpResult.intent.intent}
      - Sentiment: ${nlpResult.sentiment.sentiment}
      
      Provide a helpful, friendly response that addresses the user's needs.
      `;

      const response = await this.callGPT4(prompt);
      
      return {
        message: response,
        suggestions: this.generateStandardSuggestions(nlpResult),
        actions: [],
        data: null
      };
    } catch (error) {
      console.error('Standard response error:', error);
      throw error;
    }
  }

  /**
   * External AI API Calls
   */
  async callGPT4(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert vehicle marketplace AI assistant. Provide helpful, accurate, and detailed responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('GPT-4 API error:', error);
      throw error;
    }
  }

  async callClaude(prompt) {
    try {
      const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }, {
        headers: {
          'x-api-key': this.claudeApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        }
      });

      return response.data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  // Helper methods
  updateConversationHistory(userId, message, nlpResult) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, []);
    }
    
    const history = this.conversationHistory.get(userId);
    history.push({
      message: message,
      nlp_result: nlpResult,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 messages
    if (history.length > 10) {
      history.shift();
    }
  }

  getConversationContext(nlpResult) {
    // This would be enhanced with actual conversation history
    return `Previous context: User is interested in ${nlpResult.entities.brands?.join(', ') || 'vehicles'}`;
  }

  updateUserPreferences(userId, nlpResult, response) {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, {});
    }
    
    const preferences = this.userPreferences.get(userId);
    
    // Update preferences based on interaction
    if (nlpResult.entities.brands) {
      preferences.preferred_brands = nlpResult.entities.brands;
    }
    
    if (nlpResult.entities.price_ranges) {
      preferences.price_range = nlpResult.entities.price_ranges[0];
    }
    
    if (nlpResult.intent.intent) {
      preferences.common_intents = preferences.common_intents || [];
      preferences.common_intents.push(nlpResult.intent.intent);
    }
  }

  getConversationId(userId) {
    return `conv_${userId}_${Date.now()}`;
  }

  extractVehicleDataFromQuery(entities) {
    const vehicleData = {};
    
    if (entities.brands && entities.brands.length > 0) {
      vehicleData.brand = entities.brands[0];
    }
    
    if (entities.years && entities.years.length > 0) {
      vehicleData.year = entities.years[0];
    }
    
    if (entities.mileage_ranges && entities.mileage_ranges.length > 0) {
      vehicleData.mileage = entities.mileage_ranges[0].max || 300000;
    }
    
    if (entities.features && entities.features.length > 0) {
      vehicleData.features = entities.features;
    }
    
    if (entities.conditions && entities.conditions.length > 0) {
      vehicleData.condition = entities.conditions[0];
    }
    
    return Object.keys(vehicleData).length > 0 ? vehicleData : null;
  }

  generateAdvancedSuggestions(nlpResult) {
    const suggestions = [];
    
    switch (nlpResult.intent.intent) {
      case 'search_vehicles':
        suggestions.push('Refine your search criteria');
        suggestions.push('Save this search for updates');
        suggestions.push('Get personalized recommendations');
        break;
      
      case 'compare_vehicles':
        suggestions.push('View detailed comparison');
        suggestions.push('Get expert recommendations');
        suggestions.push('Check availability');
        break;
      
      case 'price_inquiry':
        suggestions.push('View price history');
        suggestions.push('Set price alerts');
        suggestions.push('Get financing options');
        break;
      
      default:
        suggestions.push('How can I help you further?');
        suggestions.push('Explore our vehicle categories');
        suggestions.push('Get personalized assistance');
    }
    
    return suggestions;
  }

  generateAdvancedActions(nlpResult) {
    const actions = [];
    
    switch (nlpResult.intent.intent) {
      case 'search_vehicles':
        actions.push('execute_search');
        actions.push('save_search');
        break;
      
      case 'price_inquiry':
        actions.push('show_pricing_analysis');
        actions.push('set_price_alert');
        break;
      
      case 'compare_vehicles':
        actions.push('show_comparison');
        actions.push('get_recommendations');
        break;
    }
    
    return actions;
  }

  generateStandardSuggestions(nlpResult) {
    return [
      'How can I help you find the right vehicle?',
      'Would you like to browse our categories?',
      'Need help with something specific?'
    ];
  }
}

module.exports = EnhancedChatbot;
