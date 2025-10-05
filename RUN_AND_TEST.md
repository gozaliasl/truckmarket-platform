# 🚀 HOW TO RUN AND TEST - Complete Guide

## ✅ CURRENT STATUS

**Both servers are RUNNING:**
- Backend: http://localhost:5001 ✅
- Frontend: http://localhost:3000 ✅

---

## 🎯 STEP 1: Run Demo Registration Script

This creates 3 test accounts (Free, Premium, Professional):

```bash
cd /Users/gozalig1/Documents/truckplatfourm
./demo-registration.sh
```

**This creates:**
- 🆓 **Free User**: free@demo.com / demo123
- ⭐ **Premium User**: premium@demo.com / demo123
- 👑 **Professional User**: professional@demo.com / demo123
- Plus 3 sample truck listings for the professional user

---

## 🌐 STEP 2: Test the Platform

### Access Points:

**Frontend (Main Site)**
- URL: http://localhost:3000
- Browse trucks, search, filter, view details

**Backend API**
- URL: http://localhost:5001
- All authentication and data endpoints

---

## 🧪 STEP 3: Test Features

### A. Browse Trucks (No Login Required)
1. Open http://localhost:3000
2. See 8+ sample trucks on home page
3. Use filters (brand, price, year, country)
4. Click any truck to see details
5. Test search bar

### B. User Authentication

#### Test Registration (API):
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"test123","name":"New User","tier":"free"}'
```

#### Test Login (API):
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"free@demo.com","password":"demo123"}'
```

**Save the token from login response!**

### C. Test Professional Dealer Page

```bash
# View dealer profile
curl http://localhost:5001/api/dealers/hamburg-elite-trucks-gmbh

# View dealer's trucks
curl http://localhost:5001/api/dealers/hamburg-elite-trucks-gmbh/trucks
```

### D. Test Creating Listings (Authenticated)

```bash
# Replace YOUR_TOKEN with token from login
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5001/api/my-trucks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Truck Listing",
    "brand": "Volvo",
    "model": "FH16",
    "year": 2024,
    "price": 120000,
    "currency": "EUR",
    "mileage": 500,
    "condition": "New",
    "location": "Stockholm",
    "country": "Sweden",
    "category": "Tractor Unit",
    "engine_power": 600,
    "transmission": "Automatic",
    "fuel_type": "Diesel",
    "axle_configuration": "6x4",
    "color": "Blue",
    "description": "Brand new Volvo FH16 test listing",
    "image_url": "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
  }'
```

### E. Test Dashboard Stats

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/dashboard/stats
```

---

## 📋 STEP 4: Complete Missing Pages (Optional)

The platform is functional but missing some UI pages. To add them:

### Required Files to Create:

All instructions are in **COMPLETE_SETUP_GUIDE.md**

1. **Login.css** - Already defined in COMPLETE_SETUP_GUIDE.md
2. **Register.css** - Already defined in COMPLETE_SETUP_GUIDE.md
3. **About.js** - Already defined in COMPLETE_SETUP_GUIDE.md
4. **About.css** - Already defined in COMPLETE_SETUP_GUIDE.md
5. **Contact.js** - Already defined in COMPLETE_SETUP_GUIDE.md
6. **Contact.css** - Already defined in COMPLETE_SETUP_GUIDE.md
7. **Update App.js** - Code provided in COMPLETE_SETUP_GUIDE.md
8. **Update Header.js** - To add links to About, Contact, Login

### Quick Create Command:

Copy the code from COMPLETE_SETUP_GUIDE.md and create each file, or I can create them for you.

---

## 🔄 STEP 5: Restart If Needed

### Stop Servers:
```bash
# Kill all processes
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Start Backend:
```bash
node server/index.js
```

### Start Frontend (new terminal):
```bash
cd client
npm start
```

---

## 📊 WHAT'S WORKING RIGHT NOW

