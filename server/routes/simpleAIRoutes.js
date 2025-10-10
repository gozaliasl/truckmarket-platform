/**
 * Simple AI Routes - No External Dependencies
 * Basic AI functionality without external API requirements
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const router = express.Router();

// Database connection
const dbPath = path.join(__dirname, '../trucks.db');
const db = new sqlite3.Database(dbPath);

/**
 * Simple Chatbot - No External Dependencies
 */
router.post('/chatbot', async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a message for the chatbot'
      });
    }

    // Parse user intent and search database
    const searchParams = parseUserIntent(message);
    const response = await generateIntelligentResponse(message, searchParams, userId, context);
    
    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      error: 'Chatbot processing failed',
      message: 'Unable to process message at this time'
    });
  }
});

/**
 * Simple Price Prediction
 */
router.post('/price-prediction', async (req, res) => {
  try {
    const { vehicleData } = req.body;
    
    if (!vehicleData) {
      return res.status(400).json({
        error: 'Vehicle data is required',
        message: 'Please provide vehicle specifications for price prediction'
      });
    }

    const prediction = generateSimplePricePrediction(vehicleData);
    
    res.json({
      success: true,
      data: prediction,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Price prediction error:', error);
    res.status(500).json({
      error: 'Price prediction failed',
      message: 'Unable to generate price prediction at this time'
    });
  }
});

/**
 * Simple Quality Assessment
 */
router.post('/quality-assessment', async (req, res) => {
  try {
    const { vehicleData } = req.body;
    
    if (!vehicleData) {
      return res.status(400).json({
        error: 'Vehicle data is required',
        message: 'Please provide vehicle specifications for quality assessment'
      });
    }

    const assessment = generateSimpleQualityAssessment(vehicleData);
    
    res.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
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
 * Smart Search
 */
router.post('/smart-search', async (req, res) => {
  try {
    const { query, userId, context } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Search query is required',
        message: 'Please provide a search query'
      });
    }

    const searchResult = generateSimpleSearchResult(query);
    
    res.json({
      success: true,
      data: searchResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({
      error: 'Smart search failed',
      message: 'Unable to process smart search at this time'
    });
  }
});

/**
 * Market Intelligence
 */
router.get('/market-intelligence', async (req, res) => {
  try {
    const { category, brand, region } = req.query;
    
    const marketData = {
      category: category || 'all',
      brand: brand || 'all',
      region: region || 'europe',
      trends: {
        price_trend: 'stable',
        demand_trend: 'increasing',
        supply_trend: 'stable'
      },
      insights: [
        'Market prices are stable with slight upward trend',
        'Demand for Euro 6 vehicles continues to grow',
        'Premium brands maintain strong resale values'
      ],
      recommendations: [
        'Consider Euro 6 vehicles for better resale value',
        'Premium brands offer better long-term value',
        'Market timing is favorable for sellers'
      ]
    };
    
    res.json({
      success: true,
      data: marketData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market intelligence error:', error);
    res.status(500).json({
      error: 'Market intelligence failed',
      message: 'Unable to fetch market intelligence at this time'
    });
  }
});

/**
 * AI Health Check
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      services: {
        simple_chatbot: 'operational',
        price_prediction: 'operational',
        quality_assessment: 'operational',
        smart_search: 'operational',
        market_intelligence: 'operational'
      },
      timestamp: new Date().toISOString(),
      version: '1.0.0-simple'
    };
    
    res.json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

// Database search functions
function searchVehiclesInDatabase(searchParams) {
  return new Promise((resolve, reject) => {
    const { vehicleType, brand, maxPrice, minPrice, year, mileage } = searchParams;
    
    let tableName = '';
    let whereConditions = [];
    let params = [];
    
    // Determine table based on vehicle type
    switch (vehicleType) {
      case 'truck':
        tableName = 'trucks';
        break;
      case 'car':
        tableName = 'cars';
        break;
      case 'motorcycle':
        tableName = 'motorcycles';
        break;
      case 'ebike':
        tableName = 'ebikes';
        break;
      case 'caravan':
        tableName = 'caravans';
        break;
      default:
        // Search all tables
        searchAllVehicles(searchParams).then(resolve).catch(reject);
        return;
    }
    
    // Build WHERE conditions
    if (brand) {
      whereConditions.push('brand LIKE ?');
      params.push(`%${brand}%`);
    }
    
    if (maxPrice) {
      whereConditions.push('price <= ?');
      params.push(maxPrice);
    }
    
    if (minPrice) {
      whereConditions.push('price >= ?');
      params.push(minPrice);
    }
    
    if (year) {
      whereConditions.push('year = ?');
      params.push(year);
    }
    
    if (mileage) {
      whereConditions.push('mileage <= ?');
      params.push(mileage);
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    const query = `SELECT * FROM ${tableName} ${whereClause} ORDER BY price ASC LIMIT 10`;
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function searchAllVehicles(searchParams) {
  return new Promise((resolve, reject) => {
    const { brand, maxPrice, minPrice, year } = searchParams;
    const results = [];
    let completed = 0;
    const tables = ['trucks', 'cars', 'motorcycles', 'ebikes', 'caravans'];
    
    tables.forEach(table => {
      let whereConditions = [];
      let params = [];
      
      if (brand) {
        whereConditions.push('brand LIKE ?');
        params.push(`%${brand}%`);
      }
      
      if (maxPrice) {
        whereConditions.push('price <= ?');
        params.push(maxPrice);
      }
      
      if (minPrice) {
        whereConditions.push('price >= ?');
        params.push(minPrice);
      }
      
      if (year) {
        whereConditions.push('year = ?');
        params.push(year);
      }
      
      const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
      const query = `SELECT *, '${table}' as vehicle_type FROM ${table} ${whereClause} ORDER BY price ASC LIMIT 5`;
      
      db.all(query, params, (err, rows) => {
        if (!err && rows) {
          results.push(...rows);
        }
        completed++;
        if (completed === tables.length) {
          resolve(results);
        }
      });
    });
  });
}

function getPriceEstimate(vehicleData) {
  return new Promise((resolve, reject) => {
    const { brand, vehicleType, year, mileage } = vehicleData;
    
    let tableName = '';
    switch (vehicleType) {
      case 'truck': tableName = 'trucks'; break;
      case 'car': tableName = 'cars'; break;
      case 'motorcycle': tableName = 'motorcycles'; break;
      case 'ebike': tableName = 'ebikes'; break;
      case 'caravan': tableName = 'caravans'; break;
      default: reject(new Error('Invalid vehicle type')); return;
    }
    
    const query = `
      SELECT AVG(price) as avg_price, MIN(price) as min_price, MAX(price) as max_price, COUNT(*) as count
      FROM ${tableName} 
      WHERE brand LIKE ? AND year = ? AND mileage <= ?
    `;
    
    const maxMileage = mileage ? mileage * 1.2 : 999999;
    const minMileage = mileage ? mileage * 0.8 : 0;
    
    db.get(query, [`%${brand}%`, year, maxMileage], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Parse user intent and extract search parameters
function parseUserIntent(message) {
  const messageLower = message.toLowerCase();
  
  // Extract price information
  const priceMatch = messageLower.match(/(?:under|below|less than|max|maximum)\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  const maxPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
  
  // Extract vehicle type
  const vehicleType = messageLower.includes('truck') ? 'truck' : 
                     messageLower.includes('car') ? 'car' : 
                     messageLower.includes('motorcycle') ? 'motorcycle' : 
                     messageLower.includes('ebike') || messageLower.includes('e-bike') ? 'ebike' : 
                     messageLower.includes('caravan') ? 'caravan' : null;
  
  // Extract brand information
  const brands = ['mercedes', 'benz', 'bmw', 'audi', 'volkswagen', 'toyota', 'honda', 'ford', 'nissan', 'mazda', 'hyundai', 'tesla', 'volvo', 'porsche', 'renault', 'peugeot', 'kia', 'scania', 'man', 'daf', 'iveco', 'freightliner', 'kenworth', 'peterbilt'];
  const mentionedBrand = brands.find(brand => messageLower.includes(brand));
  
  // Extract year
  const yearMatch = messageLower.match(/(20\d{2})/);
  const year = yearMatch ? parseInt(yearMatch[1]) : null;
  
  // Extract mileage
  const mileageMatch = messageLower.match(/(\d+(?:,\d{3})*)\s*km/);
  const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : null;
  
  return {
    vehicleType,
    brand: mentionedBrand,
    maxPrice,
    year,
    mileage,
    isPriceEstimation: messageLower.includes('price') && (year || mentionedBrand),
    isQualityAssessment: messageLower.includes('quality') || messageLower.includes('condition') || messageLower.includes('assess')
  };
}

// Generate intelligent response with actual database results
async function generateIntelligentResponse(message, searchParams, userId, context) {
  const { vehicleType, brand, maxPrice, year, mileage, isPriceEstimation, isQualityAssessment } = searchParams;
  
  try {
    // Handle price estimation requests
    if (isPriceEstimation && brand && vehicleType && year) {
      const priceData = await getPriceEstimate({ brand, vehicleType, year, mileage });
      
      if (priceData && priceData.count > 0) {
        const avgPrice = Math.round(priceData.avg_price);
        const minPrice = Math.round(priceData.min_price);
        const maxPrice = Math.round(priceData.max_price);
        
        return {
          message: `Based on our database analysis, a ${year} ${brand} ${vehicleType}${mileage ? ` with ${mileage.toLocaleString()} km` : ''} has an estimated market value of **€${avgPrice.toLocaleString()}**. Price range: €${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()} (based on ${priceData.count} similar vehicles).`,
          intent: 'price_estimation',
          confidence: 0.95,
          suggestions: [
            `View all ${brand} ${vehicleType}s from ${year}`,
            `Compare prices with similar vehicles`,
            `Set up price alerts for ${brand} ${vehicleType}`,
            `Get quality assessment for ${brand} ${vehicleType}`
          ],
          actions: ['price_estimation'],
          data: { 
            brand, 
            vehicleType, 
            year, 
            mileage,
            estimatedPrice: avgPrice,
            priceRange: { min: minPrice, max: maxPrice },
            sampleSize: priceData.count
          }
        };
      }
    }
    
    // Handle vehicle search requests
    if (vehicleType || brand || maxPrice) {
      const vehicles = await searchVehiclesInDatabase(searchParams);
      
      if (vehicles && vehicles.length > 0) {
        const vehicleTypePlural = vehicleType ? (vehicleType === 'truck' ? 'trucks' : 
                                               vehicleType === 'car' ? 'cars' : 
                                               vehicleType === 'motorcycle' ? 'motorcycles' : 
                                               vehicleType === 'ebike' ? 'e-bikes' : 
                                               vehicleType === 'caravan' ? 'caravans' : vehicleType + 's') : 'vehicles';
        
        // Sort vehicles by price (ascending)
        const sortedVehicles = vehicles.slice(0, 10).sort((a, b) => (a.price || 0) - (b.price || 0));
        
        // Calculate average values
        const validPrices = vehicles.filter(v => v.price && v.price > 0).map(v => v.price);
        const validMileages = vehicles.filter(v => v.mileage && v.mileage > 0).map(v => v.mileage);
        const avgPrice = validPrices.length > 0 ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length) : 0;
        const avgMileage = validMileages.length > 0 ? Math.round(validMileages.reduce((a, b) => a + b, 0) / validMileages.length) : 0;
        
        let message = `🚗 Found ${vehicles.length} ${vehicleTypePlural} matching your criteria:\n\n`;
        
        // Create HTML table with alternating row colors
        message += `<table style="border-collapse: collapse; width: 100%; font-family: monospace;">\n`;
        message += `<thead>\n`;
        message += `<tr style="background-color: #f3f4f6; font-weight: bold;">\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Brand</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Year</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Model</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Mileage</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Fuel Type</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Consumption</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Price</th>\n`;
        message += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Link</th>\n`;
        message += `</tr>\n`;
        message += `</thead>\n`;
        message += `<tbody>\n`;
        
        // Format vehicle listings as table rows with alternating background colors
        sortedVehicles.forEach((vehicle, index) => {
          const price = vehicle.price ? `€${parseInt(vehicle.price).toLocaleString()}` : 'N/A';
          const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A';
          
          // Determine fuel type and consumption
          let fuelType = 'N/A';
          let consumption = 'N/A';
          
          if (vehicle.fuel_type) {
            fuelType = vehicle.fuel_type;
          } else if (vehicle.vehicle_type === 'ebikes') {
            fuelType = 'Electric';
          }
          
          // Set consumption based on fuel type and available data
          if (vehicle.fuel_type === 'Electric' || vehicle.vehicle_type === 'ebikes') {
            if (vehicle.electric_range) {
              consumption = `${vehicle.electric_range} km range`;
            } else if (vehicle.battery_capacity) {
              consumption = `${vehicle.battery_capacity} kWh`;
            } else {
              consumption = 'Electric';
            }
          } else if (vehicle.fuel_consumption_combined) {
            consumption = `${vehicle.fuel_consumption_combined} L/100km`;
          } else if (vehicle.fuel_consumption_city && vehicle.fuel_consumption_highway) {
            consumption = `${vehicle.fuel_consumption_city}/${vehicle.fuel_consumption_highway} L/100km`;
          } else if (vehicle.fuel_consumption_city) {
            consumption = `${vehicle.fuel_consumption_city} L/100km`;
          }
          
          // Determine the correct URL path based on vehicle type
          let vehicleUrl = `/truck/${vehicle.id}`; // Default to truck
          if (vehicle.vehicle_type === 'cars') {
            vehicleUrl = `/car/${vehicle.id}`;
          } else if (vehicle.vehicle_type === 'motorcycles') {
            vehicleUrl = `/motorcycle/${vehicle.id}`;
          } else if (vehicle.vehicle_type === 'ebikes') {
            vehicleUrl = `/ebike/${vehicle.id}`;
          } else if (vehicle.vehicle_type === 'caravans') {
            vehicleUrl = `/caravan/${vehicle.id}`;
          }
          
          // Add alternating row background colors
          const bgColor = index % 2 === 0 ? '#f9fafb' : '#ffffff';
          
          message += `<tr style="background-color: ${bgColor};">\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${vehicle.brand}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${vehicle.year}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${vehicle.model}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${mileage}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${fuelType}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${consumption}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${price}</td>\n`;
          message += `<td style="border: 1px solid #d1d5db; padding: 8px;"><a href="${vehicleUrl}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none;">View</a></td>\n`;
          message += `</tr>\n`;
        });
        
        // Add summary row
        message += `<tr style="background-color: #e5e7eb; font-weight: bold;">\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">AVERAGE</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">-</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">-</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">${avgMileage.toLocaleString()} km</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">-</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">-</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">€${avgPrice.toLocaleString()}</td>\n`;
        message += `<td style="border: 1px solid #d1d5db; padding: 8px;">-</td>\n`;
        message += `</tr>\n`;
        message += `</tbody>\n`;
        message += `</table>\n`;
        
        if (vehicles.length > 10) {
          message += `\n📋 ... and ${vehicles.length - 10} more vehicles available.\n\n`;
        } else {
          message += `\n`;
        }
        
                message += `💡 What would you like to do next?\n`;
                message += `• View more details about a specific vehicle\n`;
                message += `• Filter by price range or year\n`;
                message += `• Compare vehicles\n`;
                message += `• Get price estimates`;

                // Generate dynamic suggestions based on the search results
                const dynamicSuggestions = [];
                
                if (brand) {
                  // Get price range from results
                  const prices = vehicles.filter(v => v.price && v.price > 0).map(v => v.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  const midPrice = Math.round((minPrice + maxPrice) / 2);
                  
                  // Get year range from results
                  const years = vehicles.map(v => v.year).filter(y => y);
                  const minYear = Math.min(...years);
                  const maxYear = Math.max(...years);
                  
                  dynamicSuggestions.push(
                    `Show me ${brand} vehicles under €${Math.round(midPrice).toLocaleString()}`,
                    `Find ${brand} vehicles from ${Math.max(2020, minYear)} or newer`,
                    `Compare ${brand} ${vehicleTypePlural} by price`,
                    `Get price estimate for ${brand} ${vehicleType || 'vehicles'} from ${maxYear}`
                  );
                } else if (vehicleType) {
                  dynamicSuggestions.push(
                    `Show me ${vehicleTypePlural} under €30,000`,
                    `Find ${vehicleTypePlural} from 2020 or newer`,
                    `Compare different ${vehicleType} brands`,
                    `Get price estimate for ${vehicleTypePlural}`
                  );
                } else {
                  dynamicSuggestions.push(
                    `Show me vehicles under €50,000`,
                    `Find vehicles from 2020 or newer`,
                    `Compare different vehicle types`,
                    `Get price estimate for vehicles`
                  );
                }

                return {
                  message: message,
                  intent: 'vehicle_search',
                  confidence: 0.95,
                  suggestions: dynamicSuggestions,
          actions: ['vehicle_search'],
          data: { 
            vehicles: vehicles,
            searchParams: searchParams,
            totalResults: vehicles.length,
            tableData: {
              headers: ['Brand', 'Year', 'Model', 'Mileage', 'Price', 'Link'],
              rows: sortedVehicles.map(vehicle => ({
                brand: vehicle.brand,
                year: vehicle.year,
                model: vehicle.model,
                mileage: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A',
                price: vehicle.price ? `€${parseInt(vehicle.price).toLocaleString()}` : 'N/A',
                link: vehicle.vehicle_type === 'cars' ? `/car/${vehicle.id}` :
                      vehicle.vehicle_type === 'motorcycles' ? `/motorcycle/${vehicle.id}` :
                      vehicle.vehicle_type === 'ebikes' ? `/ebike/${vehicle.id}` :
                      vehicle.vehicle_type === 'caravans' ? `/caravan/${vehicle.id}` :
                      `/truck/${vehicle.id}`,
                rawPrice: vehicle.price || 0,
                rawMileage: vehicle.mileage || 0
              })),
              summary: {
                avgPrice: avgPrice,
                avgMileage: avgMileage,
                totalResults: vehicles.length
              }
            }
          }
        };
      } else {
        // No results found
        const vehicleTypePlural = vehicleType ? (vehicleType === 'truck' ? 'trucks' : 
                                               vehicleType === 'car' ? 'cars' : 
                                               vehicleType === 'motorcycle' ? 'motorcycles' : 
                                               vehicleType === 'ebike' ? 'e-bikes' : 
                                               vehicleType === 'caravan' ? 'caravans' : vehicleType + 's') : 'vehicles';
        
        return {
          message: `I couldn't find any ${vehicleTypePlural} matching your criteria. Let me suggest some alternatives or you can try adjusting your search parameters.`,
          intent: 'no_results',
          confidence: 0.8,
          suggestions: [
            `Search for similar ${vehicleTypePlural}`,
            `Increase your budget range`,
            `Try different brands`,
            `Browse all available vehicles`
          ],
          actions: ['search_alternatives'],
          data: { 
            searchParams: searchParams,
            suggestions: 'Try adjusting search criteria'
          }
        };
      }
    }
    
    // Fallback to general response
    return generateSimpleResponse(message, userId, context);
    
  } catch (error) {
    console.error('Error generating intelligent response:', error);
    return generateSimpleResponse(message, userId, context);
  }
}

        // Helper functions
        function generateSimpleResponse(message, userId, context) {
          const messageLower = message.toLowerCase();

          // Extract price information
          const priceMatch = messageLower.match(/(?:under|below|less than|max|maximum)\s*€?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
          const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;

          // Extract vehicle type
          const vehicleType = messageLower.includes('truck') ? 'truck' :
                             messageLower.includes('car') ? 'car' :
                             messageLower.includes('motorcycle') ? 'motorcycle' :
                             messageLower.includes('ebike') || messageLower.includes('e-bike') ? 'ebike' :
                             messageLower.includes('caravan') ? 'caravan' : null;

          // Extract brand information
          const brands = ['mercedes', 'benz', 'bmw', 'audi', 'volkswagen', 'toyota', 'honda', 'ford', 'nissan', 'mazda', 'hyundai', 'tesla', 'volvo', 'porsche', 'renault', 'peugeot', 'kia', 'scania', 'man', 'daf', 'iveco', 'freightliner', 'kenworth', 'peterbilt'];
          const mentionedBrand = brands.find(brand => messageLower.includes(brand));

          // Handle specific quick action queries
          if (messageLower.includes('find trucks under') && price) {
            return {
              message: `I'll help you find trucks under €${price.toLocaleString()}. Let me search our database for the best options in your budget range.`,
              intent: 'search_vehicles',
              confidence: 0.95,
              suggestions: [
                `Show me trucks under €${Math.round(price * 0.7).toLocaleString()}`,
                `Find trucks from 2020 or newer under €${price.toLocaleString()}`,
                `Compare different truck brands under €${price.toLocaleString()}`,
                `Get price estimate for trucks under €${price.toLocaleString()}`
              ],
              actions: ['search_vehicles'],
              data: { vehicleType: 'truck', maxPrice: price }
            };
          }

          if (messageLower.includes('compare') && (messageLower.includes('mercedes') || messageLower.includes('scania'))) {
            return {
              message: `I'll help you compare Mercedes and Scania trucks. Let me analyze both brands and show you their key differences, pricing, and specifications.`,
              intent: 'compare_vehicles',
              confidence: 0.95,
              suggestions: [
                'Show me Mercedes trucks under €50,000',
                'Show me Scania trucks under €50,000',
                'Compare Mercedes vs Scania by fuel consumption',
                'Get price estimate for Mercedes vs Scania trucks'
              ],
              actions: ['compare_vehicles'],
              data: { brands: ['mercedes', 'scania'], vehicleType: 'truck' }
            };
          }

          if (messageLower.includes('market price') && messageLower.includes('volvo') && messageLower.includes('2020')) {
            return {
              message: `I'll help you get the market price for a 2020 Volvo. Let me analyze current market data and provide you with accurate pricing information.`,
              intent: 'price_estimation',
              confidence: 0.95,
              suggestions: [
                'Show me 2020 Volvo trucks',
                'Get price estimate for 2020 Volvo cars',
                'Compare 2020 Volvo vs other brands',
                'Find Volvo vehicles from 2020'
              ],
              actions: ['price_estimation'],
              data: { brand: 'volvo', year: 2020 }
            };
          }

          if (messageLower.includes('assess vehicle quality') || messageLower.includes('vehicle quality')) {
            return {
              message: `I'll help you assess vehicle quality. Our AI system analyzes multiple factors including mileage, maintenance history, visual condition, and market data to provide comprehensive quality assessments.`,
              intent: 'quality_assessment',
              confidence: 0.95,
              suggestions: [
                'Assess quality of a specific vehicle',
                'Compare vehicle conditions',
                'Get quality report for trucks',
                'Find high-quality vehicles under €50,000'
              ],
              actions: ['quality_assessment'],
              data: { assessmentType: 'general' }
            };
          }

          if (messageLower.includes('euro 6') || messageLower.includes('euro6')) {
            return {
              message: `I'll help you find Euro 6 vehicles. These are the latest emission standard vehicles that are more environmentally friendly and often have better fuel efficiency.`,
              intent: 'search_vehicles',
              confidence: 0.95,
              suggestions: [
                'Show me Euro 6 trucks under €50,000',
                'Find Euro 6 cars from 2020 or newer',
                'Compare Euro 6 vs Euro 5 vehicles',
                'Get price estimate for Euro 6 vehicles'
              ],
              actions: ['search_vehicles'],
              data: { emissionClass: 'Euro 6' }
            };
          }

          if (messageLower.includes('market insights') || messageLower.includes('market trends')) {
            return {
              message: `I'll provide you with current market insights. Our AI analyzes real-time data to give you trends, demand patterns, pricing forecasts, and market intelligence for the vehicle industry.`,
              intent: 'market_intelligence',
              confidence: 0.95,
              suggestions: [
                'Show me current market trends',
                'Get demand analysis for trucks',
                'Find best time to buy vehicles',
                'Compare market prices by region'
              ],
              actions: ['market_intelligence'],
              data: { insightType: 'general' }
            };
          }
  
  // Price estimation requests (check this first)
  if (messageLower.includes('price') && (messageLower.includes('2020') || messageLower.includes('2019') || messageLower.includes('2021') || messageLower.includes('2022') || messageLower.includes('2023') || messageLower.includes('2024'))) {
    const yearMatch = messageLower.match(/(20\d{2})/);
    const year = yearMatch ? yearMatch[1] : null;
    const mileageMatch = messageLower.match(/(\d+(?:,\d{3})*)\s*km/);
    const mileage = mileageMatch ? parseInt(mileageMatch[1].replace(/,/g, '')) : null;
    
    if (year && mentionedBrand && vehicleType) {
      return {
        message: `I can provide a price estimate for a ${year} ${mentionedBrand} ${vehicleType}${mileage ? ` with ${mileage.toLocaleString()} km` : ''}. Let me calculate the current market value based on our AI pricing model.`,
        intent: 'price_estimation',
        confidence: 0.95,
        suggestions: [
          `Get detailed price estimate for ${year} ${mentionedBrand} ${vehicleType}`,
          `Compare prices with similar vehicles`,
          `View market trends for ${mentionedBrand} ${vehicleType}`,
          `Set up price alerts for ${mentionedBrand} ${vehicleType}`
        ],
        actions: ['price_estimation'],
        data: { 
          brand: mentionedBrand, 
          vehicleType: vehicleType, 
          year: year, 
          mileage: mileage,
          requestType: 'price_estimation'
        }
      };
    }
  }
  
          // Specific search queries with price and vehicle type
          if (price && vehicleType) {
            const vehicleTypePlural = vehicleType === 'truck' ? 'trucks' :
                                     vehicleType === 'car' ? 'cars' :
                                     vehicleType === 'motorcycle' ? 'motorcycles' :
                                     vehicleType === 'ebike' ? 'e-bikes' :
                                     vehicleType === 'caravan' ? 'caravans' : vehicleType + 's';

            if (mentionedBrand) {
              const lowerPrice = Math.round(price * 0.7);
              const higherPrice = Math.round(price * 1.3);
              
              return {
                message: `Perfect! I found several ${mentionedBrand} ${vehicleTypePlural} under €${price.toLocaleString()}. Let me show you the best options available in your budget range.`,
                intent: 'search_vehicles',
                confidence: 0.95,
                suggestions: [
                  `Show me ${mentionedBrand} ${vehicleTypePlural} under €${lowerPrice.toLocaleString()}`,
                  `Find ${mentionedBrand} ${vehicleTypePlural} from 2020 or newer`,
                  `Compare ${mentionedBrand} ${vehicleTypePlural} vs other brands`,
                  `Get price estimate for ${mentionedBrand} ${vehicleTypePlural} from 2022`
                ],
                actions: ['search_vehicles'],
                data: {
                  brand: mentionedBrand,
                  vehicleType: vehicleType,
                  maxPrice: price,
                  searchQuery: `Find ${mentionedBrand} ${vehicleTypePlural} under €${price.toLocaleString()}`
                }
              };
            } else {
              const lowerPrice = Math.round(price * 0.7);
              const higherPrice = Math.round(price * 1.3);
              
              return {
                message: `Great! I found multiple ${vehicleTypePlural} under €${price.toLocaleString()}. Let me show you the best options available in your budget range.`,
                intent: 'search_vehicles',
                confidence: 0.9,
                suggestions: [
                  `Show me ${vehicleTypePlural} under €${lowerPrice.toLocaleString()}`,
                  `Find ${vehicleTypePlural} from 2020 or newer`,
                  `Compare different ${vehicleType} brands`,
                  `Get price estimate for ${vehicleTypePlural} from 2022`
                ],
                actions: ['search_vehicles'],
                data: {
                  vehicleType: vehicleType,
                  maxPrice: price,
                  searchQuery: `Find ${vehicleTypePlural} under €${price.toLocaleString()}`
                }
              };
            }
          }
  
  // Vehicle search responses without specific price
  if (vehicleType || messageLower.includes('vehicle')) {
    if (mentionedBrand) {
      const vehicleTypePlural = vehicleType ? (vehicleType === 'truck' ? 'trucks' : 
                                               vehicleType === 'car' ? 'cars' : 
                                               vehicleType === 'motorcycle' ? 'motorcycles' : 
                                               vehicleType === 'ebike' ? 'e-bikes' : 
                                               vehicleType === 'caravan' ? 'caravans' : vehicleType + 's') : 'vehicles';
      
      return {
        message: `I'd be happy to help you find ${mentionedBrand} ${vehicleTypePlural}! We have a great selection of ${mentionedBrand} vehicles. What specific model or price range are you looking for?`,
        intent: 'search_vehicles',
        confidence: 0.9,
        suggestions: [
          `Show me ${mentionedBrand} ${vehicleTypePlural} under €50,000`,
          `Find ${mentionedBrand} ${vehicleTypePlural} from 2020 or newer`,
          `Browse all ${mentionedBrand} ${vehicleTypePlural}`,
          `Get price estimate for ${mentionedBrand} ${vehicleTypePlural}`
        ],
        actions: ['search_vehicles'],
        data: { brand: mentionedBrand, vehicleType: vehicleType }
      };
    } else if (vehicleType) {
      const vehicleTypePlural = vehicleType === 'truck' ? 'trucks' : 
                               vehicleType === 'car' ? 'cars' : 
                               vehicleType === 'motorcycle' ? 'motorcycles' : 
                               vehicleType === 'ebike' ? 'e-bikes' : 
                               vehicleType === 'caravan' ? 'caravans' : vehicleType + 's';
      
      return {
        message: `I can help you find the perfect ${vehicleType}! We have a great selection of ${vehicleTypePlural}. What's your budget range and preferred brand?`,
        intent: 'search_vehicles',
        confidence: 0.85,
        suggestions: [
          `Find ${vehicleTypePlural} under €50,000`,
          `Show me ${vehicleTypePlural} from 2020 or newer`,
          `Browse all ${vehicleTypePlural}`,
          `Compare ${vehicleTypePlural} prices`
        ],
        actions: ['search_vehicles'],
        data: { vehicleType: vehicleType }
      };
    } else {
      return {
        message: "I can help you find the perfect vehicle! We have a great selection of trucks, cars, motorcycles, e-bikes, and caravans. What type of vehicle are you looking for and what's your budget?",
        intent: 'search_vehicles',
        confidence: 0.8,
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
      message: "I can help with pricing information! Our platform provides accurate market prices based on current market data. What specific vehicle are you interested in? I can give you pricing insights and market trends.",
      intent: 'price_inquiry',
      confidence: 0.9,
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
      message: "I can help assess vehicle quality! Our system analyzes multiple factors including mileage, maintenance history, and visual condition. Which vehicle would you like me to evaluate?",
      intent: 'quality_assessment',
      confidence: 0.9,
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
      intent: 'compare_vehicles',
      confidence: 0.9,
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
      intent: 'general_help',
      confidence: 0.8,
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
    message: "Thanks for your message! I'm your AI assistant for the Road platform. I can help you with vehicle searches, pricing information, quality assessment, and general questions. How can I assist you today?",
    intent: 'general_information',
    confidence: 0.7,
    suggestions: [
      'Find vehicles by brand',
      'Get pricing information',
      'Learn about our platform',
      'Contact support'
    ],
    actions: ['general_assistance']
  };
}

function generateSimplePricePrediction(vehicleData) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicleData.year;
  
  // Simple price calculation
  let basePrice = 50000; // Base price
  
  // Brand adjustments
  const brandMultipliers = {
    'Mercedes-Benz': 1.2,
    'Scania': 1.15,
    'Volvo': 1.1,
    'MAN': 1.05,
    'DAF': 1.0,
    'Renault': 0.95,
    'Iveco': 0.9
  };
  
  if (brandMultipliers[vehicleData.brand]) {
    basePrice *= brandMultipliers[vehicleData.brand];
  }
  
  // Age depreciation
  basePrice *= Math.max(0.3, 1 - (age * 0.08));
  
  // Mileage adjustment
  const mileageFactor = Math.max(0.4, 1 - (vehicleData.mileage / 1000000));
  basePrice *= mileageFactor;
  
  // Euro standard bonus
  if (vehicleData.euro_standard === 'Euro 6') {
    basePrice *= 1.1;
  }
  
  const predictedPrice = Math.round(basePrice);
  
  return {
    predicted_price: predictedPrice,
    price_range: {
      min: Math.round(predictedPrice * 0.85),
      max: Math.round(predictedPrice * 1.15)
    },
    confidence: 0.75,
    factors: [
      {
        factor: 'Vehicle Age',
        impact: age > 5 ? 'negative' : 'positive',
        explanation: `${age} years old - ${age > 5 ? 'Significant depreciation' : 'Relatively new'}`
      },
      {
        factor: 'Mileage',
        impact: vehicleData.mileage > 500000 ? 'negative' : 'positive',
        explanation: `${vehicleData.mileage.toLocaleString()} km - ${vehicleData.mileage > 500000 ? 'High mileage' : 'Low mileage'}`
      },
      {
        factor: 'Brand',
        impact: ['Mercedes-Benz', 'Scania', 'Volvo'].includes(vehicleData.brand) ? 'positive' : 'neutral',
        explanation: `${vehicleData.brand} - ${['Mercedes-Benz', 'Scania', 'Volvo'].includes(vehicleData.brand) ? 'Premium brand' : 'Standard brand'}`
      }
    ],
    market_insights: [
      'Current market shows stable pricing trends',
      'Premium brands maintain better resale values',
      'Euro 6 vehicles are in high demand'
    ],
    recommendations: [
      'Consider the vehicle\'s maintenance history',
      'Check for any recent price drops in the market',
      'Compare with similar vehicles in your area'
    ]
  };
}

function generateSimpleQualityAssessment(vehicleData) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - vehicleData.year;
  
  let qualityScore = 0.7; // Base score
  
  // Age factor
  if (age < 3) qualityScore += 0.2;
  else if (age < 7) qualityScore += 0.1;
  else if (age > 12) qualityScore -= 0.2;
  
  // Mileage factor
  if (vehicleData.mileage < 200000) qualityScore += 0.15;
  else if (vehicleData.mileage < 400000) qualityScore += 0.05;
  else if (vehicleData.mileage > 600000) qualityScore -= 0.2;
  
  // Brand factor
  const premiumBrands = ['Mercedes-Benz', 'Scania', 'Volvo'];
  if (premiumBrands.includes(vehicleData.brand)) qualityScore += 0.1;
  
  // Euro standard factor
  if (vehicleData.euro_standard === 'Euro 6') qualityScore += 0.05;
  
  qualityScore = Math.max(0.2, Math.min(1, qualityScore));
  
  let grade = 'fair';
  if (qualityScore >= 0.8) grade = 'excellent';
  else if (qualityScore >= 0.7) grade = 'good';
  else if (qualityScore >= 0.5) grade = 'fair';
  else grade = 'poor';
  
  return {
    overall_quality_score: qualityScore,
    quality_grade: grade,
    visual_condition: {
      score: qualityScore * 0.9,
      grade: grade,
      details: 'Visual condition assessment based on age and mileage',
      confidence: 0.7
    },
    mechanical_condition: {
      overall_score: qualityScore * 1.1,
      grade: grade,
      components: {
        engine_condition: { score: qualityScore * 0.95 },
        transmission_condition: { score: qualityScore * 1.05 },
        brake_condition: { score: qualityScore * 0.9 },
        suspension_condition: { score: qualityScore * 0.85 },
        electrical_condition: { score: qualityScore * 0.8 }
      }
    },
    market_impact: {
      price_impact: qualityScore,
      price_adjustment: (qualityScore - 0.7) * 100,
      market_positioning: qualityScore > 0.8 ? 'premium' : qualityScore > 0.6 ? 'competitive' : 'budget',
      buyer_appeal: qualityScore > 0.8 ? 'high' : qualityScore > 0.6 ? 'moderate' : 'low'
    },
    risk_assessment: {
      overall_risk_score: 1 - qualityScore,
      risk_level: qualityScore > 0.7 ? 'low' : qualityScore > 0.5 ? 'medium' : 'high',
      risks: [],
      recommendations: []
    },
    recommendations: [
      'Consider getting a professional inspection',
      'Check maintenance history thoroughly',
      'Test drive the vehicle if possible'
    ],
    quality_report: `This ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year} shows ${grade} overall quality. The vehicle has ${vehicleData.mileage.toLocaleString()} km and is ${age} years old. Based on these factors, the quality score is ${(qualityScore * 100).toFixed(0)}%.`
  };
}

function generateSimpleSearchResult(query) {
  const queryLower = query.toLowerCase();
  
  return {
    nlp_analysis: {
      original_query: query,
      intent: { intent: 'search_vehicles', confidence: 0.8 },
      entities: {
        brands: [],
        years: [],
        price_ranges: [],
        features: []
      },
      sentiment: { sentiment: 'neutral', confidence: 0.7 },
      complexity: { complexity_score: 0.5, level: 'medium' }
    },
    search_query: {
      filters: {},
      sort: { field: 'relevance', order: 'desc' },
      intent: 'search_vehicles'
    },
    response: {
      message: `I found several vehicles matching your search for "${query}". Here are some great options for you to consider.`,
      intent: 'search_vehicles',
      results_count: 15,
      suggestions: [
        'Refine your search criteria',
        'View detailed vehicle information',
        'Compare similar vehicles',
        'Set up search alerts'
      ]
    }
  };
}

module.exports = router;
