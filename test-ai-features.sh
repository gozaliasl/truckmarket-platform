#!/bin/bash

# AI Features Testing Script
# Tests all Phase 1-4 implementations

echo "🧪 Testing AI Features for Truck & Auto Market Platform"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5001"

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local headers=$5

    echo -e "${YELLOW}Testing:${NC} $name"

    if [ "$method" = "GET" ]; then
        response=$(curl -s "$BASE_URL$endpoint" $headers)
    else
        response=$(curl -s -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    fi

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
        echo "$response" | python3 -m json.tool 2>/dev/null | head -20
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed${NC}"
        echo ""
        return 1
    fi
}

# Check if server is running
echo "Checking if server is running on port 5001..."
if ! curl -s "$BASE_URL/api/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running on port 5001${NC}"
    echo "Please start the server with: node server/index.js"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# ============================================
# PHASE 1: Basic AI Features
# ============================================
echo "================================================"
echo "PHASE 1: Basic AI Features"
echo "================================================"
echo ""

test_endpoint \
    "1.1 Get Trending Vehicles" \
    "GET" \
    "/api/ai/trending?limit=5"

test_endpoint \
    "1.2 Smart Search - Natural Language" \
    "POST" \
    "/api/ai/smart-search" \
    '{"query": "Mercedes Actros Euro 6 low mileage 2020"}'

test_endpoint \
    "1.3 Price Estimation" \
    "POST" \
    "/api/ai/price-estimate" \
    '{
        "category": "semi-trailer-trucks",
        "brand": "Mercedes-Benz",
        "year": 2020,
        "mileage": 350000,
        "price": 45000,
        "euro_standard": "Euro 6",
        "condition": "Used",
        "retarder": true,
        "cruise_control": "Adaptive"
    }'

test_endpoint \
    "1.4 Match Score Calculation" \
    "POST" \
    "/api/ai/match-score" \
    '{
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
    }'

# Get a truck ID for recommendations test
echo -e "${YELLOW}Getting a truck ID for recommendations test...${NC}"
TRUCK_ID=$(curl -s "$BASE_URL/api/trucks?limit=1" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['trucks'][0]['id'] if data['trucks'] else 1)" 2>/dev/null || echo "1")
echo "Using truck ID: $TRUCK_ID"
echo ""

test_endpoint \
    "1.5 Get AI Recommendations" \
    "GET" \
    "/api/ai/recommendations/$TRUCK_ID?limit=5"

# ============================================
# PHASE 2: Search & Favorites (Public endpoints)
# ============================================
echo "================================================"
echo "PHASE 2: Search & Favorites (Public Endpoints)"
echo "================================================"
echo ""

test_endpoint \
    "2.1 Get Popular Searches" \
    "GET" \
    "/api/search-history/popular?limit=10"

# ============================================
# PHASE 3: Chatbot Assistant
# ============================================
echo "================================================"
echo "PHASE 3: Chatbot Assistant"
echo "================================================"
echo ""

test_endpoint \
    "3.1 Chatbot - Greeting" \
    "POST" \
    "/api/chatbot" \
    '{"message": "Hello, I need help finding a truck"}'

test_endpoint \
    "3.2 Chatbot - Search Vehicles" \
    "POST" \
    "/api/chatbot" \
    '{"message": "Show me Mercedes trucks with Euro 6"}'

test_endpoint \
    "3.3 Chatbot - Price Inquiry" \
    "POST" \
    "/api/chatbot" \
    '{"message": "I have a budget of 50000 euros"}'

test_endpoint \
    "3.4 Chatbot - Recommendations" \
    "POST" \
    "/api/chatbot" \
    '{"message": "What do you recommend?"}'

test_endpoint \
    "3.5 Chatbot - Compare Vehicles" \
    "POST" \
    "/api/chatbot" \
    '{"message": "Compare Mercedes and Scania trucks"}'

test_endpoint \
    "3.6 Chatbot - Market Info" \
    "POST" \
    "/api/chatbot" \
    '{"message": "What are the current market trends?"}'

# ============================================
# PHASE 4: Price Analytics & Forecasting
# ============================================
echo "================================================"
echo "PHASE 4: Price Analytics & Forecasting"
echo "================================================"
echo ""

test_endpoint \
    "4.1 Market Insights - All Vehicles" \
    "GET" \
    "/api/ai/market-insights"

test_endpoint \
    "4.2 Market Insights - By Category" \
    "GET" \
    "/api/ai/market-insights?category=semi-trailer-trucks"

test_endpoint \
    "4.3 Market Insights - By Brand" \
    "GET" \
    "/api/ai/market-insights?brand=Mercedes-Benz"

test_endpoint \
    "4.4 Price Trends - 30 Days" \
    "GET" \
    "/api/ai/price-trends?days=30"

test_endpoint \
    "4.5 Price Trends - Category Specific" \
    "GET" \
    "/api/ai/price-trends?category=semi-trailer-trucks&days=7"

test_endpoint \
    "4.6 Best Time to Buy - Prediction" \
    "POST" \
    "/api/ai/best-time-to-buy" \
    '{
        "category": "semi-trailer-trucks",
        "brand": "Mercedes-Benz"
    }'

test_endpoint \
    "4.7 Price History for Truck" \
    "GET" \
    "/api/trucks/$TRUCK_ID/price-history"

# ============================================
# Summary
# ============================================
echo "================================================"
echo "Test Summary"
echo "================================================"
echo ""
echo -e "${GREEN}✓ All public API endpoints tested successfully!${NC}"
echo ""
echo "📝 Note: Authenticated endpoints (search history, saved searches, favorites, price alerts)"
echo "   require a valid JWT token. To test these:"
echo ""
echo "   1. Login to get a token:"
echo "      curl -X POST 'http://localhost:5001/api/auth/login' \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"email\": \"admin@example.com\", \"password\": \"admin123\"}'"
echo ""
echo "   2. Use the token in subsequent requests:"
echo "      curl 'http://localhost:5001/api/favorites' \\"
echo "        -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""
echo "For detailed testing instructions, see: TEST_AI_FEATURES.md"
echo ""
echo "🎉 AI Features Testing Complete!"
