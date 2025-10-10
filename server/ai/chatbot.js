/**
 * AI Virtual Assistant Chatbot
 * Phase 3: Intelligent conversation for vehicle recommendations
 */

const db = require('../database');
const aiRecommendations = require('./recommendations');
const priceAnalytics = require('./priceAnalytics');

/**
 * Process chatbot message and generate response
 */
async function processMessage(message, context = {}) {
  const messageLower = message.toLowerCase();

  // Intent detection
  const intent = detectIntent(messageLower);

  switch (intent) {
    case 'greeting':
      return handleGreeting();

    case 'search_vehicles':
      return await handleSearchVehicles(messageLower);

    case 'price_inquiry':
      return await handlePriceInquiry(messageLower, context);

    case 'recommendation_request':
      return await handleRecommendationRequest(messageLower, context);

    case 'compare_vehicles':
      return await handleCompareVehicles(messageLower);

    case 'market_info':
      return await handleMarketInfo(messageLower);

    case 'help':
      return handleHelp();

    default:
      return handleDefault(messageLower);
  }
}

/**
 * Detect user intent from message
 */
function detectIntent(message) {
  if (/^(hi|hello|hey|good morning|good afternoon)/i.test(message)) {
    return 'greeting';
  }

  if (/(search|find|looking for|need|want|show me).*truck/i.test(message)) {
    return 'search_vehicles';
  }

  if (/(price|cost|expensive|cheap|budget|afford)/i.test(message)) {
    return 'price_inquiry';
  }

  if (/(recommend|suggest|advice|best|should i|which one)/i.test(message)) {
    return 'recommendation_request';
  }

  if (/(compare|difference|versus|vs|better)/i.test(message)) {
    return 'compare_vehicles';
  }

  if (/(market|trend|demand|popular|selling)/i.test(message)) {
    return 'market_info';
  }

  if (/(help|how|what can you)/i.test(message)) {
    return 'help';
  }

  return 'unknown';
}

/**
 * Handle greeting
 */
function handleGreeting() {
  return {
    message: "Hello! I'm your TruckMarket AI assistant. I can help you find the perfect vehicle, compare prices, and provide market insights. What are you looking for today?",
    intent: 'greeting',
    suggestions: [
      'Show me Mercedes trucks',
      'What are the best deals right now?',
      'I need a truck under €50,000',
      'Tell me about market trends'
    ]
  };
}

/**
 * Handle search vehicles
 */
async function handleSearchVehicles(message) {
  // Parse search query using NLP
  const parsed = aiRecommendations.parseNaturalLanguageQuery(message);

  return new Promise((resolve) => {
    // Build search query
    let query = 'SELECT * FROM trucks WHERE status = "active"';
    const params = [];

    if (parsed.brand) {
      query += ' AND brand = ?';
      params.push(parsed.brand);
    }

    if (parsed.yearFrom) {
      query += ' AND year >= ?';
      params.push(parsed.yearFrom);
    }

    if (parsed.euroStandard) {
      query += ' AND euro_standard = ?';
      params.push(parsed.euroStandard);
    }

    if (parsed.transmission) {
      query += ' AND transmission = ?';
      params.push(parsed.transmission);
    }

    if (parsed.maxMileage) {
      query += ' AND mileage <= ?';
      params.push(parsed.maxMileage);
    }

    query += ' ORDER BY created_at DESC LIMIT 5';

    db.all(query, params, (err, trucks) => {
      if (err) {
        resolve({
          message: "I'm having trouble searching right now. Please try again.",
          intent: 'search_vehicles',
          error: true
        });
        return;
      }

      if (trucks.length === 0) {
        resolve({
          message: "I couldn't find any vehicles matching your criteria. Would you like to broaden your search?",
          intent: 'search_vehicles',
          results: [],
          suggestions: [
            'Show me similar trucks',
            'What about used vehicles?',
            'Increase my budget range'
          ]
        });
        return;
      }

      const resultSummary = trucks.map(t =>
        `${t.brand} ${t.model} (${t.year}) - €${t.price.toLocaleString()}`
      ).join('\n');

      resolve({
        message: `I found ${trucks.length} vehicles that match your search:\n\n${resultSummary}\n\nWould you like more details on any of these?`,
        intent: 'search_vehicles',
        results: trucks,
        parsed_filters: parsed,
        suggestions: [
          'Tell me more about the first one',
          'Show me similar options',
          'Compare these vehicles'
        ]
      });
    });
  });
}

