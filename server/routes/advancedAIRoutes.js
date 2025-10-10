const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Import our ML models and NLP
const {
  PricePredictionModel,
  QualityAssessmentModel,
  MarketIntelligenceModel,
  RecommendationEngine
} = require('../ai/mlModels');
const EnhancedNLP = require('../ai/enhancedNLP');

// Database connection
const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

// Initialize AI models
const priceModel = new PricePredictionModel();
const qualityModel = new QualityAssessmentModel();
const marketModel = new MarketIntelligenceModel();
const recommendationEngine = new RecommendationEngine();
const nlp = new EnhancedNLP();

/**
 * Advanced AI Chatbot with ML Integration
 */
router.post('/chatbot', async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a message for the AI assistant'
      });
    }

    // Enhanced NLP processing
    const query = nlp.understandQuery(message);
    
    // Process based on intent
    let response;
    switch (query.intent) {
      case 'search_vehicles':
        response = await handleVehicleSearch(query);
        break;
      case 'price_estimation':
        response = await handlePriceEstimation(query);
        break;
      case 'compare_vehicles':
        response = await handleVehicleComparison(query);
        break;
      case 'quality_assessment':
        response = await handleQualityAssessment(query);
        break;
      case 'get_recommendations':
        response = await handleRecommendations(query);
        break;
      case 'market_insights':
        response = await handleMarketInsights(query);
        break;
      case 'feature_search':
        response = await handleFeatureSearch(query);
        break;
      default:
        response = await handleGeneralQuery(query);
    }

    res.json({
      success: true,
      data: {
        ...response,
        nlp_analysis: {
          intent: query.intent,
          confidence: query.confidence,
          entities: query.entities,
          sentiment: query.sentiment
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Advanced AI chatbot error:', error);
    res.status(500).json({
      error: 'AI processing failed',
      message: 'Unable to process your request at this time'
    });
  }
});

/**
 * Price Prediction Endpoint
 */
router.post('/predict-price', async (req, res) => {
  try {
    const vehicleData = req.body;

    if (!vehicleData.year || !vehicleData.brand) {
      return res.status(400).json({
        error: 'Missing required data',
        message: 'Year and brand are required for price prediction'
      });
    }

    const predictedPrice = priceModel.predictPrice(vehicleData);
    const confidence = priceModel.getPriceConfidence(vehicleData);
    const marketAnalysis = marketModel.predictMarketValue(vehicleData);

    res.json({
      success: true,
      data: {
        predicted_price: predictedPrice,
        confidence: confidence,
        market_analysis: marketAnalysis,
        factors: {
          year: vehicleData.year,
          mileage: vehicleData.mileage,
          brand: vehicleData.brand,
          condition: vehicleData.condition,
          fuel_type: vehicleData.fuel_type,
          transmission: vehicleData.transmission
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      error: 'Price prediction failed',
      message: 'Unable to predict price at this time'
    });
  }
});

/**
 * Quality Assessment Endpoint
 */
router.post('/assess-quality', async (req, res) => {
  try {
    const vehicleData = req.body;

    if (!vehicleData.id && !vehicleData.brand) {
      return res.status(400).json({
        error: 'Missing vehicle data',
        message: 'Vehicle ID or vehicle data is required for quality assessment'
      });
    }

    // If vehicle ID provided, fetch from database
    let vehicle;
    if (vehicleData.id) {
      vehicle = await getVehicleById(vehicleData.id);
      if (!vehicle) {
        return res.status(404).json({
          error: 'Vehicle not found',
          message: 'No vehicle found with the provided ID'
        });
      }
    } else {
      vehicle = vehicleData;
    }

    const qualityAssessment = qualityModel.assessQuality(vehicle);

    res.json({
      success: true,
      data: {
        vehicle_id: vehicle.id,
        quality_score: qualityAssessment.score,
        quality_grade: qualityAssessment.grade,
        quality_factors: qualityAssessment.factors,
        recommendations: qualityAssessment.recommendations,
        detailed_analysis: {
          mileage_impact: vehicle.mileage < 100000 ? 'Positive' : 'Negative',
          year_impact: vehicle.year > 2018 ? 'Positive' : 'Neutral',
          condition_impact: vehicle.condition === 'New' ? 'Excellent' : 'Good',
          service_history: vehicle.service_history ? 'Complete' : 'Incomplete',
          accident_history: vehicle.accident_free ? 'Clean' : 'Has incidents'
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Quality assessment error:', error);
    res.status(500).json({
      error: 'Quality assessment failed',
      message: 'Unable to assess vehicle quality at this time'
    });
  }
});

/**
 * Market Intelligence Endpoint
 */
router.get('/market-insights', async (req, res) => {
  try {
    const { vehicle_type, timeframe } = req.query;
    
    const marketTrends = marketModel.analyzeMarketTrends(vehicle_type);
    
    // Get additional market data from database
    const marketData = await getMarketData(vehicle_type);
    
    res.json({
      success: true,
      data: {
        trends: marketTrends,
        market_data: marketData,
        insights: [
          'Electric vehicle demand increasing by 25% year-over-year',
          'Diesel vehicle prices declining due to regulatory changes',
          'Automatic transmission preference growing to 75% of buyers',
          'Low mileage vehicles commanding 15% premium',
          'Safety features becoming standard requirements'
        ],
        recommendations: [
          'Consider electric vehicles for future-proofing',
          'Focus on fuel efficiency for cost savings',
          'Prioritize safety features for better resale value',
          'Maintain complete service records',
          'Consider seasonal timing for purchases'
        ],
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({
      error: 'Market insights failed',
      message: 'Unable to retrieve market insights at this time'
    });
  }
});

/**
 * Smart Recommendations Endpoint
 */
router.post('/recommendations', async (req, res) => {
  try {
    const { preferences, user_id } = req.body;

    if (!preferences) {
      return res.status(400).json({
        error: 'Preferences required',
        message: 'User preferences are required for recommendations'
      });
    }

    // Get available vehicles based on preferences
    const availableVehicles = await getVehiclesByPreferences(preferences);
    
    // Generate recommendations using ML
    const recommendations = recommendationEngine.generateRecommendations(
      preferences, 
      availableVehicles
    );

    res.json({
      success: true,
      data: {
        recommendations: recommendations,
        total_matches: availableVehicles.length,
        user_preferences: preferences,
        recommendation_engine: 'ML-powered',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      error: 'Recommendations failed',
      message: 'Unable to generate recommendations at this time'
    });
  }
});

/**
 * Vehicle Comparison Endpoint
 */
router.post('/compare', async (req, res) => {
  try {
    const { vehicle_ids, comparison_criteria } = req.body;

    if (!vehicle_ids || vehicle_ids.length < 2) {
      return res.status(400).json({
        error: 'Invalid comparison request',
        message: 'At least 2 vehicle IDs are required for comparison'
      });
    }

    // Get vehicle data
    const vehicles = await Promise.all(
      vehicle_ids.map(id => getVehicleById(id))
    );

    const validVehicles = vehicles.filter(v => v !== null);
    
    if (validVehicles.length < 2) {
      return res.status(400).json({
        error: 'Invalid vehicles',
        message: 'Could not find valid vehicles for comparison'
      });
    }

    // Perform comparison
    const comparison = performVehicleComparison(validVehicles, comparison_criteria);

    res.json({
      success: true,
      data: {
        vehicles: validVehicles,
        comparison: comparison,
        winner: comparison.winner,
        summary: comparison.summary,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Vehicle comparison error:', error);
    res.status(500).json({
      error: 'Comparison failed',
      message: 'Unable to compare vehicles at this time'
    });
  }
});

// Helper functions
async function handleVehicleSearch(query) {
  const filters = query.structured_filters;
  const vehicles = await searchVehiclesWithFilters(filters);
  
  return {
    message: `Found ${vehicles.length} vehicles matching your criteria. Here are the best matches:`,
    intent: 'vehicle_search',
    confidence: query.confidence,
    vehicles: vehicles.slice(0, 10),
    total_results: vehicles.length,
    suggestions: generateSearchSuggestions(filters)
  };
}

async function handlePriceEstimation(query) {
  const entities = query.entities;
  
  if (entities.brands.length === 0 || entities.years.length === 0) {
    return {
      message: "I'd be happy to provide a price estimate! Please specify the brand and year of the vehicle you're interested in.",
      intent: 'price_estimation',
      confidence: query.confidence,
      suggestions: [
        'Get price estimate for 2020 Mercedes truck',
        'What is the market value of a 2019 Volvo?',
        'Price estimate for 2021 Scania with 100,000 km'
      ]
    };
  }

  const vehicleData = {
    brand: entities.brands[0],
    year: entities.years[0],
    mileage: entities.mileage[0] || 150000,
    condition: entities.conditions[0] || 'Used',
    fuel_type: entities.fuel_types[0] || 'Diesel',
    transmission: entities.transmissions[0] || 'Manual'
  };

  const predictedPrice = priceModel.predictPrice(vehicleData);
  const confidence = priceModel.getPriceConfidence(vehicleData);
  const marketAnalysis = marketModel.predictMarketValue(vehicleData);

  return {
    message: `Based on our AI analysis, a ${vehicleData.year} ${vehicleData.brand} ${vehicleData.condition.toLowerCase()} vehicle has an estimated market value of **€${predictedPrice.toLocaleString()}**. Confidence: ${Math.round(confidence * 100)}%`,
    intent: 'price_estimation',
    confidence: query.confidence,
    predicted_price: predictedPrice,
    price_confidence: confidence,
    market_analysis: marketAnalysis,
    suggestions: [
      `Compare ${vehicleData.brand} vs other brands`,
      `Find ${vehicleData.brand} vehicles under €${Math.round(predictedPrice * 0.8).toLocaleString()}`,
      `Get quality assessment for ${vehicleData.brand}`,
      'View market trends for this vehicle type'
    ]
  };
}

async function handleVehicleComparison(query) {
  const entities = query.entities;
  
  if (entities.brands.length < 2) {
    return {
      message: "I'd be happy to help you compare vehicles! Please specify which brands or models you'd like to compare.",
      intent: 'compare_vehicles',
      confidence: query.confidence,
      suggestions: [
        'Compare Mercedes vs Scania trucks',
        'Compare BMW vs Audi cars',
        'Compare different truck models'
      ]
    };
  }

  return {
    message: `I'll help you compare ${entities.brands.join(' vs ')}. Let me analyze specifications, pricing, reliability, and market performance.`,
    intent: 'compare_vehicles',
    confidence: query.confidence,
    comparison_brands: entities.brands,
    suggestions: [
      `Show me ${entities.brands[0]} vehicles`,
      `Show me ${entities.brands[1]} vehicles`,
      'Compare by fuel efficiency',
      'Compare by price range'
    ]
  };
}

async function handleQualityAssessment(query) {
  return {
    message: "I'll assess vehicle quality for you! I'll analyze mileage, condition, service history, accident records, and market reputation to provide a comprehensive quality assessment.",
    intent: 'quality_assessment',
    confidence: query.confidence,
    suggestions: [
      'Assess quality of a specific vehicle',
      'Find high-quality vehicles under €50,000',
      'Compare vehicle conditions',
      'Get quality report for trucks'
    ]
  };
}

async function handleRecommendations(query) {
  const entities = query.entities;
  
  return {
    message: "I'll recommend the best vehicles for you! I'll consider your preferences, budget, and requirements to suggest the most suitable options.",
    intent: 'get_recommendations',
    confidence: query.confidence,
    suggestions: [
      'Recommend trucks under €40,000',
      'Find best value vehicles',
      'Show me top-rated vehicles',
      'Recommend based on my preferences'
    ]
  };
}

async function handleMarketInsights(query) {
  return {
    message: "I'll provide you with current market insights! I'll analyze trends, demand patterns, price forecasts, and market intelligence.",
    intent: 'market_insights',
    confidence: query.confidence,
    suggestions: [
      'Show me current market trends',
      'Get demand analysis for trucks',
      'Find best time to buy vehicles',
      'Compare market prices by region'
    ]
  };
}

async function handleFeatureSearch(query) {
  const entities = query.entities;
  
  return {
    message: "I'll find vehicles with the features you need! Let me search for vehicles matching your specifications.",
    intent: 'feature_search',
    confidence: query.confidence,
    features: entities.fuel_types.concat(entities.transmissions),
    suggestions: [
      'Show me electric vehicles',
      'Find automatic transmission vehicles',
      'Search by fuel efficiency',
      'Filter by safety features'
    ]
  };
}

async function handleGeneralQuery(query) {
  return {
    message: "I'm here to help you with your vehicle needs! I can assist with searching, pricing, comparisons, quality assessments, recommendations, and market insights. What would you like to know?",
    intent: 'general',
    confidence: query.confidence,
    suggestions: [
      'Find vehicles by brand',
      'Get price estimates',
      'Compare vehicles',
      'Get market insights'
    ]
  };
}

// Database helper functions
function getVehicleById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM trucks WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function searchVehiclesWithFilters(filters) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM trucks WHERE 1=1';
    const params = [];

    if (filters.brands && filters.brands.length > 0) {
      const brandConditions = filters.brands.map(() => 'brand LIKE ?').join(' OR ');
      query += ` AND (${brandConditions})`;
      filters.brands.forEach(brand => params.push(`%${brand}%`));
    }

    if (filters.max_price) {
      query += ' AND price <= ?';
      params.push(filters.max_price);
    }

    if (filters.min_year) {
      query += ' AND year >= ?';
      params.push(filters.min_year);
    }

    if (filters.max_mileage) {
      query += ' AND mileage <= ?';
      params.push(filters.max_mileage);
    }

    query += ' ORDER BY price ASC LIMIT 20';

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function getVehiclesByPreferences(preferences) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM trucks WHERE 1=1';
    const params = [];

    if (preferences.max_price) {
      query += ' AND price <= ?';
      params.push(preferences.max_price);
    }

    if (preferences.min_year) {
      query += ' AND year >= ?';
      params.push(preferences.min_year);
    }

    if (preferences.max_mileage) {
      query += ' AND mileage <= ?';
      params.push(preferences.max_mileage);
    }

    if (preferences.fuel_type) {
      query += ' AND fuel_type = ?';
      params.push(preferences.fuel_type);
    }

    query += ' ORDER BY price ASC LIMIT 50';

    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function getMarketData(vehicleType) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        COUNT(*) as total_listings,
        AVG(mileage) as avg_mileage,
        AVG(year) as avg_year
      FROM trucks
      WHERE category LIKE ?
    `;

    db.get(query, [`%${vehicleType || ''}%`], (err, row) => {
      if (err) reject(err);
      else resolve(row || {});
    });
  });
}

function performVehicleComparison(vehicles, criteria) {
  const comparison = {
    vehicles: vehicles,
    scores: {},
    winner: null,
    summary: {}
  };

  // Calculate scores for each vehicle
  vehicles.forEach(vehicle => {
    let score = 0;
    
    // Price score (lower is better)
    const avgPrice = vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length;
    const priceScore = 100 - ((vehicle.price / avgPrice) * 50);
    score += priceScore * 0.3;
    
    // Mileage score (lower is better)
    const avgMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0) / vehicles.length;
    const mileageScore = 100 - ((vehicle.mileage / avgMileage) * 50);
    score += mileageScore * 0.25;
    
    // Year score (newer is better)
    const avgYear = vehicles.reduce((sum, v) => sum + v.year, 0) / vehicles.length;
    const yearScore = ((vehicle.year / avgYear) * 50) + 50;
    score += yearScore * 0.2;
    
    // Engine power score
    if (vehicle.engine_power) {
      const avgPower = vehicles.reduce((sum, v) => sum + (v.engine_power || 0), 0) / vehicles.length;
      const powerScore = ((vehicle.engine_power / avgPower) * 50) + 50;
      score += powerScore * 0.15;
    }
    
    // Condition score
    const conditionScores = { 'New': 100, 'Certified Pre-Owned': 90, 'Used': 70, 'Fair': 50, 'Poor': 20 };
    score += (conditionScores[vehicle.condition] || 50) * 0.1;
    
    comparison.scores[vehicle.id] = Math.round(score);
  });

  // Find winner
  const winnerId = Object.keys(comparison.scores).reduce((a, b) => 
    comparison.scores[a] > comparison.scores[b] ? a : b
  );
  comparison.winner = vehicles.find(v => v.id == winnerId);

  // Generate summary
  comparison.summary = {
    best_price: vehicles.reduce((min, v) => v.price < min.price ? v : min),
    lowest_mileage: vehicles.reduce((min, v) => v.mileage < min.mileage ? v : min),
    newest: vehicles.reduce((max, v) => v.year > max.year ? v : max),
    most_powerful: vehicles.reduce((max, v) => (v.engine_power || 0) > (max.engine_power || 0) ? v : max)
  };

  return comparison;
}

function generateSearchSuggestions(filters) {
  const suggestions = [];
  
  if (filters.brands && filters.brands.length > 0) {
    suggestions.push(`Show me ${filters.brands[0]} vehicles under €30,000`);
    suggestions.push(`Find ${filters.brands[0]} from 2020 or newer`);
  }
  
  if (filters.max_price) {
    suggestions.push(`Show me vehicles under €${Math.round(filters.max_price * 0.7).toLocaleString()}`);
  }
  
  suggestions.push('Compare different brands');
  suggestions.push('Get price estimates');
  
  return suggestions;
}

module.exports = router;
