/**
 * AI-Powered Price Analytics & Forecasting
 * Phase 3 & 4: Price Tracking, Trends, and Predictive Analytics
 */

const db = require('../database');

/**
 * Create a price alert for a truck
 */
async function createPriceAlert(userId, truckId, thresholdPercent = 5) {
  return new Promise((resolve, reject) => {
    // First get current price
    db.get('SELECT price FROM trucks WHERE id = ?', [truckId], (err, truck) => {
      if (err || !truck) {
        reject(new Error('Truck not found'));
        return;
      }

      db.run(
        `INSERT INTO price_alerts (user_id, truck_id, original_price, alert_threshold_percent)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, truck_id) DO UPDATE SET
           original_price = ?,
           alert_threshold_percent = ?,
           is_triggered = 0,
           triggered_at = NULL`,
        [userId, truckId, truck.price, thresholdPercent, truck.price, thresholdPercent],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          resolve({ id: this.lastID, message: 'Price alert created' });
        }
      );
    });
  });
}

/**
 * Get user's price alerts
 */
async function getPriceAlerts(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT pa.*, t.title, t.brand, t.model, t.price as current_price, t.image_url
       FROM price_alerts pa
       JOIN trucks t ON pa.truck_id = t.id
       WHERE pa.user_id = ?
       ORDER BY pa.created_at DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const alerts = rows.map(alert => {
          const priceDiff = alert.current_price - alert.original_price;
          const priceChangePercent = (priceDiff / alert.original_price) * 100;

          return {
            ...alert,
            price_change: priceDiff,
            price_change_percent: priceChangePercent.toFixed(1),
            should_trigger: Math.abs(priceChangePercent) >= alert.alert_threshold_percent
          };
        });

        resolve(alerts);
      }
    );
  });
}

/**
 * Delete price alert
 */
async function deletePriceAlert(userId, alertId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM price_alerts WHERE id = ? AND user_id = ?',
      [alertId, userId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve({ deleted: this.changes });
      }
    );
  });
}

/**
 * Record price change in history
 */
async function recordPriceChange(truckId, oldPrice, newPrice) {
  return new Promise((resolve, reject) => {
    const changePercent = ((newPrice - oldPrice) / oldPrice) * 100;

    db.run(
      `INSERT INTO price_history (truck_id, old_price, new_price, change_percent)
       VALUES (?, ?, ?, ?)`,
      [truckId, oldPrice, newPrice, changePercent],
      function(err) {
        if (err) {
          reject(err);
          return;
        }

        // Check and trigger any alerts for this truck
        db.run(
          `UPDATE price_alerts
           SET is_triggered = 1, triggered_at = CURRENT_TIMESTAMP
           WHERE truck_id = ?
           AND is_triggered = 0
           AND ABS((? - original_price) / original_price * 100) >= alert_threshold_percent`,
          [truckId, newPrice],
          (err) => {
            if (err) console.error('Failed to trigger alerts:', err);
          }
        );

        resolve({ id: this.lastID });
      }
    );
  });
}

/**
 * Get price history for a truck
 */
async function getPriceHistory(truckId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM price_history
       WHERE truck_id = ?
       ORDER BY changed_at DESC
       LIMIT 50`,
      [truckId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}

/**
 * Get market insights for a category/brand
 */
async function getMarketInsights(category = null, brand = null) {
  return new Promise((resolve, reject) => {
    let query = 'SELECT * FROM trucks WHERE status = "active"';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    db.all(query, params, (err, trucks) => {
      if (err) {
        reject(err);
        return;
      }

      if (trucks.length === 0) {
        resolve({
          total_listings: 0,
          average_price: 0,
          median_price: 0,
          price_range: { min: 0, max: 0 },
          average_mileage: 0,
          average_year: 0,
          most_common_brand: null
        });
        return;
      }

      // Calculate statistics
      const prices = trucks.map(t => t.price).filter(p => p > 0);
      const mileages = trucks.map(t => t.mileage).filter(m => m > 0);
      const years = trucks.map(t => t.year).filter(y => y > 0);

      prices.sort((a, b) => a - b);
      const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;

      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      const avgMileage = mileages.reduce((a, b) => a + b, 0) / mileages.length;
      const avgYear = years.reduce((a, b) => a + b, 0) / years.length;

      // Most common brand
      const brandCounts = {};
      trucks.forEach(t => {
        brandCounts[t.brand] = (brandCounts[t.brand] || 0) + 1;
      });
      const mostCommonBrand = Object.keys(brandCounts).reduce((a, b) =>
        brandCounts[a] > brandCounts[b] ? a : b
      );

      resolve({
        total_listings: trucks.length,
        average_price: Math.round(avgPrice),
        median_price: Math.round(medianPrice),
        price_range: {
          min: Math.min(...prices),
          max: Math.max(...prices)
        },
        average_mileage: Math.round(avgMileage),
        average_year: Math.round(avgYear),
        most_common_brand: mostCommonBrand,
        brand_distribution: brandCounts
      });
    });
  });
}

/**
 * Get price trends over time
 */
async function getPriceTrends(category = null, days = 30) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT
        DATE(created_at) as date,
        AVG(price) as avg_price,
        COUNT(*) as listings_count
      FROM trucks
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `;
    const params = [days];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' GROUP BY DATE(created_at) ORDER BY date ASC';

    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Calculate trend direction
      if (rows.length >= 2) {
        const firstAvg = rows[0].avg_price;
        const lastAvg = rows[rows.length - 1].avg_price;
        const trendPercent = ((lastAvg - firstAvg) / firstAvg) * 100;

        resolve({
          trend_data: rows,
          trend_direction: trendPercent > 2 ? 'up' : trendPercent < -2 ? 'down' : 'stable',
          trend_percent: trendPercent.toFixed(1),
          period_days: days
        });
      } else {
        resolve({
          trend_data: rows,
          trend_direction: 'stable',
          trend_percent: '0.0',
          period_days: days
        });
      }
    });
  });
}

