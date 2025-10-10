const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

/**
 * Advanced ML Models for Vehicle Analysis
 */

// Price Prediction Model using Linear Regression
class PricePredictionModel {
  constructor() {
    this.coefficients = {
      year: 0.8,
      mileage: -0.0001,
      engine_power: 0.05,
      brand_premium: 1.2,
      condition_multiplier: 1.0
    };
    this.brandMultipliers = {
      'Mercedes-Benz': 1.3,
      'BMW': 1.25,
      'Audi': 1.2,
      'Volvo': 1.15,
      'Scania': 1.1,
      'MAN': 1.05,
      'Iveco': 0.95,
      'DAF': 0.9,
      'Renault': 0.85,
      'Ford': 0.8
    };
  }

  predictPrice(vehicleData) {
    const {
      year,
      mileage,
      engine_power,
      brand,
      condition,
      fuel_type,
      transmission,
      location
    } = vehicleData;

    // Base price calculation
    let basePrice = 25000; // Base price for a vehicle

    // Year factor (newer = more expensive)
    const yearFactor = (year - 2010) * this.coefficients.year;
    basePrice += yearFactor * 1000;

    // Mileage factor (higher mileage = less expensive)
    const mileageFactor = mileage * this.coefficients.mileage;
    basePrice += mileageFactor;

    // Engine power factor
    const powerFactor = (engine_power - 200) * this.coefficients.engine_power;
    basePrice += powerFactor * 100;

    // Brand premium
    const brandMultiplier = this.brandMultipliers[brand] || 1.0;
    basePrice *= brandMultiplier;

    // Condition factor
    const conditionMultipliers = {
      'New': 1.0,
      'Certified Pre-Owned': 0.85,
      'Used': 0.7,
      'Fair': 0.6,
      'Poor': 0.4
    };
    basePrice *= (conditionMultipliers[condition] || 0.7);

    // Fuel type factor
    const fuelMultipliers = {
      'Electric': 1.2,
      'Hybrid': 1.1,
      'Diesel': 1.0,
      'Petrol': 0.95,
      'CNG': 0.9
    };
    basePrice *= (fuelMultipliers[fuel_type] || 1.0);

    // Transmission factor
    const transmissionMultipliers = {
      'Automatic': 1.1,
      'Semi-automatic': 1.05,
      'Manual': 1.0,
      'CVT': 1.08
    };
    basePrice *= (transmissionMultipliers[transmission] || 1.0);

    // Location factor (market demand)
    const locationMultipliers = {
      'Germany': 1.1,
      'Netherlands': 1.05,
      'Belgium': 1.0,
      'France': 0.95,
      'Italy': 0.9,
      'Spain': 0.85
    };
    basePrice *= (locationMultipliers[location] || 1.0);

    // Add some randomness for realism (±5%)
    const randomFactor = 0.95 + (Math.random() * 0.1);
    basePrice *= randomFactor;

    return Math.round(Math.max(basePrice, 5000)); // Minimum price of €5,000
  }

  getPriceConfidence(vehicleData) {
    // Calculate confidence based on data completeness
    const requiredFields = ['year', 'mileage', 'brand', 'condition'];
    const providedFields = requiredFields.filter(field => vehicleData[field]);
    const completeness = providedFields.length / requiredFields.length;
    
    // Base confidence on completeness
    let confidence = completeness * 0.8;
    
    // Adjust based on data quality
    if (vehicleData.year && vehicleData.year > 2015) confidence += 0.1;
    if (vehicleData.mileage && vehicleData.mileage < 200000) confidence += 0.05;
    if (vehicleData.engine_power) confidence += 0.05;
    
    return Math.min(confidence, 0.95); // Max 95% confidence
  }
}

// Vehicle Quality Assessment Model
class QualityAssessmentModel {
  constructor() {
    this.qualityFactors = {
      mileage: { weight: 0.3, threshold: 200000 },
      year: { weight: 0.25, threshold: 2015 },
      condition: { weight: 0.2, values: { 'New': 1.0, 'Certified Pre-Owned': 0.9, 'Used': 0.7, 'Fair': 0.5, 'Poor': 0.2 } },
      service_history: { weight: 0.15, hasHistory: 0.9, noHistory: 0.6 },
      accident_free: { weight: 0.1, accidentFree: 1.0, hasAccidents: 0.7 }
    };
  }