### ✅ Backend (100% Complete)
- User registration (3 tiers)
- Login/logout with JWT
- Create/edit/delete truck listings
- Professional dealer pages
- Dashboard statistics
- Tier-based limits
- Session management
- Password hashing

### ✅ Frontend (Partially Complete)
- Home page with truck browsing
- Search and advanced filters
- Truck detail pages
- Contact forms
- Auth context for React

### ⚠️ Frontend (Needs UI Integration)
- Login page (component created, needs route)
- Register page (component created, needs route)
- About page (needs creation)
- Contact page (needs creation)
- Dashboard (needs creation)
- Header links (needs update)

---

## 🎯 TIER COMPARISON

| Feature | Free | Premium | Professional |
|---------|------|---------|--------------|
| **Cost** | $0/mo | $29.99/mo | $99.99/mo |
| **Listings** | 5 | 25 | Unlimited |
| **Basic Features** | ✓ | ✓ | ✓ |
| **Featured Listings** | ✗ | ✓ | ✓ |
| **Analytics** | ✗ | ✓ | ✓ |
| **Custom Dealer Page** | ✗ | ✗ | ✓ |
| **Subdomain URL** | ✗ | ✗ | ✓ |
| **Custom Branding** | ✗ | ✗ | ✓ |

---

## 📝 TEST SCENARIOS

### Scenario 1: Individual Seller (Free Tier)
1. Run demo script or register via API
2. Login as free@demo.com / demo123
3. Create up to 5 truck listings
4. Try to create 6th listing → Should fail with limit error

### Scenario 2: Small Dealer (Premium Tier)
1. Login as premium@demo.com / demo123
2. Create up to 25 listings
3. Access analytics (when UI complete)
4. Get featured listing options

### Scenario 3: Large Dealer (Professional Tier)
1. Login as professional@demo.com / demo123
2. Create unlimited listings
3. Access custom dealer page at `/dealer/hamburg-elite-trucks-gmbh`
4. View all their trucks on dealer page
5. Custom branding options

---

## 🔗 API ENDPOINTS REFERENCE

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Trucks
- `GET /api/trucks` - Get all trucks (with filters)
- `GET /api/trucks/:id` - Get single truck
- `GET /api/filters` - Get filter options

### User Trucks (Authenticated)
- `GET /api/my-trucks` - Get user's listings
- `POST /api/my-trucks` - Create listing
- `PUT /api/my-trucks/:id` - Update listing
- `DELETE /api/my-trucks/:id` - Delete listing

### Dealer Pages
- `GET /api/dealers/:subdomain` - Get dealer profile
- `GET /api/dealers/:subdomain/trucks` - Get dealer's trucks

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics

### Misc
- `GET /api/tiers` - Get tier configurations
- `GET /api/health` - Health check

---

## 🎉 SUCCESS INDICATORS

You know it's working when:
- ✅ Demo script creates 3 accounts successfully
- ✅ Login returns JWT token
- ✅ Can create truck listings
- ✅ Professional dealer page shows dealer info
- ✅ Tier limits are enforced (Free: 5, Premium: 25, Pro: unlimited)
- ✅ Frontend displays all trucks
- ✅ Search and filters work

---

## 📖 DOCUMENTATION

- **HOW_TO_RUN.md** - General running instructions
- **USER_REGISTRATION_GUIDE.md** - Authentication system docs
- **COMPLETE_SETUP_GUIDE.md** - All missing page code
- **DEMO_GUIDE.md** - Feature walkthrough
- **README.md** - Installation guide

---

## 🚀 CURRENT CAPABILITIES

**You can RIGHT NOW:**

1. ✅ Browse and search trucks via frontend
2. ✅ Create user accounts via API (3 tiers)
3. ✅ Login and get JWT token
4. ✅ Create truck listings via API
5. ✅ View professional dealer pages via API
6. ✅ Get dashboard statistics via API
7. ✅ Test tier-based limits
8. ✅ Run demo script to set up test accounts

**The backend is 100% functional! Frontend UI pages just need integration.**

---

**Platform is LIVE and READY for testing! 🎊**