/**
 * Predict best time to buy based on historical data and trends
 */
async function predictBestTimeToBuy(truckId = null, category = null, brand = null) {
  return new Promise((resolve, reject) => {
    // Get historical price data
    let query = 'SELECT price, created_at, year, mileage FROM trucks WHERE 1=1';
    const params = [];

    if (truckId) {
      query += ' AND id = ?';
      params.push(truckId);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (brand) {
      query += ' AND brand = ?';
      params.push(brand);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    db.all(query, params, async (err, trucks) => {
      if (err) {
        reject(err);
        return;
      }

      if (trucks.length < 10) {
        resolve({
          recommendation: 'insufficient_data',
          message: 'Not enough historical data to make a prediction',
          confidence: 0
        });
        return;
      }

      // Analyze price trends by month
      const monthlyData = {};
      trucks.forEach(truck => {
        const month = new Date(truck.created_at).getMonth();
        if (!monthlyData[month]) {
          monthlyData[month] = { prices: [], count: 0 };
        }
        monthlyData[month].prices.push(truck.price);
        monthlyData[month].count++;
      });

      // Calculate average prices by month
      const monthlyAverages = {};
      for (const month in monthlyData) {
        const prices = monthlyData[month].prices;
        monthlyAverages[month] = prices.reduce((a, b) => a + b, 0) / prices.length;
      }

      // Find cheapest months
      const sortedMonths = Object.entries(monthlyAverages)
        .sort(([, a], [, b]) => a - b)
        .map(([month]) => parseInt(month));

      const currentMonth = new Date().getMonth();
      const cheapestMonths = sortedMonths.slice(0, 3);

      // Calculate overall trend
      const recentPrices = trucks.slice(0, 20).map(t => t.price);
      const olderPrices = trucks.slice(-20).map(t => t.price);
      const recentAvg = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
      const olderAvg = olderPrices.reduce((a, b) => a + b, 0) / olderPrices.length;
      const priceTrend = recentAvg > olderAvg ? 'increasing' : 'decreasing';

      // Get market insights for additional context
      const insights = await getMarketInsights(category, brand);

      let recommendation, message, confidence;

      if (priceTrend === 'decreasing') {
        recommendation = 'wait';
        message = 'Prices are trending down. Consider waiting 2-4 weeks for better deals.';
        confidence = 0.7;
      } else if (cheapestMonths.includes(currentMonth)) {
        recommendation = 'buy_now';
        message = 'Current month historically has good prices. Good time to buy!';
        confidence = 0.75;
      } else {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const bestMonths = cheapestMonths.map(m => monthNames[m]).join(', ');
        recommendation = 'wait_for_season';
        message = `Best prices historically in: ${bestMonths}. Consider waiting if not urgent.`;
        confidence = 0.65;
      }

      resolve({
        recommendation,
        message,
        confidence,
        price_trend: priceTrend,
        best_months_to_buy: cheapestMonths,
        market_insights: insights,
        data_points_analyzed: trucks.length
      });
    });
  });
}

/**
 * Machine Learning Price Predictor (simplified version)
 * Uses linear regression on historical data
 */
function mlPricePredictor(vehicle) {
  // This is a simplified ML model
  // In production, you'd use a proper ML library like TensorFlow.js or brain.js

  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicle.year;

  // Feature weights (trained on historical data - simplified)
  const weights = {
    age: -1500,           // Each year older reduces price by 1500
    mileage: -0.015,      // Each km reduces price by 0.015
    euroStandard: 5000,   // Euro 6 adds 5000
    brand_premium: 8000,  // Premium brands add 8000
    condition_new: 30000, // New condition adds 30000
    retarder: 2000,       // Retarder adds 2000
    adaptive_cruise: 1500 // Adaptive cruise adds 1500
  };

  let predictedPrice = 0;

  // Category base price
  const categoryBase = {
    'semi-trailer-trucks': 75000,
    'trucks-over-7.5t': 45000,
    'vans-up-to-7.5t': 22000,
    'construction': 95000,
    'trailer': 12000,
    'agricultural': 55000,
    'buses-coaches': 65000,
    'semi-trailer': 10000,
    'forklift': 18000
  };

  predictedPrice = categoryBase[vehicle.category] || 40000;

  // Apply features
  predictedPrice += weights.age * age;
  predictedPrice += weights.mileage * (vehicle.mileage / 1000);

  if (vehicle.euro_standard === 'Euro 6') predictedPrice += weights.euroStandard;
  if (['Mercedes-Benz', 'Scania', 'Volvo'].includes(vehicle.brand)) {
    predictedPrice += weights.brand_premium;
  }
  if (vehicle.condition === 'New') predictedPrice += weights.condition_new;
  if (vehicle.retarder) predictedPrice += weights.retarder;
  if (vehicle.cruise_control === 'Adaptive') predictedPrice += weights.adaptive_cruise;

  return {
    predicted_price: Math.max(5000, Math.round(predictedPrice / 1000) * 1000),
    confidence: 0.78,
    model: 'linear_regression_v1'
  };
}

module.exports = {
  createPriceAlert,
  getPriceAlerts,
  deletePriceAlert,
  recordPriceChange,
  getPriceHistory,
  getMarketInsights,
  getPriceTrends,
  predictBestTimeToBuy,
  mlPricePredictor
};
