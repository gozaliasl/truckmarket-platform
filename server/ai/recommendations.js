/**
 * AI-Powered Recommendation Engine
 * Suggests vehicles based on user search behavior and preferences
 */

const db = require('../database');

/**
 * Calculate similarity score between two vehicles
 */
function calculateSimilarity(vehicle1, vehicle2) {
  let score = 0;

  // Brand match (20 points)
  if (vehicle1.brand === vehicle2.brand) score += 20;

  // Category match (15 points)
  if (vehicle1.category === vehicle2.category) score += 15;

  // Year proximity (15 points)
  const yearDiff = Math.abs(vehicle1.year - vehicle2.year);
  score += Math.max(0, 15 - (yearDiff * 3));

  // Power proximity (15 points)
  if (vehicle1.engine_power && vehicle2.engine_power) {
    const powerDiff = Math.abs(vehicle1.engine_power - vehicle2.engine_power);
    score += Math.max(0, 15 - (powerDiff / 20));
  }

  // Price range (15 points)
  const priceDiff = Math.abs(vehicle1.price - vehicle2.price) / vehicle1.price;
  score += Math.max(0, 15 - (priceDiff * 30));

  // Transmission match (10 points)
  if (vehicle1.transmission === vehicle2.transmission) score += 10;

  // Axle configuration match (10 points)
  if (vehicle1.axle_configuration === vehicle2.axle_configuration) score += 10;

  return Math.round(score);
}

/**
 * Get recommendations based on a specific vehicle
 */
async function getRecommendations(truckId, limit = 6) {
  return new Promise((resolve, reject) => {
    // First get the reference truck
    db.get('SELECT * FROM trucks WHERE id = ?', [truckId], (err, referenceTruck) => {
      if (err) {
        reject(err);
        return;
      }

      if (!referenceTruck) {
        resolve([]);
        return;
      }

      // Get all trucks in same category (excluding the reference truck)
      const query = `
        SELECT * FROM trucks
        WHERE category = ? AND id != ? AND status = 'active'
        LIMIT 50
      `;

      db.all(query, [referenceTruck.category, truckId], (err, trucks) => {
        if (err) {
          reject(err);
          return;
        }

        // Calculate similarity scores
        const scored = trucks.map(truck => ({
          ...truck,
          similarity_score: calculateSimilarity(referenceTruck, truck),
          recommendation_reason: generateRecommendationReason(referenceTruck, truck)
        }));

        // Sort by similarity score
        scored.sort((a, b) => b.similarity_score - a.similarity_score);

        // Return top matches
        resolve(scored.slice(0, limit));
      });
    });
  });
}

/**
 * Generate human-readable recommendation reason
 */
function generateRecommendationReason(reference, recommended) {
  const reasons = [];

  if (reference.brand === recommended.brand) {
    reasons.push(`Same brand (${reference.brand})`);
  }

  if (Math.abs(reference.year - recommended.year) <= 2) {
    reasons.push('Similar age');
  }

  if (reference.transmission === recommended.transmission) {
    reasons.push(`${reference.transmission} transmission`);
  }

  const priceDiff = ((recommended.price - reference.price) / reference.price) * 100;
  if (priceDiff < -10) {
    reasons.push(`€${Math.abs(Math.round(recommended.price - reference.price)).toLocaleString()} cheaper`);
  } else if (priceDiff > 10) {
    reasons.push('Premium option');
  } else {
    reasons.push('Similar price');
  }

  if (reference.engine_power && recommended.engine_power) {
    const powerDiff = recommended.engine_power - reference.engine_power;
    if (Math.abs(powerDiff) <= 50) {
      reasons.push('Similar power');
    } else if (powerDiff > 50) {
      reasons.push(`+${powerDiff}HP more powerful`);
    }
  }

  return reasons.slice(0, 3).join(' • ');
}

/**
 * Get trending vehicles (most viewed recently)
 */
