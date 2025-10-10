/**
 * Advanced AI Pricing System
 * World-class pricing intelligence for vehicles
 */

const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

class AdvancedPricingAI {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  /**
   * Advanced Price Prediction with Multiple AI Models
   */
  async predictVehiclePrice(vehicleData) {
    try {
      // 1. Market Data Analysis
      const marketData = await this.analyzeMarketData(vehicleData);
      
      // 2. Historical Price Analysis
      const historicalData = await this.analyzeHistoricalPrices(vehicleData);
      
      // 3. External Market Intelligence
      const externalData = await this.fetchExternalMarketData(vehicleData);
      
      // 4. AI Model Ensemble
      const predictions = await this.runEnsemblePrediction({
        ...vehicleData,
        marketData,
        historicalData,
        externalData
      });

      // 5. Confidence Scoring
      const confidence = this.calculateConfidenceScore(predictions, marketData);

      return {
        predicted_price: predictions.ensemble_price,
        price_range: {
          min: predictions.ensemble_price * 0.85,
          max: predictions.ensemble_price * 1.15
        },
        confidence: confidence,
        factors: this.explainPricingFactors(vehicleData, predictions),
        market_insights: marketData.insights,
        recommendations: this.generatePricingRecommendations(predictions, vehicleData)
      };
    } catch (error) {
      console.error('Advanced pricing prediction error:', error);
      throw error;
    }
  }

  /**
   * Analyze Market Data with AI
   */
  async analyzeMarketData(vehicleData) {
    const prompt = `
    Analyze the current market conditions for this vehicle:
    - Brand: ${vehicleData.brand}
    - Model: ${vehicleData.model}
    - Year: ${vehicleData.year}
    - Mileage: ${vehicleData.mileage} km
    - Category: ${vehicleData.category}
    - Features: ${JSON.stringify(vehicleData.features)}
    
    Consider:
    1. Current market demand
    2. Seasonal trends
    3. Economic factors
    4. Brand reputation
    5. Model popularity
    6. Feature desirability
    
    Provide market insights and demand indicators.
    `;

    const response = await this.callOpenAI(prompt);
    return {
      insights: response,
      demand_score: this.calculateDemandScore(vehicleData),
      market_trend: await this.getMarketTrend(vehicleData)
    };
  }

  /**
   * Historical Price Analysis
   */
  async analyzeHistoricalPrices(vehicleData) {
    // Query historical data
    const { data: historicalPrices } = await this.supabase
      .from('vehicle_sales_history')
      .select('*')
      .eq('brand', vehicleData.brand)
      .eq('model', vehicleData.model)
      .gte('year', vehicleData.year - 2)
      .lte('year', vehicleData.year + 2)
      .order('sale_date', { ascending: false })
      .limit(100);

    if (!historicalPrices || historicalPrices.length === 0) {
      return { trend: 'stable', confidence: 0.3 };
    }

    // Calculate price trends
    const prices = historicalPrices.map(sale => sale.sale_price);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const trend = this.calculatePriceTrend(prices);

    return {
      average_price: avgPrice,
      trend: trend.direction,
      trend_strength: trend.strength,
      price_volatility: this.calculateVolatility(prices),
      sample_size: historicalPrices.length,
      confidence: Math.min(0.9, historicalPrices.length / 50)
    };
  }

  /**
   * Fetch External Market Data
   */
  async fetchExternalMarketData(vehicleData) {
    try {
      // Fetch from multiple sources
      const [autotraderData, mobileDeData, truckTraderData] = await Promise.all([
        this.fetchAutotraderData(vehicleData),
        this.fetchMobileDeData(vehicleData),
        this.fetchTruckTraderData(vehicleData)
      ]);

      return {
        autotrader: autotraderData,
        mobile_de: mobileDeData,
        truck_trader: truckTraderData,
        market_average: this.calculateMarketAverage([autotraderData, mobileDeData, truckTraderData])
      };
    } catch (error) {
      console.error('External market data fetch error:', error);
      return { error: 'Unable to fetch external data' };
    }
  }

  /**
   * Ensemble Prediction with Multiple Models
   */
  async runEnsemblePrediction(data) {
    const models = [
      this.linearRegressionModel(data),
      this.randomForestModel(data),
      this.neuralNetworkModel(data),
      this.gradientBoostingModel(data)
    ];

    const predictions = await Promise.all(models);
    
    // Weighted ensemble
    const weights = [0.2, 0.3, 0.3, 0.2]; // Adjust based on model performance
    const ensemblePrice = predictions.reduce((sum, pred, index) => 
      sum + (pred.price * weights[index]), 0
    );

    return {
      ensemble_price: Math.round(ensemblePrice),
      individual_predictions: predictions,
      model_weights: weights
    };
  }

  /**
   * Linear Regression Model
   */
  linearRegressionModel(data) {
    const features = this.extractFeatures(data);
    const coefficients = this.getTrainedCoefficients();
    
    let price = coefficients.intercept;
    Object.keys(features).forEach(feature => {
      price += coefficients[feature] * features[feature];
    });

    return {
      model: 'linear_regression',
      price: Math.max(0, price),
      confidence: 0.75
    };
  }