/**
 * Handle price inquiry
 */
async function handlePriceInquiry(message, context) {
  // Extract budget if mentioned
  const budgetMatch = message.match(/(\d+[,.]?\d*)\s*(k|thousand|euro|€)?/i);
  let budget = null;

  if (budgetMatch) {
    budget = parseFloat(budgetMatch[1].replace(',', ''));
    if (budgetMatch[2] && budgetMatch[2].toLowerCase() === 'k') {
      budget *= 1000;
    }
  }

  return new Promise((resolve) => {
    let query = 'SELECT * FROM trucks WHERE status = "active"';
    const params = [];

    if (budget) {
      query += ' AND price <= ?';
      params.push(budget);
    }

    query += ' ORDER BY price ASC LIMIT 5';

    db.all(query, params, (err, trucks) => {
      if (err || trucks.length === 0) {
        resolve({
          message: "I can help you find vehicles within your budget. What's your price range?",
          intent: 'price_inquiry',
          suggestions: [
            'Under €30,000',
            'Between €50,000-€80,000',
            'Show me the cheapest trucks'
          ]
        });
        return;
      }

      const avgPrice = trucks.reduce((sum, t) => sum + t.price, 0) / trucks.length;

      resolve({
        message: budget
          ? `I found ${trucks.length} vehicles under €${budget.toLocaleString()}. Average price: €${Math.round(avgPrice).toLocaleString()}. The best value options are ready for you to explore!`
          : `Our current inventory has prices ranging from €${Math.min(...trucks.map(t => t.price)).toLocaleString()} to €${Math.max(...trucks.map(t => t.price)).toLocaleString()}. What's your budget?`,
        intent: 'price_inquiry',
        results: trucks,
        average_price: Math.round(avgPrice),
        suggestions: [
          'Show me the best deals',
          'Vehicles with price drops',
          'Estimate value of a specific truck'
        ]
      });
    });
  });
}

/**
 * Handle recommendation request
 */
async function handleRecommendationRequest(message, context) {
  return new Promise((resolve) => {
    // Get trending vehicles as recommendations
    db.all(
      `SELECT * FROM trucks
       WHERE status = "active"
       ORDER BY views DESC, created_at DESC
       LIMIT 5`,
      [],
      async (err, trucks) => {
        if (err || trucks.length === 0) {
          resolve({
            message: "I'd love to recommend vehicles! Could you tell me what you're looking for? Brand preference? Budget range? Type of use?",
            intent: 'recommendation_request',
            suggestions: [
              'Long-haul semi-trucks',
              'Construction equipment',
              'Delivery vans under €40k'
            ]
          });
          return;
        }

        const recommendations = trucks.slice(0, 3);
        const summary = recommendations.map(t =>
          `${t.brand} ${t.model} (${t.year}) - €${t.price.toLocaleString()} - ${t.mileage}km`
        ).join('\n');

        resolve({
          message: `Based on what's popular right now, I recommend:\n\n${summary}\n\nThese are highly viewed and well-priced vehicles. Would you like to know more?`,
          intent: 'recommendation_request',
          results: recommendations,
          suggestions: [
            'Why do you recommend these?',
            'Any alternatives?',
            'What about financing options?'
          ]
        });
      }
    );
  });
}

/**
 * Handle compare vehicles
 */
