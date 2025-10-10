# 🧪 AI Features Testing Guide

## Quick Start Testing

Your server is running on **http://localhost:5001**

---

## 1. Test Phase 1: Basic AI Recommendations

### Test 1.1: Get Recommendations for a Truck
```bash
curl -s 'http://localhost:5001/api/trucks?limit=1' | python3 -m json.tool
# Get the first truck's ID, then:

curl -s 'http://localhost:5001/api/ai/recommendations/1?limit=5' | python3 -m json.tool
```

### Test 1.2: Get Trending Vehicles
```bash
curl -s 'http://localhost:5001/api/ai/trending?limit=10' | python3 -m json.tool
```

### Test 1.3: Price Estimation
```bash
curl -X POST 'http://localhost:5001/api/ai/price-estimate' \
  -H 'Content-Type: application/json' \
  -d '{
    "category": "semi-trailer-trucks",
    "brand": "Mercedes-Benz",
    "year": 2020,
    "mileage": 350000,
    "price": 45000,
    "euro_standard": "Euro 6",
    "condition": "Used",
    "retarder": true,
    "cruise_control": "Adaptive"
  }' | python3 -m json.tool
```

### Test 1.4: Match Score Calculation
```bash
curl -X POST 'http://localhost:5001/api/ai/match-score' \
  -H 'Content-Type: application/json' \
  -d '{
    "vehicle": {
      "brand": "Mercedes-Benz",
      "euro_standard": "Euro 6",
      "transmission": "Automatic",
      "price": 45000,
      "year": 2020,
      "mileage": 350000
    },
    "preferences": {
      "brand": "Mercedes-Benz",
      "euro_standard": "Euro 6",
      "transmission": "Automatic",
      "maxPrice": 50000,
      "minYear": 2018,
      "maxMileage": 400000
    }
  }' | python3 -m json.tool
```

### Test 1.5: Natural Language Smart Search
```bash
curl -X POST 'http://localhost:5001/api/ai/smart-search' \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "I need a Mercedes Actros Euro 6 with low mileage from 2020"
  }' | python3 -m json.tool
```

---

## 2. Test Phase 2: Search History & Favorites

**Note:** These require authentication. First, login to get a token:

```bash
# Login (use credentials from demo-registration.sh or register a new user)
TOKEN=$(curl -s -X POST 'http://localhost:5001/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Token: $TOKEN"
```

### Test 2.1: Record Search History
```bash
curl -X POST 'http://localhost:5001/api/search-history' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "search_query": "Mercedes Euro 6",
    "filters": {
      "brand": "Mercedes-Benz",
      "euro_standard": "Euro 6"
    },
    "results_count": 15,
    "clicked_truck_id": 1
  }' | python3 -m json.tool
```

### Test 2.2: Get Search History
```bash
curl -s 'http://localhost:5001/api/search-history?limit=20' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Test 2.3: Get Popular Searches
```bash
curl -s 'http://localhost:5001/api/search-history/popular?limit=10' | python3 -m json.tool
```

### Test 2.4: Create Saved Search
```bash
curl -X POST 'http://localhost:5001/api/saved-searches' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Dream Trucks",
    "search_query": "Mercedes Euro 6",
    "filters": {
      "brand": "Mercedes-Benz",
      "euro_standard": "Euro 6",
      "maxPrice": 50000
    },
    "notification_enabled": true
  }' | python3 -m json.tool
```

### Test 2.5: Get Saved Searches
```bash
curl -s 'http://localhost:5001/api/saved-searches' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Test 2.6: Add to Favorites
```bash
curl -X POST 'http://localhost:5001/api/favorites' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "truck_id": 1,
    "notes": "Great price, good condition!"
  }' | python3 -m json.tool
```

### Test 2.7: Get Favorites
```bash
curl -s 'http://localhost:5001/api/favorites' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Test 2.8: Check Favorite Status
```bash
curl -s 'http://localhost:5001/api/favorites/1/status' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Test 2.9: Get Personalized Recommendations
```bash
curl -s 'http://localhost:5001/api/ai/personalized?limit=10' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## 3. Test Phase 3: Chatbot Assistant

### Test 3.1: Greeting
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello, I need help finding a truck"
  }' | python3 -m json.tool
```

### Test 3.2: Search Vehicles
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Show me Mercedes trucks with Euro 6"
  }' | python3 -m json.tool
```

### Test 3.3: Price Inquiry
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "I have a budget of 50000 euros"
  }' | python3 -m json.tool
```

### Test 3.4: Get Recommendations
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "What do you recommend for long-haul transport?"
  }' | python3 -m json.tool
```

### Test 3.5: Compare Vehicles
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Compare Mercedes and Scania trucks"
  }' | python3 -m json.tool
```

### Test 3.6: Market Information
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "What are the current market trends?"
  }' | python3 -m json.tool
```

### Test 3.7: Help
```bash
curl -X POST 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "What can you help me with?"
  }' | python3 -m json.tool
```

---

## 4. Test Phase 4: Price Analytics & Forecasting

### Test 4.1: Create Price Alert
```bash
curl -X POST 'http://localhost:5001/api/price-alerts' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "truck_id": 1,
    "threshold_percent": 5
  }' | python3 -m json.tool
```

### Test 4.2: Get Price Alerts
```bash
curl -s 'http://localhost:5001/api/price-alerts' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

### Test 4.3: Get Price History
```bash
curl -s 'http://localhost:5001/api/trucks/1/price-history' | python3 -m json.tool
```