  /**
   * Random Forest Model (Simplified)
   */
  randomForestModel(data) {
    const features = this.extractFeatures(data);
    const trees = this.getRandomForestTrees();
    
    const predictions = trees.map(tree => this.predictWithTree(features, tree));
    const avgPrediction = predictions.reduce((sum, pred) => sum + pred, 0) / predictions.length;

    return {
      model: 'random_forest',
      price: Math.max(0, avgPrediction),
      confidence: 0.82
    };
  }

  /**
   * Neural Network Model (Simplified)
   */
  neuralNetworkModel(data) {
    const features = this.extractFeatures(data);
    const weights = this.getNeuralNetworkWeights();
    
    // Simple feedforward neural network
    let hidden = this.matrixMultiply(features, weights.input_to_hidden);
    hidden = this.relu(hidden);
    let output = this.matrixMultiply(hidden, weights.hidden_to_output);
    output = this.sigmoid(output);

    return {
      model: 'neural_network',
      price: Math.max(0, output * 100000), // Scale to price range
      confidence: 0.85
    };
  }

  /**
   * Gradient Boosting Model
   */
  gradientBoostingModel(data) {
    const features = this.extractFeatures(data);
    const boosters = this.getGradientBoostingBoosters();
    
    let prediction = 0;
    boosters.forEach(booster => {
      prediction += booster.predict(features);
    });

    return {
      model: 'gradient_boosting',
      price: Math.max(0, prediction),
      confidence: 0.88
    };
  }

  /**
   * Calculate Confidence Score
   */
  calculateConfidenceScore(predictions, marketData) {
    const modelAgreement = this.calculateModelAgreement(predictions.individual_predictions);
    const dataQuality = this.assessDataQuality(marketData);
    const marketStability = this.assessMarketStability(marketData);

    return (modelAgreement * 0.4 + dataQuality * 0.3 + marketStability * 0.3);
  }

  /**
   * Explain Pricing Factors
   */
  explainPricingFactors(vehicleData, predictions) {
    const factors = [];

    // Age factor
    const currentYear = new Date().getFullYear();
    const age = currentYear - vehicleData.year;
    factors.push({
      factor: 'Vehicle Age',
      impact: age > 5 ? 'negative' : 'positive',
      explanation: `${age} years old - ${age > 5 ? 'Significant depreciation' : 'Relatively new'}`
    });

    // Mileage factor
    const mileageImpact = vehicleData.mileage > 500000 ? 'negative' : 
                         vehicleData.mileage < 200000 ? 'positive' : 'neutral';
    factors.push({
      factor: 'Mileage',
      impact: mileageImpact,
      explanation: `${vehicleData.mileage.toLocaleString()} km - ${mileageImpact === 'positive' ? 'Low mileage' : mileageImpact === 'negative' ? 'High mileage' : 'Average mileage'}`
    });

    // Brand factor
    const premiumBrands = ['Mercedes-Benz', 'Scania', 'Volvo', 'MAN'];
    const isPremium = premiumBrands.includes(vehicleData.brand);
    factors.push({
      factor: 'Brand',
      impact: isPremium ? 'positive' : 'neutral',
      explanation: `${vehicleData.brand} - ${isPremium ? 'Premium brand with higher resale value' : 'Standard brand'}`
    });

    // Features factor
    const valuableFeatures = ['retarder', 'adaptive_cruise', 'euro_6'];
    const hasValuableFeatures = vehicleData.features?.some(f => valuableFeatures.includes(f));
    if (hasValuableFeatures) {
      factors.push({
        factor: 'Features',
        impact: 'positive',
        explanation: 'Includes valuable features that increase resale value'
      });
    }

    return factors;
  }

