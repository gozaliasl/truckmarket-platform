#!/bin/bash

# TruckMarket Demo Registration Script
# This script creates 3 test accounts (one for each tier)

echo "========================================"
echo "  TruckMarket Demo Registration Script"
echo "========================================"
echo ""

API_URL="http://localhost:5001/api"

echo "Checking if backend is running..."
if ! curl -s "$API_URL/health" > /dev/null; then
    echo "❌ Error: Backend is not running on port 5001"
    echo "Please start the backend first: node server/index.js"
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Creating Demo Accounts..."
echo "========================================"
echo ""

# 1. Register FREE user
echo -e "${GREEN}1. Registering FREE Tier User...${NC}"
FREE_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "free@demo.com",
    "password": "demo123",
    "name": "John Smith",
    "phone": "+1 555 0001",
    "tier": "free"
  }')

if echo "$FREE_RESPONSE" | grep -q "token"; then
    FREE_TOKEN=$(echo "$FREE_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    echo "   ✅ FREE user created successfully!"
    echo "   📧 Email: free@demo.com"
    echo "   🔑 Password: demo123"
    echo "   👤 Name: John Smith"
    echo "   📊 Tier: FREE (5 listings max)"
    echo ""
else
    echo "   ⚠️  User might already exist or error occurred"
    echo ""
fi

# 2. Register PREMIUM user
echo -e "${BLUE}2. Registering PREMIUM Tier User...${NC}"
PREMIUM_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "premium@demo.com",
    "password": "demo123",
    "name": "Maria Garcia",
    "phone": "+34 91 123 4567",
    "company_name": "Garcia Trucks Spain",
    "tier": "premium"
  }')

if echo "$PREMIUM_RESPONSE" | grep -q "token"; then
    PREMIUM_TOKEN=$(echo "$PREMIUM_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    echo "   ✅ PREMIUM user created successfully!"
    echo "   📧 Email: premium@demo.com"
    echo "   🔑 Password: demo123"
    echo "   👤 Name: Maria Garcia"
    echo "   🏢 Company: Garcia Trucks Spain"
    echo "   📊 Tier: PREMIUM (25 listings max)"
    echo ""
else
    echo "   ⚠️  User might already exist or error occurred"
    echo ""
fi

# 3. Register PROFESSIONAL user
echo -e "${YELLOW}3. Registering PROFESSIONAL Tier User...${NC}"
PRO_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "professional@demo.com",
    "password": "demo123",
    "name": "Hans Schmidt",
    "phone": "+49 40 567 8900",
    "company_name": "Hamburg Elite Trucks GmbH",
    "tier": "professional"
  }')

if echo "$PRO_RESPONSE" | grep -q "token"; then
    PRO_TOKEN=$(echo "$PRO_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    PRO_SUBDOMAIN=$(echo "$PRO_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['user']['subdomain'])" 2>/dev/null)
    echo "   ✅ PROFESSIONAL user created successfully!"
    echo "   📧 Email: professional@demo.com"
    echo "   🔑 Password: demo123"
    echo "   👤 Name: Hans Schmidt"
    echo "   🏢 Company: Hamburg Elite Trucks GmbH"
    echo "   📊 Tier: PROFESSIONAL (Unlimited listings)"
    echo "   🌐 Dealer Page: /dealer/$PRO_SUBDOMAIN"
    echo "   🔗 URL: http://localhost:3000/dealer/$PRO_SUBDOMAIN"
    echo ""
else
    echo "   ⚠️  User might already exist or error occurred"
    echo ""
fi

echo "========================================"
echo "Demo Accounts Summary"
echo "========================================"
echo ""
echo "All accounts use password: demo123"
echo ""
echo "1. FREE Tier:"
echo "   Email: free@demo.com"
echo "   Features: 5 listings, basic features"
echo ""
echo "2. PREMIUM Tier:"
echo "   Email: premium@demo.com"
echo "   Features: 25 listings, analytics, featured ads"
echo ""
echo "3. PROFESSIONAL Tier:"
echo "   Email: professional@demo.com"
echo "   Features: Unlimited listings, custom dealer page"
if [ ! -z "$PRO_SUBDOMAIN" ]; then
    echo "   Dealer Page: http://localhost:5001/api/dealers/$PRO_SUBDOMAIN"
fi
echo ""