### Test 4.4: Get Market Insights
```bash
# All vehicles
curl -s 'http://localhost:5001/api/ai/market-insights' | python3 -m json.tool

# By category
curl -s 'http://localhost:5001/api/ai/market-insights?category=semi-trailer-trucks' | python3 -m json.tool

# By brand
curl -s 'http://localhost:5001/api/ai/market-insights?brand=Mercedes-Benz' | python3 -m json.tool

# By category and brand
curl -s 'http://localhost:5001/api/ai/market-insights?category=semi-trailer-trucks&brand=Scania' | python3 -m json.tool
```

### Test 4.5: Get Price Trends
```bash
# Last 30 days
curl -s 'http://localhost:5001/api/ai/price-trends?days=30' | python3 -m json.tool

# Last 7 days for a category
curl -s 'http://localhost:5001/api/ai/price-trends?category=semi-trailer-trucks&days=7' | python3 -m json.tool
```

### Test 4.6: Best Time to Buy Prediction
```bash
curl -X POST 'http://localhost:5001/api/ai/best-time-to-buy' \
  -H 'Content-Type: application/json' \
  -d '{
    "category": "semi-trailer-trucks",
    "brand": "Mercedes-Benz"
  }' | python3 -m json.tool
```

---

## 5. Interactive Testing with Browser

### Option A: Using Browser DevTools

1. Open **http://localhost:3000** (if client is running)
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Run these JavaScript commands:

```javascript
// Test AI Recommendations
fetch('http://localhost:5001/api/ai/recommendations/1?limit=5')
  .then(r => r.json())
  .then(console.log);

// Test Trending
fetch('http://localhost:5001/api/ai/trending?limit=10')
  .then(r => r.json())
  .then(console.log);

// Test Smart Search
fetch('http://localhost:5001/api/ai/smart-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Mercedes Euro 6 low mileage' })
})
  .then(r => r.json())
  .then(console.log);

// Test Chatbot
fetch('http://localhost:5001/api/chatbot', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Show me trucks under 50000 euros' })
})
  .then(r => r.json())
  .then(console.log);

// Test Market Insights
fetch('http://localhost:5001/api/ai/market-insights')
  .then(r => r.json())
  .then(console.log);

// Test Price Trends
fetch('http://localhost:5001/api/ai/price-trends?days=30')
  .then(r => r.json())
  .then(console.log);
```

### Option B: Using Postman or Insomnia

Import this collection:

1. Create new request collection named "TruckMarket AI"
2. Add all the curl commands above as separate requests
3. For authenticated requests, add Authorization header: `Bearer YOUR_TOKEN`

---

## 6. Test Terms & Conditions Page

If you've integrated the route in App.js:

```
http://localhost:3000/terms-conditions
```

Or create a simple test file:

```bash
# Create test HTML
cat > /tmp/test-terms.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <title>Terms Test</title>
</head>
<body>
  <a href="http://localhost:3000/terms-conditions" target="_blank">Open Terms & Conditions</a>
</body>
</html>
EOF

open /tmp/test-terms.html
```

---

## 7. Automated Test Script

Run all tests at once:

```bash
# Make the script executable
chmod +x test-ai-features.sh

# Run all tests
./test-ai-features.sh
```

---

## Expected Results

### ✅ Successful Tests Should Show:

1. **Recommendations**: List of similar vehicles with similarity scores
2. **Trending**: Popular vehicles sorted by views
3. **Price Estimate**: Price range with confidence level
4. **Match Score**: 0-100 score with match level
5. **Smart Search**: Parsed filters from natural language
6. **Chatbot**: Contextual responses with suggestions
7. **Market Insights**: Statistics like avg price, median, trends
8. **Price Trends**: Daily data with trend direction
9. **Best Time to Buy**: Recommendation with confidence

### ❌ Common Issues:

1. **401 Unauthorized**: Get new token with login endpoint
2. **404 Not Found**: Check server is running on port 5001
3. **500 Server Error**: Check server logs for details
4. **Empty Results**: Database might need more data

---

## 8. Check Server Logs

Monitor server activity while testing:

```bash
# In a separate terminal, watch the logs
tail -f server/logs/api.log  # if logging is enabled

# Or just monitor the server console output
```

---

## 9. Database Inspection

Check the new tables and data:

```bash
sqlite3 server/database.sqlite

# List all tables
.tables

# Check search history
SELECT * FROM search_history LIMIT 5;

# Check saved searches
SELECT * FROM saved_searches LIMIT 5;

# Check favorites
SELECT * FROM user_favorites LIMIT 5;

# Check price alerts
SELECT * FROM price_alerts LIMIT 5;

# Exit
.quit
```

---

## 🎯 Quick Test Checklist

- [ ] AI Recommendations working
- [ ] Trending vehicles loading
- [ ] Price estimation accurate
- [ ] Match scoring functional
- [ ] Smart search parsing queries
- [ ] Search history recording
- [ ] Saved searches created
- [ ] Favorites added/removed
- [ ] Personalized recommendations
- [ ] Chatbot responding
- [ ] Price alerts created
- [ ] Market insights calculated
- [ ] Price trends showing
- [ ] Best time to buy predictions
- [ ] Terms & Conditions page loading

---

Happy Testing! 🚀

For issues or questions, check the implementation files:
- `server/ai/recommendations.js`
- `server/ai/searchFeatures.js`
- `server/ai/priceAnalytics.js`
- `server/ai/chatbot.js`