async function getTrending(category = null, limit = 10) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT *, views as popularity_score
      FROM trucks
      WHERE status = 'active'
    `;

    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY views DESC, created_at DESC LIMIT ?';
    params.push(limit);

    db.all(query, params, (err, trucks) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(trucks.map(truck => ({
        ...truck,
        trending_badge: truck.views > 50 ? 'hot' : truck.views > 20 ? 'trending' : 'new'
      })));
    });
  });
}

/**
 * AI Price Estimation
 * Calculates fair market value based on specifications
 */
function estimatePrice(vehicle) {
  let basePrice = 0;

  // Base price by category and year
  const age = new Date().getFullYear() - vehicle.year;
  const categoryBasePrices = {
    'semi-trailer-trucks': 80000,
    'trucks-over-7.5t': 50000,
    'vans-up-to-7.5t': 25000,
    'construction': 100000,
    'trailer': 15000,
    'agricultural': 60000,
    'buses-coaches': 70000,
    'semi-trailer': 12000,
    'forklift': 20000
  };

  basePrice = categoryBasePrices[vehicle.category] || 40000;

  // Age depreciation (10% per year)
  basePrice *= Math.pow(0.9, age);

  // Mileage factor
  if (vehicle.mileage) {
    const mileageFactor = 1 - (vehicle.mileage / 2000000); // Depreciate based on mileage
    basePrice *= Math.max(0.3, mileageFactor);
  }

  // Brand premium
  const premiumBrands = ['Mercedes-Benz', 'Scania', 'Volvo'];
  if (premiumBrands.includes(vehicle.brand)) {
    basePrice *= 1.15;
  }

  // Specifications boost
  if (vehicle.euro_standard === 'Euro 6') basePrice *= 1.1;
  if (vehicle.retarder) basePrice *= 1.05;
  if (vehicle.cruise_control === 'Adaptive') basePrice *= 1.03;
  if (vehicle.air_conditioning === 'Automatic') basePrice *= 1.02;

  // Condition factor
  if (vehicle.condition === 'New') basePrice *= 1.5;
  if (vehicle.accident_free) basePrice *= 1.05;
  if (vehicle.service_history === 'Full') basePrice *= 1.08;

  const estimate = Math.round(basePrice / 1000) * 1000; // Round to nearest 1000

  return {
    estimated_price: estimate,
    price_range_min: Math.round(estimate * 0.9),
    price_range_max: Math.round(estimate * 1.1),
    confidence: 0.85
  };
}

/**
 * Calculate match score for user preferences
 */
function calculateMatchScore(vehicle, preferences) {
  let score = 0;
  let maxScore = 0;

  // Each criterion has a weight
  const criteria = [
    { key: 'brand', weight: 15 },
    { key: 'euro_standard', weight: 12 },
    { key: 'transmission', weight: 10 },
    { key: 'axle_configuration', weight: 10 },
    { key: 'cab_type', weight: 8 },
    { key: 'retarder', weight: 5 },
    { key: 'cruise_control', weight: 5 },
    { key: 'air_conditioning', weight: 5 }
  ];

  criteria.forEach(criterion => {
    if (preferences[criterion.key]) {
      maxScore += criterion.weight;
      if (vehicle[criterion.key] === preferences[criterion.key]) {
        score += criterion.weight;
      }
    }
  });

  // Price match (20 points)
  if (preferences.maxPrice) {
    maxScore += 20;
    if (vehicle.price <= preferences.maxPrice) {
      score += 20;
    } else {
      // Partial points if close
      const overBudget = (vehicle.price - preferences.maxPrice) / preferences.maxPrice;
      if (overBudget < 0.1) score += 15;
    }
  }

  // Year match (10 points)
  if (preferences.minYear) {
    maxScore += 10;
    if (vehicle.year >= preferences.minYear) {
      score += 10;
    }
  }

  // Mileage match (10 points)
  if (preferences.maxMileage) {
    maxScore += 10;
    if (vehicle.mileage <= preferences.maxMileage) {
      score += 10;
    }
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
}

/**
 * Smart search with natural language
 */
function parseNaturalLanguageQuery(query) {
  const parsed = {
    brand: null,
    model: null,
    yearFrom: null,
    euroStandard: null,
    maxMileage: null,
    transmission: null,
    features: []
  };

  const queryLower = query.toLowerCase();

  // Extract brand
  const brands = ['mercedes', 'benz', 'man', 'scania', 'volvo', 'daf', 'renault', 'iveco'];
  brands.forEach(brand => {
    if (queryLower.includes(brand)) {
      if (brand === 'mercedes' || brand === 'benz') {
        parsed.brand = 'Mercedes-Benz';
      } else {
        parsed.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      }
    }
  });

  // Extract Euro standard
  const euroMatch = queryLower.match(/euro\s*([3-6])/i);
  if (euroMatch) {
    parsed.euroStandard = `Euro ${euroMatch[1]}`;
  }

  // Extract year
  const yearMatch = queryLower.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    parsed.yearFrom = parseInt(yearMatch[1]);
  }

  // Extract mileage
  const mileageMatch = queryLower.match(/(\d+)\s*k\s*km/i);
  if (mileageMatch) {
    parsed.maxMileage = parseInt(mileageMatch[1]) * 1000;
  }

  // Extract transmission
  if (queryLower.includes('automatic') || queryLower.includes('auto')) {
    parsed.transmission = 'Automatic';
  }
  if (queryLower.includes('manual')) {
    parsed.transmission = 'Manual';
  }

  // Extract features
  if (queryLower.includes('retarder')) parsed.features.push('retarder');
  if (queryLower.includes('sleeper')) parsed.features.push('sleeper_cab');
  if (queryLower.includes('low mileage') || queryLower.includes('low km')) {
    parsed.maxMileage = 300000;
  }

  return parsed;
}

module.exports = {
  getRecommendations,
  getTrending,
  estimatePrice,
  calculateMatchScore,
  calculateSimilarity,
  parseNaturalLanguageQuery
};
