const natural = require('natural');

/**
 * Enhanced Natural Language Processing for Vehicle Platform
 */

class EnhancedNLP {
  constructor() {
    this.intentPatterns = {
      // Vehicle search intents
      search_vehicles: [
        'find', 'search', 'look for', 'show me', 'get me', 'browse',
        'trucks', 'cars', 'vehicles', 'motorcycles', 'ebikes', 'caravans'
      ],
      
      // Price-related intents
      price_estimation: [
        'price', 'cost', 'value', 'worth', 'estimate', 'valuation',
        'how much', 'what is the price', 'market value', 'fair price'
      ],
      
      // Comparison intents
      compare_vehicles: [
        'compare', 'vs', 'versus', 'difference', 'better', 'which is',
        'between', 'against', 'versus'
      ],
      
      // Quality assessment intents
      quality_assessment: [
        'quality', 'condition', 'assess', 'evaluate', 'inspect',
        'good condition', 'reliable', 'dependable', 'worth buying'
      ],
      
      // Recommendation intents
      get_recommendations: [
        'recommend', 'suggest', 'advise', 'best', 'top', 'ideal',
        'perfect for', 'suitable', 'what should I buy'
      ],
      
      // Market insights intents
      market_insights: [
        'market', 'trends', 'demand', 'supply', 'insights', 'analysis',
        'forecast', 'prediction', 'future', 'outlook'
      ],
      
      // Feature-specific intents
      feature_search: [
        'with', 'having', 'equipped', 'features', 'options',
        'automatic', 'manual', 'electric', 'diesel', 'hybrid'
      ]
    };

    this.entityExtractors = {
      brands: [
        'mercedes', 'benz', 'bmw', 'audi', 'volkswagen', 'toyota', 'honda',
        'ford', 'nissan', 'mazda', 'hyundai', 'tesla', 'volvo', 'porsche',
        'renault', 'peugeot', 'kia', 'scania', 'man', 'daf', 'iveco',
        'freightliner', 'kenworth', 'peterbilt', 'mack', 'hino', 'isuzu'
      ],
      
      vehicle_types: [
        'truck', 'trucks', 'car', 'cars', 'vehicle', 'vehicles',
        'motorcycle', 'motorcycles', 'bike', 'bikes', 'ebike', 'ebikes',
        'caravan', 'caravans', 'motorhome', 'motorhomes', 'van', 'vans'
      ],
      
      conditions: [
        'new', 'used', 'certified', 'pre-owned', 'fair', 'poor',
        'excellent', 'good', 'very good', 'mint', 'damaged'
      ],
      
      fuel_types: [
        'diesel', 'petrol', 'gasoline', 'electric', 'hybrid', 'cng', 'lpg',
        'gas', 'battery', 'plug-in'
      ],
      
      transmissions: [
        'automatic', 'manual', 'semi-automatic', 'cvt', 'tiptronic',
        'dsg', 'auto', 'stick', 'gearbox'
      ]
    };

    // Simple sentiment analysis using AFINN dictionary
    this.sentimentAnalyzer = {
      getSentiment: (tokens) => {
        // Simple sentiment scoring - in a real app, you'd use a proper sentiment library
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'perfect', 'love', 'best'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointed'];
        
        let score = 0;
        tokens.forEach(token => {
          if (positiveWords.includes(token.toLowerCase())) score += 1;
          if (negativeWords.includes(token.toLowerCase())) score -= 1;
        });
        
        return score;
      }
    };
    
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
  }

  // Main intent recognition method
  recognizeIntent(message) {
    const messageLower = message.toLowerCase();
    const tokens = this.tokenizer.tokenize(messageLower);
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    const intentScores = {};
    
    // Calculate scores for each intent
    Object.keys(this.intentPatterns).forEach(intent => {
      let score = 0;
      const patterns = this.intentPatterns[intent];
      
      patterns.forEach(pattern => {
        const patternTokens = this.tokenizer.tokenize(pattern);
        const stemmedPatternTokens = patternTokens.map(token => this.stemmer.stem(token));
        
        // Check for exact matches
        if (messageLower.includes(pattern)) {
          score += 2;
        }
        
        // Check for token matches
        stemmedPatternTokens.forEach(patternToken => {
          if (stemmedTokens.includes(patternToken)) {
            score += 1;
          }
        });
      });
      
      intentScores[intent] = score;
    });
    
    // Find the intent with highest score
    const sortedIntents = Object.entries(intentScores)
      .sort(([,a], [,b]) => b - a);
    
    const primaryIntent = sortedIntents[0][0];
    const confidence = Math.min(sortedIntents[0][1] / 5, 1); // Normalize to 0-1
    
    return {
      intent: primaryIntent,
      confidence: confidence,
      all_scores: intentScores,
      entities: this.extractEntities(message)
    };
  }