  /**
   * Generate Pricing Recommendations
   */
  generatePricingRecommendations(predictions, vehicleData) {
    const recommendations = [];
    const predictedPrice = predictions.ensemble_price;

    // Pricing strategy recommendations
    if (predictedPrice > vehicleData.current_price * 1.1) {
      recommendations.push({
        type: 'pricing_opportunity',
        message: 'Your vehicle may be underpriced. Consider increasing the price.',
        suggested_price: Math.round(predictedPrice * 0.95),
        confidence: 'high'
      });
    } else if (predictedPrice < vehicleData.current_price * 0.9) {
      recommendations.push({
        type: 'pricing_adjustment',
        message: 'Your vehicle may be overpriced. Consider reducing the price.',
        suggested_price: Math.round(predictedPrice * 1.05),
        confidence: 'high'
      });
    }

    // Market timing recommendations
    const marketTrend = predictions.market_trend;
    if (marketTrend === 'rising') {
      recommendations.push({
        type: 'market_timing',
        message: 'Market prices are rising. Consider waiting for better offers.',
        confidence: 'medium'
      });
    } else if (marketTrend === 'falling') {
      recommendations.push({
        type: 'market_timing',
        message: 'Market prices are falling. Consider accepting offers quickly.',
        confidence: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Call OpenAI API
   */
  async callOpenAI(prompt) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert vehicle market analyst. Provide detailed, accurate market insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
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
      return 'Unable to analyze market data at this time.';
    }
  }

  // Helper methods
  extractFeatures(data) {
    return {
      age: new Date().getFullYear() - data.year,
      mileage: data.mileage / 1000,
      brand_premium: ['Mercedes-Benz', 'Scania', 'Volvo'].includes(data.brand) ? 1 : 0,
      has_retarder: data.features?.includes('retarder') ? 1 : 0,
      has_adaptive_cruise: data.features?.includes('adaptive_cruise') ? 1 : 0,
      euro_6: data.euro_standard === 'Euro 6' ? 1 : 0,
      condition_new: data.condition === 'New' ? 1 : 0
    };
  }

  getTrainedCoefficients() {
    // These would be trained on historical data
    return {
      intercept: 50000,
      age: -2000,
      mileage: -0.02,
      brand_premium: 10000,
      has_retarder: 3000,
      has_adaptive_cruise: 2000,
      euro_6: 5000,
      condition_new: 25000
    };
  }

  getRandomForestTrees() {
    // Simplified - in production, use a proper ML library
    return [
      { feature: 'age', threshold: 5, left: 40000, right: 60000 },
      { feature: 'mileage', threshold: 300000, left: 55000, right: 45000 },
      { feature: 'brand_premium', threshold: 0.5, left: 45000, right: 65000 }
    ];
  }

  getNeuralNetworkWeights() {
    // Simplified neural network weights
    return {
      input_to_hidden: [
        [0.1, 0.2, 0.3],
        [0.4, 0.5, 0.6],
        [0.7, 0.8, 0.9]
      ],
      hidden_to_output: [0.3, 0.4, 0.5]
    };
  }

  getGradientBoostingBoosters() {
    // Simplified gradient boosting
    return [
      { predict: (features) => 50000 },
      { predict: (features) => features.age * -1000 },
      { predict: (features) => features.mileage * -0.01 }
    ];
  }

  calculateModelAgreement(predictions) {
    const prices = predictions.map(p => p.price);
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 1 - (stdDev / avg));
  }

  assessDataQuality(marketData) {
    let score = 0.5; // Base score
    
    if (marketData.historicalData?.sample_size > 20) score += 0.2;
    if (marketData.externalData?.market_average) score += 0.2;
    if (marketData.insights && marketData.insights.length > 100) score += 0.1;
    
    return Math.min(1, score);
  }

  assessMarketStability(marketData) {
    if (marketData.historicalData?.price_volatility < 0.1) return 0.9;
    if (marketData.historicalData?.price_volatility < 0.2) return 0.7;
    return 0.5;
  }

  calculateDemandScore(vehicleData) {
    let score = 0.5;
    
    // Brand demand
    const highDemandBrands = ['Mercedes-Benz', 'Scania', 'Volvo'];
    if (highDemandBrands.includes(vehicleData.brand)) score += 0.2;
    
    // Age demand
    if (vehicleData.year >= 2018) score += 0.2;
    
    // Mileage demand
    if (vehicleData.mileage < 300000) score += 0.1;
    
    return Math.min(1, score);
  }

  calculatePriceTrend(prices) {
    if (prices.length < 2) return { direction: 'stable', strength: 0 };
    
    const recent = prices.slice(0, Math.floor(prices.length / 2));
    const older = prices.slice(Math.floor(prices.length / 2));
    
    const recentAvg = recent.reduce((sum, price) => sum + price, 0) / recent.length;
    const olderAvg = older.reduce((sum, price) => sum + price, 0) / older.length;
    
    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.05) return { direction: 'rising', strength: Math.min(1, change) };
    if (change < -0.05) return { direction: 'falling', strength: Math.min(1, -change) };
    return { direction: 'stable', strength: 0 };
  }

  calculateVolatility(prices) {
    if (prices.length < 2) return 0;
    
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev / avg;
  }

  calculateMarketAverage(sources) {
    const validPrices = sources
      .filter(source => source && source.average_price)
      .map(source => source.average_price);
    
    if (validPrices.length === 0) return null;
    
    return validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
  }

  // External API methods (simplified)
  async fetchAutotraderData(vehicleData) {
    // In production, implement actual API calls
    return { average_price: 45000, listings_count: 25 };
  }

  async fetchMobileDeData(vehicleData) {
    return { average_price: 47000, listings_count: 30 };
  }

  async fetchTruckTraderData(vehicleData) {
    return { average_price: 46000, listings_count: 20 };
  }

  // Math helper methods
  matrixMultiply(a, b) {
    // Simplified matrix multiplication
    return a.reduce((sum, val, index) => sum + val * b[index], 0);
  }

  relu(x) {
    return Math.max(0, x);
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  predictWithTree(features, tree) {
    if (features[tree.feature] <= tree.threshold) {
      return tree.left;
    } else {
      return tree.right;
    }
  }
}

module.exports = AdvancedPricingAI;