async function handleCompareVehicles(message) {
  // Extract brand names for comparison
  const brands = ['Mercedes-Benz', 'Scania', 'Volvo', 'DAF', 'MAN', 'Renault', 'Iveco'];
  const mentionedBrands = brands.filter(brand =>
    message.toLowerCase().includes(brand.toLowerCase())
  );

  if (mentionedBrands.length < 2) {
    return {
      message: "To compare vehicles, please specify which trucks you'd like to compare. For example: 'Compare Mercedes and Scania trucks' or provide specific truck IDs.",
      intent: 'compare_vehicles',
      suggestions: [
        'Compare Mercedes vs Scania',
        'Compare Volvo vs DAF',
        'Show me brand comparison'
      ]
    };
  }

  return new Promise((resolve) => {
    const comparisons = [];
    let completed = 0;

    mentionedBrands.forEach(brand => {
      db.get(
        `SELECT brand, AVG(price) as avg_price, AVG(mileage) as avg_mileage,
         COUNT(*) as count
         FROM trucks
         WHERE brand = ? AND status = "active"`,
        [brand],
        (err, result) => {
          if (result) comparisons.push(result);
          completed++;

          if (completed === mentionedBrands.length) {
            const summary = comparisons.map(c =>
              `${c.brand}: Avg €${Math.round(c.avg_price).toLocaleString()}, ${Math.round(c.avg_mileage)}km, ${c.count} listings`
            ).join('\n');

            resolve({
              message: `Here's a comparison of ${mentionedBrands.join(' vs ')}:\n\n${summary}\n\nWould you like detailed specifications?`,
              intent: 'compare_vehicles',
              comparison_data: comparisons,
              suggestions: [
                'Show me specific models',
                'Which has better resale value?',
                'Compare fuel efficiency'
              ]
            });
          }
        }
      );
    });
  });
}

/**
 * Handle market info request
 */
async function handleMarketInfo(message) {
  try {
    const insights = await priceAnalytics.getMarketInsights();
    const trends = await priceAnalytics.getPriceTrends(null, 30);

    return {
      message: `Current market overview:\n\n` +
        `📊 Total active listings: ${insights.total_listings}\n` +
        `💰 Average price: €${insights.average_price.toLocaleString()}\n` +
        `📈 Price trend (30 days): ${trends.trend_direction} (${trends.trend_percent}%)\n` +
        `🏆 Most popular brand: ${insights.most_common_brand}\n\n` +
        `The market is ${trends.trend_direction === 'up' ? 'heating up' : trends.trend_direction === 'down' ? 'cooling down' : 'stable'}. ` +
        `${trends.trend_direction === 'down' ? "Good time for buyers!" : trends.trend_direction === 'up' ? "Prices increasing - consider acting soon." : "Stable conditions."}`,
      intent: 'market_info',
      data: {
        insights,
        trends
      },
      suggestions: [
        'Best time to buy?',
        'Show me trending vehicles',
        'Price predictions for next month'
      ]
    };
  } catch (error) {
    return {
      message: "I'm having trouble fetching market data right now. Please try again in a moment.",
      intent: 'market_info',
      error: true
    };
  }
}

/**
 * Handle help request
 */
function handleHelp() {
  return {
    message: "I can assist you with:\n\n" +
      "🔍 Finding vehicles - Just describe what you're looking for\n" +
      "💰 Price information - Ask about budgets and deals\n" +
      "🤝 Recommendations - Get personalized suggestions\n" +
      "📊 Market insights - Learn about trends and prices\n" +
      "⚖️ Comparisons - Compare different brands/models\n\n" +
      "Try asking: 'Show me Mercedes trucks under €60k' or 'What are the market trends?'",
    intent: 'help',
    suggestions: [
      'Find trucks for me',
      'What are my budget options?',
      'Market trends',
      'Compare brands'
    ]
  };
}

/**
 * Handle default/unknown intent
 */
function handleDefault(message) {
  return {
    message: "I'm here to help you find the perfect vehicle! You can ask me to search for trucks, check prices, get recommendations, or learn about market trends. What would you like to know?",
    intent: 'unknown',
    suggestions: [
      'Show me available trucks',
      'What are good deals?',
      'I need buying advice',
      'Market information'
    ]
  };
}

module.exports = {
  processMessage,
  detectIntent
};
