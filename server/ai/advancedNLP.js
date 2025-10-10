/**
 * Advanced Natural Language Processing for Vehicle Queries
 * World-class NLP for complex vehicle searches and interactions
 */

const axios = require('axios');
const natural = require('natural');

class AdvancedNLP {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.classifier = new natural.BayesClassifier();
    this.initializeClassifier();
  }

  /**
   * Advanced Query Understanding
   */
  async understandQuery(query, context = {}) {
    try {
      // 1. Intent Classification
      const intent = await this.classifyIntent(query);
      
      // 2. Entity Extraction
      const entities = await this.extractEntities(query);
      
      // 3. Sentiment Analysis
      const sentiment = await this.analyzeSentiment(query);
      
      // 4. Query Complexity Analysis
      const complexity = this.analyzeQueryComplexity(query);
      
      // 5. Context Integration
      const contextualQuery = await this.integrateContext(query, context);
      
      // 6. Query Expansion
      const expandedQuery = await this.expandQuery(query, entities);
      
      return {
        original_query: query,
        intent: intent,
        entities: entities,
        sentiment: sentiment,
        complexity: complexity,
        contextual_query: contextualQuery,
        expanded_query: expandedQuery,
        confidence: this.calculateConfidence(intent, entities, sentiment)
      };
    } catch (error) {
      console.error('NLP query understanding error:', error);
      throw error;
    }
  }

  /**
   * Advanced Intent Classification
   */
  async classifyIntent(query) {
    try {
      // Use AI for complex intent classification
      const prompt = `
      Classify the intent of this vehicle-related query:
      
      Query: "${query}"
      
      Possible intents:
      1. search_vehicles - Looking for specific vehicles
      2. compare_vehicles - Comparing multiple vehicles
      3. price_inquiry - Asking about pricing
      4. recommendation_request - Asking for recommendations
      5. technical_question - Technical specifications or features
      6. market_analysis - Market trends or analysis
      7. financing_question - Financing or payment options
      8. maintenance_question - Maintenance or service related
      9. general_information - General vehicle information
      10. complaint_feedback - Complaints or feedback
      
      Return the intent and confidence score (0-1).
      `;

      const response = await this.callOpenAI(prompt);
      return this.parseIntentResponse(response);
    } catch (error) {
      console.error('Intent classification error:', error);
      return { intent: 'general_information', confidence: 0.5 };
    }
  }

  /**
   * Advanced Entity Extraction
   */
  async extractEntities(query) {
    try {
      const prompt = `
      Extract all relevant entities from this vehicle query:
      
      Query: "${query}"
      
      Extract:
      1. Vehicle brands (Mercedes-Benz, Scania, Volvo, etc.)
      2. Vehicle models
      3. Years (2020, 2018, etc.)
      4. Price ranges (€30,000, under 50k, etc.)
      5. Mileage ranges (100k km, low mileage, etc.)
      6. Features (retarder, automatic, Euro 6, etc.)
      7. Conditions (new, used, excellent, etc.)
      8. Locations (Germany, Netherlands, etc.)
      9. Categories (trucks, cars, motorcycles, etc.)
      10. Specifications (engine size, transmission, etc.)
      
      Return structured JSON with all found entities.
      `;

      const response = await this.callOpenAI(prompt);
      return this.parseEntityResponse(response);
    } catch (error) {
      console.error('Entity extraction error:', error);
      return this.fallbackEntityExtraction(query);
    }
  }

  /**
   * Sentiment Analysis
   */
  async analyzeSentiment(query) {
    try {
      const prompt = `
      Analyze the sentiment of this vehicle-related query:
      
      Query: "${query}"
      
      Determine:
      1. Overall sentiment (positive, negative, neutral)
      2. Confidence level (0-1)
      3. Key emotional indicators
      4. Urgency level (low, medium, high)
      5. User's likely intent based on sentiment
      
      Return structured analysis.
      `;

      const response = await this.callOpenAI(prompt);
      return this.parseSentimentResponse(response);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        urgency: 'medium',
        indicators: []
      };
    }
  }

  /**
   * Query Complexity Analysis
   */
  analyzeQueryComplexity(query) {
    const tokens = this.tokenizer.tokenize(query.toLowerCase());
    const complexity = {
      word_count: tokens.length,
      has_multiple_conditions: this.hasMultipleConditions(query),
      has_comparisons: this.hasComparisons(query),
      has_negations: this.hasNegations(query),
      has_uncertainty: this.hasUncertainty(query),
      complexity_score: 0
    };

    // Calculate complexity score
    let score = 0.3; // Base score
    
    if (complexity.word_count > 10) score += 0.2;
    if (complexity.has_multiple_conditions) score += 0.2;
    if (complexity.has_comparisons) score += 0.15;
    if (complexity.has_negations) score += 0.1;
    if (complexity.has_uncertainty) score += 0.05;
    
    complexity.complexity_score = Math.min(1, score);
    complexity.level = this.getComplexityLevel(complexity.complexity_score);
    
    return complexity;
  }

  /**
   * Context Integration
   */
  async integrateContext(query, context) {
    if (!context || Object.keys(context).length === 0) {
      return query;
    }

    try {
      const prompt = `
      Integrate the following context into the user query to create a more complete understanding:
      
      Original Query: "${query}"
      
      Context:
      - Previous searches: ${context.previous_searches || 'none'}
      - User preferences: ${context.preferences || 'none'}
      - Current filters: ${context.current_filters || 'none'}
      - User location: ${context.location || 'unknown'}
      - User budget: ${context.budget || 'unknown'}
      - User experience level: ${context.experience_level || 'unknown'}
      
      Create an enhanced query that incorporates relevant context while maintaining the original intent.
      `;

      const response = await this.callOpenAI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Context integration error:', error);
      return query;
    }
  }

  /**
   * Query Expansion
   */
  async expandQuery(query, entities) {
    try {
      const prompt = `
      Expand this vehicle search query to include related terms and synonyms:
      
      Original Query: "${query}"
      
      Extracted Entities: ${JSON.stringify(entities)}
      
      Expand with:
      1. Synonyms for vehicle terms
      2. Related features and specifications
      3. Alternative brand names
      4. Common misspellings
      5. Related categories
      
      Return expanded query terms that would improve search results.
      `;

      const response = await this.callOpenAI(prompt);
      return this.parseExpandedQuery(response);
    } catch (error) {
      console.error('Query expansion error:', error);
      return { original: query, expanded: [query] };
    }
  }

  /**
   * Advanced Search Query Generation
   */
  async generateSearchQuery(nlpResult) {
    const { intent, entities, contextual_query } = nlpResult;
    
    let searchQuery = {
      filters: {},
      sort: {},
      search_text: contextual_query,
      intent: intent
    };

    // Apply entity-based filters
    if (entities.brands && entities.brands.length > 0) {
      searchQuery.filters.brand = entities.brands[0]; // Primary brand
    }

    if (entities.years && entities.years.length > 0) {
      if (entities.years.length === 1) {
        searchQuery.filters.year = entities.years[0];
      } else {
        searchQuery.filters.year_from = Math.min(...entities.years);
        searchQuery.filters.year_to = Math.max(...entities.years);
      }
    }

    if (entities.price_ranges && entities.price_ranges.length > 0) {
      const priceRange = entities.price_ranges[0];
      if (priceRange.max) {
        searchQuery.filters.price_to = priceRange.max;
      }
      if (priceRange.min) {
        searchQuery.filters.price_from = priceRange.min;
      }
    }

    if (entities.mileage_ranges && entities.mileage_ranges.length > 0) {
      const mileageRange = entities.mileage_ranges[0];
      if (mileageRange.max) {
        searchQuery.filters.mileage_to = mileageRange.max;
      }
    }

    if (entities.features && entities.features.length > 0) {
      searchQuery.filters.features = entities.features;
    }

    if (entities.conditions && entities.conditions.length > 0) {
      searchQuery.filters.condition = entities.conditions[0];
    }

    if (entities.categories && entities.categories.length > 0) {
      searchQuery.filters.category = entities.categories[0];
    }

    // Apply intent-based sorting
    switch (intent.intent) {
      case 'price_inquiry':
        searchQuery.sort = { field: 'price', order: 'asc' };
        break;
      case 'recommendation_request':
        searchQuery.sort = { field: 'relevance', order: 'desc' };
        break;
      case 'compare_vehicles':
        searchQuery.sort = { field: 'created_at', order: 'desc' };
        break;
      default:
        searchQuery.sort = { field: 'relevance', order: 'desc' };
    }

    return searchQuery;
  }

  /**
   * Generate Natural Language Response
   */
  async generateResponse(query, searchResults, nlpResult) {
    try {
      const prompt = `
      Generate a natural, helpful response to this vehicle query:
      
      Original Query: "${query}"
      
      Intent: ${nlpResult.intent.intent}
      Sentiment: ${nlpResult.sentiment.sentiment}
      
      Search Results: ${searchResults.length} vehicles found
      
      Create a response that:
      1. Acknowledges the user's query
      2. Provides relevant information
      3. Offers helpful suggestions
      4. Maintains a friendly, professional tone
      5. Includes specific details about found vehicles
      
      Make it conversational and helpful.
      `;

      const response = await this.callOpenAI(prompt);
      return {
        message: response,
        intent: nlpResult.intent.intent,
        results_count: searchResults.length,
        suggestions: this.generateSuggestions(nlpResult, searchResults)
      };
    } catch (error) {
      console.error('Response generation error:', error);
      return {
        message: `I found ${searchResults.length} vehicles matching your search. Would you like me to help you narrow down the results?`,
        intent: nlpResult.intent.intent,
        results_count: searchResults.length,
        suggestions: []
      };
    }
  }

  /**
   * Initialize Intent Classifier
   */
  initializeClassifier() {
    // Training data for intent classification
    const trainingData = [
      { text: 'I need a truck for my business', category: 'search_vehicles' },
      { text: 'What trucks do you have available?', category: 'search_vehicles' },
      { text: 'Show me Mercedes trucks', category: 'search_vehicles' },
      { text: 'Compare these two trucks', category: 'compare_vehicles' },
      { text: 'Which is better, Volvo or Scania?', category: 'compare_vehicles' },
      { text: 'How much does this truck cost?', category: 'price_inquiry' },
      { text: 'What is the price range?', category: 'price_inquiry' },
      { text: 'Can you recommend a good truck?', category: 'recommendation_request' },
      { text: 'What truck would you suggest?', category: 'recommendation_request' },
      { text: 'What is the engine size?', category: 'technical_question' },
      { text: 'Does it have a retarder?', category: 'technical_question' },
      { text: 'How is the truck market doing?', category: 'market_analysis' },
      { text: 'What are the current trends?', category: 'market_analysis' },
      { text: 'Do you offer financing?', category: 'financing_question' },
      { text: 'What payment options are available?', category: 'financing_question' },
      { text: 'How often should I service it?', category: 'maintenance_question' },
      { text: 'What maintenance is required?', category: 'maintenance_question' },
      { text: 'Tell me about trucks', category: 'general_information' },
      { text: 'What is a semi-trailer?', category: 'general_information' },
      { text: 'This truck is overpriced', category: 'complaint_feedback' },
      { text: 'I had a bad experience', category: 'complaint_feedback' }
    ];

    trainingData.forEach(item => {
      this.classifier.addDocument(item.text, item.category);
    });

    this.classifier.train();
  }

  // Helper methods
  hasMultipleConditions(query) {
    const conditionWords = ['and', 'or', 'but', 'also', 'plus', 'with'];
    return conditionWords.some(word => query.toLowerCase().includes(word));
  }

  hasComparisons(query) {
    const comparisonWords = ['better', 'best', 'worse', 'worst', 'compare', 'versus', 'vs', 'than'];
    return comparisonWords.some(word => query.toLowerCase().includes(word));
  }

  hasNegations(query) {
    const negationWords = ['not', 'no', 'without', 'exclude', 'except'];
    return negationWords.some(word => query.toLowerCase().includes(word));
  }

  hasUncertainty(query) {
    const uncertaintyWords = ['maybe', 'perhaps', 'might', 'could', 'possibly', 'probably'];
    return uncertaintyWords.some(word => query.toLowerCase().includes(word));
  }

  getComplexityLevel(score) {
    if (score >= 0.8) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  calculateConfidence(intent, entities, sentiment) {
    let confidence = 0.5; // Base confidence
    
    if (intent.confidence > 0.8) confidence += 0.2;
    if (entities.brands && entities.brands.length > 0) confidence += 0.1;
    if (entities.years && entities.years.length > 0) confidence += 0.1;
    if (sentiment.confidence > 0.7) confidence += 0.1;
    
    return Math.min(1, confidence);
  }

  parseIntentResponse(response) {
    try {
      const intentMatch = response.match(/intent[:\s]*(\w+)/i);
      const confidenceMatch = response.match(/confidence[:\s]*([0-9.]+)/i);
      
      return {
        intent: intentMatch ? intentMatch[1] : 'general_information',
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.7
      };
    } catch (error) {
      return { intent: 'general_information', confidence: 0.5 };
    }
  }

  parseEntityResponse(response) {
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback to simple parsing
      return this.fallbackEntityExtraction(response);
    } catch (error) {
      return this.fallbackEntityExtraction(response);
    }
  }

  fallbackEntityExtraction(query) {
    const entities = {
      brands: [],
      years: [],
      price_ranges: [],
      mileage_ranges: [],
      features: [],
      conditions: [],
      categories: []
    };

    // Simple brand extraction
    const brands = ['mercedes', 'benz', 'scania', 'volvo', 'man', 'daf', 'renault', 'iveco'];
    brands.forEach(brand => {
      if (query.toLowerCase().includes(brand)) {
        entities.brands.push(brand === 'benz' ? 'Mercedes-Benz' : brand.charAt(0).toUpperCase() + brand.slice(1));
      }
    });

    // Simple year extraction
    const yearMatch = query.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      entities.years.push(parseInt(yearMatch[1]));
    }

    // Simple price extraction
    const priceMatch = query.match(/(\d+)[,.]?(\d*)\s*(k|thousand|€|euro)/i);
    if (priceMatch) {
      let price = parseFloat(priceMatch[1] + (priceMatch[2] || ''));
      if (priceMatch[3] && priceMatch[3].toLowerCase() === 'k') {
        price *= 1000;
      }
      entities.price_ranges.push({ max: price });
    }

    return entities;
  }

  parseSentimentResponse(response) {
    try {
      const sentimentMatch = response.match(/sentiment[:\s]*(\w+)/i);
      const confidenceMatch = response.match(/confidence[:\s]*([0-9.]+)/i);
      const urgencyMatch = response.match(/urgency[:\s]*(\w+)/i);
      
      return {
        sentiment: sentimentMatch ? sentimentMatch[1] : 'neutral',
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5,
        urgency: urgencyMatch ? urgencyMatch[1] : 'medium',
        indicators: []
      };
    } catch (error) {
      return {
        sentiment: 'neutral',
        confidence: 0.5,
        urgency: 'medium',
        indicators: []
      };
    }
  }

  parseExpandedQuery(response) {
    try {
      const terms = response.split(',').map(term => term.trim());
      return {
        original: response,
        expanded: terms
      };
    } catch (error) {
      return { original: response, expanded: [response] };
    }
  }

  generateSuggestions(nlpResult, searchResults) {
    const suggestions = [];
    
    if (searchResults.length === 0) {
      suggestions.push('Try broadening your search criteria');
      suggestions.push('Check different vehicle categories');
      suggestions.push('Adjust your price range');
    } else if (searchResults.length > 20) {
      suggestions.push('Narrow down your search with more specific criteria');
      suggestions.push('Filter by brand or year');
      suggestions.push('Set a price range');
    } else {
      suggestions.push('View detailed information about these vehicles');
      suggestions.push('Compare similar vehicles');
      suggestions.push('Save your search for updates');
    }
    
    return suggestions;
  }

  async callOpenAI(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in natural language processing for vehicle marketplaces. Provide accurate, structured responses.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}

module.exports = AdvancedNLP;