  // Extract entities from the message
  extractEntities(message) {
    const messageLower = message.toLowerCase();
    const entities = {
      brands: [],
      vehicle_types: [],
      conditions: [],
      fuel_types: [],
      transmissions: [],
      prices: [],
      years: [],
      mileage: [],
      locations: []
    };

    // Extract brands
    this.entityExtractors.brands.forEach(brand => {
      if (messageLower.includes(brand)) {
        entities.brands.push(brand);
      }
    });

    // Extract vehicle types
    this.entityExtractors.vehicle_types.forEach(type => {
      if (messageLower.includes(type)) {
        entities.vehicle_types.push(type);
      }
    });

    // Extract conditions
    this.entityExtractors.conditions.forEach(condition => {
      if (messageLower.includes(condition)) {
        entities.conditions.push(condition);
      }
    });

    // Extract fuel types
    this.entityExtractors.fuel_types.forEach(fuel => {
      if (messageLower.includes(fuel)) {
        entities.fuel_types.push(fuel);
      }
    });

    // Extract transmissions
    this.entityExtractors.transmissions.forEach(transmission => {
      if (messageLower.includes(transmission)) {
        entities.transmissions.push(transmission);
      }
    });

    // Extract prices (€X, X euros, under X, below X, etc.)
    const pricePatterns = [
      /€(\d+(?:,\d{3})*(?:\.\d{2})?)/g,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*euros?/gi,
      /under\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /below\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /less\s*than\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
      /max\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
    ];

    pricePatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const price = match.replace(/[€,]/g, '').replace(/euros?/gi, '').trim();
          entities.prices.push(parseInt(price));
        });
      }
    });

    // Extract years (20XX)
    const yearPattern = /(20\d{2})/g;
    const yearMatches = message.match(yearPattern);
    if (yearMatches) {
      entities.years = yearMatches.map(year => parseInt(year));
    }

    // Extract mileage (X km, X kilometers, X miles)
    const mileagePatterns = [
      /(\d+(?:,\d{3})*)\s*km/gi,
      /(\d+(?:,\d{3})*)\s*kilometers?/gi,
      /(\d+(?:,\d{3})*)\s*miles?/gi
    ];

    mileagePatterns.forEach(pattern => {
      const matches = message.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const mileage = match.replace(/[km,]/gi, '').replace(/kilometers?/gi, '').replace(/miles?/gi, '').trim();
          entities.mileage.push(parseInt(mileage));
        });
      }
    });

    // Extract locations (common European cities/countries)
    const locations = [
      'germany', 'france', 'italy', 'spain', 'netherlands', 'belgium',
      'berlin', 'munich', 'hamburg', 'paris', 'lyon', 'rome', 'milan',
      'madrid', 'barcelona', 'amsterdam', 'rotterdam', 'brussels',
      'antwerp', 'vienna', 'zurich', 'geneva', 'stockholm', 'oslo'
    ];

    locations.forEach(location => {
      if (messageLower.includes(location)) {
        entities.locations.push(location);
      }
    });

    return entities;
  }

  // Analyze sentiment of the message
  analyzeSentiment(message) {
    const tokens = this.tokenizer.tokenize(message);
    const sentiment = this.sentimentAnalyzer.getSentiment(tokens);
    
    let sentimentLabel = 'neutral';
    if (sentiment > 0.1) sentimentLabel = 'positive';
    else if (sentiment < -0.1) sentimentLabel = 'negative';
    
    return {
      score: sentiment,
      label: sentimentLabel,
      confidence: Math.abs(sentiment)
    };
  }

  // Generate contextual response based on intent and entities
  generateContextualResponse(intent, entities, sentiment) {
    const responses = {
      search_vehicles: this.generateSearchResponse(entities),
      price_estimation: this.generatePriceResponse(entities),
      compare_vehicles: this.generateComparisonResponse(entities),
      quality_assessment: this.generateQualityResponse(entities),
      get_recommendations: this.generateRecommendationResponse(entities),
      market_insights: this.generateMarketResponse(entities),
      feature_search: this.generateFeatureResponse(entities)
    };

    return responses[intent] || this.generateDefaultResponse();
  }

  generateSearchResponse(entities) {
    let response = "I'll help you find the perfect vehicle! ";
    
    if (entities.vehicle_types.length > 0) {
      response += `Looking for ${entities.vehicle_types.join(' and ')}. `;
    }
    
    if (entities.brands.length > 0) {
      response += `Interested in ${entities.brands.join(' and ')}. `;
    }
    
    if (entities.prices.length > 0) {
      const maxPrice = Math.max(...entities.prices);
      response += `Budget up to €${maxPrice.toLocaleString()}. `;
    }
    
    if (entities.years.length > 0) {
      response += `From year ${Math.max(...entities.years)} or newer. `;
    }
    
    return response + "Let me search our database for the best matches.";
  }

  generatePriceResponse(entities) {
    let response = "I'll provide you with an accurate price estimate! ";
    
    if (entities.brands.length > 0 && entities.years.length > 0) {
      response += `For a ${entities.years[0]} ${entities.brands[0]}, `;
    }
    
    response += "I'll analyze market data, vehicle condition, mileage, and current trends to give you the most accurate valuation.";
    
    return response;
  }

  generateComparisonResponse(entities) {
    let response = "I'll help you compare vehicles! ";
    
    if (entities.brands.length >= 2) {
      response += `Comparing ${entities.brands.join(' vs ')}. `;
    }
    
    response += "I'll analyze specifications, pricing, reliability, fuel efficiency, and market performance to help you make the best decision.";
    
    return response;
  }

  generateQualityResponse(entities) {
    return "I'll assess the vehicle quality for you! I'll analyze mileage, condition, service history, accident records, and market reputation to provide a comprehensive quality assessment with recommendations.";
  }

  generateRecommendationResponse(entities) {
    let response = "I'll recommend the best vehicles for you! ";
    
    if (entities.vehicle_types.length > 0) {
      response += `Based on your interest in ${entities.vehicle_types.join(' and ')}, `;
    }
    
    response += "I'll consider your preferences, budget, and requirements to suggest the most suitable options.";
    
    return response;
  }

  generateMarketResponse(entities) {
    return "I'll provide you with current market insights! I'll analyze trends, demand patterns, price forecasts, and market intelligence to help you understand the current vehicle market landscape.";
  }

  generateFeatureResponse(entities) {
    let response = "I'll find vehicles with the features you need! ";
    
    if (entities.fuel_types.length > 0) {
      response += `Looking for ${entities.fuel_types.join(' and ')} vehicles. `;
    }
    
    if (entities.transmissions.length > 0) {
      response += `With ${entities.transmissions.join(' and ')} transmission. `;
    }
    
    return response + "Let me search for vehicles matching your specifications.";
  }

  generateDefaultResponse() {
    return "I'm here to help you with your vehicle needs! I can assist with searching, pricing, comparisons, quality assessments, recommendations, and market insights. What would you like to know?";
  }

  // Advanced query understanding
  understandQuery(message) {
    const intent = this.recognizeIntent(message);
    const sentiment = this.analyzeSentiment(message);
    const entities = intent.entities;
    
    // Build structured query
    const query = {
      intent: intent.intent,
      confidence: intent.confidence,
      entities: entities,
      sentiment: sentiment,
      original_message: message,
      structured_filters: this.buildStructuredFilters(entities),
      response_template: this.generateContextualResponse(intent.intent, entities, sentiment)
    };
    
    return query;
  }

  buildStructuredFilters(entities) {
    const filters = {};
    
    if (entities.brands.length > 0) {
      filters.brands = entities.brands;
    }
    
    if (entities.vehicle_types.length > 0) {
      filters.vehicle_types = entities.vehicle_types;
    }
    
    if (entities.prices.length > 0) {
      filters.max_price = Math.max(...entities.prices);
    }
    
    if (entities.years.length > 0) {
      filters.min_year = Math.max(...entities.years);
    }
    
    if (entities.mileage.length > 0) {
      filters.max_mileage = Math.max(...entities.mileage);
    }
    
    if (entities.fuel_types.length > 0) {
      filters.fuel_types = entities.fuel_types;
    }
    
    if (entities.transmissions.length > 0) {
      filters.transmissions = entities.transmissions;
    }
    
    if (entities.conditions.length > 0) {
      filters.conditions = entities.conditions;
    }
    
    if (entities.locations.length > 0) {
      filters.locations = entities.locations;
    }
    
    return filters;
  }
}

module.exports = EnhancedNLP;