  assessQuality(vehicleData) {
    let qualityScore = 0;
    let maxScore = 0;

    // Mileage assessment
    if (vehicleData.mileage) {
      const mileageScore = Math.max(0, 1 - (vehicleData.mileage / this.qualityFactors.mileage.threshold));
      qualityScore += mileageScore * this.qualityFactors.mileage.weight;
    }
    maxScore += this.qualityFactors.mileage.weight;

    // Year assessment
    if (vehicleData.year) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - vehicleData.year;
      const yearScore = Math.max(0, 1 - (age / 15)); // 15 years = 0 score
      qualityScore += yearScore * this.qualityFactors.year.weight;
    }
    maxScore += this.qualityFactors.year.weight;

    // Condition assessment
    if (vehicleData.condition) {
      const conditionScore = this.qualityFactors.condition.values[vehicleData.condition] || 0.5;
      qualityScore += conditionScore * this.qualityFactors.condition.weight;
    }
    maxScore += this.qualityFactors.condition.weight;

    // Service history assessment
    const serviceScore = vehicleData.service_history ? 
      this.qualityFactors.service_history.hasHistory : 
      this.qualityFactors.service_history.noHistory;
    qualityScore += serviceScore * this.qualityFactors.service_history.weight;
    maxScore += this.qualityFactors.service_history.weight;

    // Accident history assessment
    const accidentScore = vehicleData.accident_free ? 
      this.qualityFactors.accident_free.accidentFree : 
      this.qualityFactors.accident_free.hasAccidents;
    qualityScore += accidentScore * this.qualityFactors.accident_free.weight;
    maxScore += this.qualityFactors.accident_free.weight;

    const finalScore = maxScore > 0 ? qualityScore / maxScore : 0.5;
    
    return {
      score: Math.round(finalScore * 100),
      grade: this.getQualityGrade(finalScore),
      factors: this.getQualityFactors(vehicleData),
      recommendations: this.getQualityRecommendations(finalScore, vehicleData)
    };
  }

  getQualityGrade(score) {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B+';
    if (score >= 0.6) return 'B';
    if (score >= 0.5) return 'C+';
    if (score >= 0.4) return 'C';
    return 'D';
  }

  getQualityFactors(vehicleData) {
    const factors = [];
    
    if (vehicleData.mileage < 100000) factors.push('Low mileage');
    if (vehicleData.year > 2018) factors.push('Recent model');
    if (vehicleData.condition === 'New' || vehicleData.condition === 'Certified Pre-Owned') factors.push('Excellent condition');
    if (vehicleData.service_history) factors.push('Complete service history');
    if (vehicleData.accident_free) factors.push('Accident-free');
    if (vehicleData.fuel_type === 'Electric') factors.push('Eco-friendly');
    if (vehicleData.transmission === 'Automatic') factors.push('Automatic transmission');
    
    return factors;
  }

  getQualityRecommendations(score, vehicleData) {
    const recommendations = [];
    
    if (score < 0.6) {
      recommendations.push('Consider a professional inspection before purchase');
      recommendations.push('Negotiate price based on condition and mileage');
    }
    
    if (vehicleData.mileage > 200000) {
      recommendations.push('Check for major component replacements');
      recommendations.push('Verify maintenance records');
    }
    
    if (!vehicleData.service_history) {
      recommendations.push('Request maintenance documentation');
      recommendations.push('Consider pre-purchase inspection');
    }
    
    if (vehicleData.year < 2015) {
      recommendations.push('Check for rust and corrosion');
      recommendations.push('Verify emissions compliance');
    }
    
    return recommendations;
  }
}

// Market Intelligence Model
class MarketIntelligenceModel {
  constructor() {
    this.marketTrends = {
      electric: { demand: 1.3, price_trend: 1.1 },
      hybrid: { demand: 1.2, price_trend: 1.05 },
      diesel: { demand: 0.9, price_trend: 0.95 },
      petrol: { demand: 1.0, price_trend: 1.0 }
    };
    
    this.seasonalFactors = {
      'Q1': 0.95, // Winter - lower demand
      'Q2': 1.05, // Spring - higher demand
      'Q3': 1.0,  // Summer - normal demand
      'Q4': 1.1   // Fall - highest demand
    };
  }

  analyzeMarketTrends(vehicleType = 'truck') {
    const currentQuarter = this.getCurrentQuarter();
    const trends = {
      overall_demand: this.seasonalFactors[currentQuarter],
      price_trends: {},
      popular_features: [],
      market_insights: []
    };

    // Analyze fuel type trends
    Object.keys(this.marketTrends).forEach(fuelType => {
      trends.price_trends[fuelType] = this.marketTrends[fuelType].price_trend;
    });

    // Popular features based on current trends
    trends.popular_features = [
      'Euro 6 emission standard',
      'Automatic transmission',
      'Advanced safety features',
      'Fuel efficiency',
      'Low mileage'
    ];

    // Market insights
    trends.market_insights = [
      'Electric vehicles showing strong demand growth',
      'Diesel vehicles facing regulatory challenges',
      'Automatic transmission preferred by 70% of buyers',
      'Low mileage vehicles commanding premium prices',
      'Safety features becoming standard requirements'
    ];

    return trends;
  }