# Optional: Create sample listings for Professional user
if [ ! -z "$PRO_TOKEN" ]; then
    echo "========================================"
    echo "Creating Sample Listings for Pro User..."
    echo "========================================"
    echo ""

    # Create 3 sample trucks for professional user
    echo "Creating sample truck 1..."
    curl -s -X POST "$API_URL/my-trucks" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $PRO_TOKEN" \
      -d '{
        "title": "Mercedes-Benz Actros 1851 LS - Like New",
        "brand": "Mercedes-Benz",
        "model": "Actros 1851",
        "year": 2023,
        "price": 89000,
        "currency": "EUR",
        "mileage": 15000,
        "condition": "Used",
        "location": "Hamburg",
        "country": "Germany",
        "category": "Tractor Unit",
        "engine_power": 510,
        "transmission": "Automatic",
        "fuel_type": "Diesel",
        "axle_configuration": "4x2",
        "color": "White",
        "description": "Excellent condition Mercedes-Benz Actros with full service history. Euro 6, automatic transmission, low mileage.",
        "image_url": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
      }' > /dev/null && echo "   ✅ Sample truck 1 created"

    echo "Creating sample truck 2..."
    curl -s -X POST "$API_URL/my-trucks" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $PRO_TOKEN" \
      -d '{
        "title": "Volvo FH 540 Globetrotter XL",
        "brand": "Volvo",
        "model": "FH 540",
        "year": 2022,
        "price": 95000,
        "currency": "EUR",
        "mileage": 120000,
        "condition": "Used",
        "location": "Hamburg",
        "country": "Germany",
        "category": "Tractor Unit",
        "engine_power": 540,
        "transmission": "Automatic",
        "fuel_type": "Diesel",
        "axle_configuration": "6x2",
        "color": "Blue",
        "description": "Premium Volvo FH with Globetrotter XL cabin. I-Shift automatic, adaptive cruise, excellent condition.",
        "image_url": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
      }' > /dev/null && echo "   ✅ Sample truck 2 created"

    echo "Creating sample truck 3..."
    curl -s -X POST "$API_URL/my-trucks" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $PRO_TOKEN" \
      -d '{
        "title": "Scania R 450 Highline - Top Spec",
        "brand": "Scania",
        "model": "R 450",
        "year": 2023,
        "price": 92000,
        "currency": "EUR",
        "mileage": 85000,
        "condition": "Used",
        "location": "Hamburg",
        "country": "Germany",
        "category": "Tractor Unit",
        "engine_power": 450,
        "transmission": "Automatic",
        "fuel_type": "Diesel",
        "axle_configuration": "4x2",
        "color": "Silver",
        "description": "Beautiful Scania R 450 Highline with full options. Opticruise, retarder, leather interior.",
        "image_url": "https://images.unsplash.com/photo-1562247970-f8c6b3b6c623?w=800"
      }' > /dev/null && echo "   ✅ Sample truck 3 created"

    echo ""
    echo "✅ 3 sample trucks created for professional dealer"
    echo ""
fi

echo "========================================"
echo "Testing Login for Each Account..."
echo "========================================"
echo ""

# Test login for each account
echo "Testing FREE user login..."
FREE_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"free@demo.com","password":"demo123"}')

if echo "$FREE_LOGIN" | grep -q "token"; then
    echo "   ✅ FREE user can login successfully"
else
    echo "   ❌ FREE user login failed"
fi

echo "Testing PREMIUM user login..."
PREMIUM_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@demo.com","password":"demo123"}')

if echo "$PREMIUM_LOGIN" | grep -q "token"; then
    echo "   ✅ PREMIUM user can login successfully"
else
    echo "   ❌ PREMIUM user login failed"
fi

echo "Testing PROFESSIONAL user login..."
PRO_LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"professional@demo.com","password":"demo123"}')

if echo "$PRO_LOGIN" | grep -q "token"; then
    echo "   ✅ PROFESSIONAL user can login successfully"
else
    echo "   ❌ PROFESSIONAL user login failed"
fi

echo ""
echo "========================================"
echo "✅ Demo Setup Complete!"
echo "========================================"
echo ""
echo "You can now login with any of these accounts:"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:5001"
echo ""
echo "Use these credentials to test:"
echo "  • free@demo.com / demo123"
echo "  • premium@demo.com / demo123"
echo "  • professional@demo.com / demo123"
echo ""
if [ ! -z "$PRO_SUBDOMAIN" ]; then
    echo "Professional dealer page:"
    echo "  http://localhost:3000/dealer/$PRO_SUBDOMAIN"
    echo ""
fi
echo "========================================"
