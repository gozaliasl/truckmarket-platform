# 🚀 Quick Testing Guide - AI Features

## ✅ Server is Running!

Your server is now running on **http://localhost:5001** with all AI features enabled.

---

## 🎯 Quick Tests (Copy & Paste)

### 1. Test AI Chatbot 💬
```bash
curl -s 'http://localhost:5001/api/chatbot' \
  -H 'Content-Type: application/json' \
  -d '{"message": "Show me trucks under 50000 euros"}' | python3 -m json.tool
```

### 2. Test Market Insights 📊
```bash
curl -s 'http://localhost:5001/api/ai/market-insights' | python3 -m json.tool
```

### 3. Test Smart Search 🔍
```bash
curl -s 'http://localhost:5001/api/ai/smart-search' \
  -H 'Content-Type: application/json' \
  -d '{"query": "Mercedes Euro 6 low mileage"}' | python3 -m json.tool
```

### 4. Test Price Estimation 💰
```bash
curl -s 'http://localhost:5001/api/ai/price-estimate' \
  -H 'Content-Type: application/json' \
  -d '{
    "category": "semi-trailer-trucks",
    "brand": "Mercedes-Benz",
    "year": 2020,
    "mileage": 350000,
    "price": 45000,
    "euro_standard": "Euro 6"
  }' | python3 -m json.tool
```

### 5. Test Trending Vehicles 🔥
```bash
curl -s 'http://localhost:5001/api/ai/trending?limit=10' | python3 -m json.tool
```

### 6. Test Price Trends 📈
```bash
curl -s 'http://localhost:5001/api/ai/price-trends?days=30' | python3 -m json.tool
```

### 7. Test Best Time to Buy Prediction ⏰
```bash
curl -s 'http://localhost:5001/api/ai/best-time-to-buy' \
  -H 'Content-Type: application/json' \
  -d '{
    "category": "semi-trailer-trucks",
    "brand": "Mercedes-Benz"
  }' | python3 -m json.tool
```

---

## 🤖 Chatbot Conversation Examples

Test different chatbot intents:

```bash
# Greeting
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "Hello"}' | python3 -m json.tool

# Search trucks
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "Show me Scania trucks"}' | python3 -m json.tool

# Price inquiry
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "I have 40000 euros budget"}' | python3 -m json.tool

# Get recommendations
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "What do you recommend?"}' | python3 -m json.tool

# Compare vehicles
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "Compare Mercedes vs Volvo"}' | python3 -m json.tool

# Market trends
curl -s 'http://localhost:5001/api/chatbot' -H 'Content-Type: application/json' \
  -d '{"message": "What are the market trends?"}' | python3 -m json.tool
```

---

## 📋 Run Full Test Suite

Run all tests automatically:

```bash
chmod +x test-ai-features.sh
./test-ai-features.sh
```

---

## 🌐 Browser Testing

### Option 1: Direct API Testing

Open your browser and go to the DevTools console (F12), then paste:

```javascript
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

// Test Smart Search
fetch('http://localhost:5001/api/ai/smart-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'Mercedes Euro 6' })
})
.then(r => r.json())
.then(console.log);
```

### Option 2: Terms & Conditions Page

Create the route in your [App.js](client/src/App.js):

```javascript
import TermsConditions from './pages/TermsConditions';

// Add to your routes:
<Route path="/terms-conditions" element={<TermsConditions />} />
```

Then visit: **http://localhost:3000/terms-conditions**

---

## 🔐 Testing Authenticated Features

For features requiring authentication (favorites, saved searches, price alerts):

### Step 1: Get Authentication Token

```bash
TOKEN=$(curl -s -X POST 'http://localhost:5001/api/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Your token: $TOKEN"
```

### Step 2: Test Authenticated Endpoints

```bash
# Add to favorites
curl -s 'http://localhost:5001/api/favorites' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"truck_id": 1, "notes": "Great deal!"}' | python3 -m json.tool

# Get favorites
curl -s 'http://localhost:5001/api/favorites' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Create saved search
curl -s 'http://localhost:5001/api/saved-searches' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "My Dream Trucks",
    "filters": {"brand": "Mercedes-Benz", "maxPrice": 50000},
    "notification_enabled": true
  }' | python3 -m json.tool

# Get saved searches
curl -s 'http://localhost:5001/api/saved-searches' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool

# Create price alert
curl -s 'http://localhost:5001/api/price-alerts' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"truck_id": 1, "threshold_percent": 5}' | python3 -m json.tool

# Get personalized recommendations
curl -s 'http://localhost:5001/api/ai/personalized?limit=10' \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```

---

## 📊 Expected Results

### ✅ Successful Responses:

1. **Chatbot**: Returns message, intent, and suggestions
2. **Market Insights**: Shows total listings, average price, brand distribution
3. **Smart Search**: Parses natural language into filters
4. **Price Estimate**: Returns price range with confidence level
5. **Trending**: List of popular vehicles with scores
6. **Price Trends**: Daily data with trend direction (up/down/stable)
7. **Best Time to Buy**: Recommendation with confidence score

### Example: Market Insights Response
```json
{
  "total_listings": 183,
  "average_price": 49946,
  "median_price": 38795,
  "price_range": { "min": 9827, "max": 176571 },
  "average_mileage": 247042,
  "average_year": 2018,
  "most_common_brand": "Renault",
  "brand_distribution": { "Mercedes-Benz": 18, "Volvo": 11, ... }
}
```

---

## 🔍 Debugging

### Check Server Logs
```bash
tail -f /tmp/server.log
```

### Test Server Health
```bash
curl -s http://localhost:5001/api/health | python3 -m json.tool
```

### Inspect Database
```bash
sqlite3 server/database.sqlite

.tables
SELECT * FROM search_history LIMIT 5;
SELECT * FROM saved_searches LIMIT 5;
SELECT * FROM user_favorites LIMIT 5;
.quit
```

---

## 📚 Documentation

- **Full Testing Guide**: [TEST_AI_FEATURES.md](TEST_AI_FEATURES.md)
- **Implementation Summary**: [COMPLETE_AI_IMPLEMENTATION.md](COMPLETE_AI_IMPLEMENTATION.md)
- **AI Implementation Plan**: [AI_IMPLEMENTATION_SUMMARY.md](AI_IMPLEMENTATION_SUMMARY.md)

---

## 🎉 All Features Implemented!

✅ Phase 1: Basic AI Recommendations
✅ Phase 2: Smart Search & History
✅ Phase 3: ML Price Predictor & Chatbot
✅ Phase 4: Predictive Analytics & Forecasting
✅ Terms & Conditions Page

**Happy Testing! 🚀**