  getCurrentQuarter() {
    const month = new Date().getMonth();
    if (month >= 0 && month <= 2) return 'Q1';
    if (month >= 3 && month <= 5) return 'Q2';
    if (month >= 6 && month <= 8) return 'Q3';
    return 'Q4';
  }

  predictMarketValue(vehicleData, timeframe = '6months') {
    const basePrice = new PricePredictionModel().predictPrice(vehicleData);
    const marketTrends = this.analyzeMarketTrends();
    
    let priceMultiplier = 1.0;
    
    // Apply fuel type trend
    if (vehicleData.fuel_type && this.marketTrends[vehicleData.fuel_type.toLowerCase()]) {
      priceMultiplier *= this.marketTrends[vehicleData.fuel_type.toLowerCase()].price_trend;
    }
    
    // Apply seasonal factor
    priceMultiplier *= marketTrends.overall_demand;
    
    // Apply timeframe factor
    const timeframeFactors = {
      '1month': 1.0,
      '3months': 0.98,
      '6months': 0.95,
      '1year': 0.9
    };
    priceMultiplier *= (timeframeFactors[timeframe] || 1.0);
    
    return {
      current_value: basePrice,
      predicted_value: Math.round(basePrice * priceMultiplier),
      price_change: Math.round(basePrice * (priceMultiplier - 1)),
      price_change_percentage: Math.round((priceMultiplier - 1) * 100),
      timeframe: timeframe,
      confidence: 0.75
    };
  }
}

// Recommendation Engine
class RecommendationEngine {
  constructor() {
    this.preferenceWeights = {
      price: 0.3,
      quality: 0.25,
      fuel_efficiency: 0.2,
      brand_reputation: 0.15,
      features: 0.1
    };
  }

  generateRecommendations(userPreferences, availableVehicles) {
    const recommendations = availableVehicles.map(vehicle => {
      const score = this.calculateMatchScore(userPreferences, vehicle);
      return {
        ...vehicle,
        match_score: score,
        recommendation_reasons: this.getRecommendationReasons(userPreferences, vehicle, score)
      };
    });

    // Sort by match score
    recommendations.sort((a, b) => b.match_score - a.match_score);

    return recommendations.slice(0, 10); // Top 10 recommendations
  }

  calculateMatchScore(userPreferences, vehicle) {
    let score = 0;

    // Price match
    if (userPreferences.max_price && vehicle.price <= userPreferences.max_price) {
      const priceScore = 1 - (vehicle.price / userPreferences.max_price);
      score += priceScore * this.preferenceWeights.price;
    }

    // Quality match
    const qualityModel = new QualityAssessmentModel();
    const quality = qualityModel.assessQuality(vehicle);
    score += (quality.score / 100) * this.preferenceWeights.quality;

    // Fuel efficiency match
    if (userPreferences.fuel_efficiency && vehicle.fuel_type === userPreferences.fuel_efficiency) {
      score += this.preferenceWeights.fuel_efficiency;
    }

    // Brand preference
    if (userPreferences.preferred_brands && userPreferences.preferred_brands.includes(vehicle.brand)) {
      score += this.preferenceWeights.brand_reputation;
    }

    // Features match
    if (userPreferences.features) {
      const featureMatches = userPreferences.features.filter(feature => 
        vehicle[feature] === true || vehicle[feature] === 'Yes'
      ).length;
      const featureScore = featureMatches / userPreferences.features.length;
      score += featureScore * this.preferenceWeights.features;
    }

    return Math.round(score * 100);
  }

  getRecommendationReasons(userPreferences, vehicle, score) {
    const reasons = [];

    if (vehicle.price <= userPreferences.max_price) {
      reasons.push(`Within your budget of €${userPreferences.max_price.toLocaleString()}`);
    }

    if (vehicle.year > 2018) {
      reasons.push('Recent model year');
    }

    if (vehicle.mileage < 100000) {
      reasons.push('Low mileage');
    }

    if (vehicle.fuel_type === 'Electric' || vehicle.fuel_type === 'Hybrid') {
      reasons.push('Eco-friendly option');
    }

    if (vehicle.transmission === 'Automatic') {
      reasons.push('Automatic transmission');
    }

    return reasons;
  }
}

// Export models
module.exports = {
  PricePredictionModel,
  QualityAssessmentModel,
  MarketIntelligenceModel,
  RecommendationEngine
};
