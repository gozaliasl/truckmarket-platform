# 🚀 Quick Start Guide - TruckMarket Platform

## How to Run the Platform

### Prerequisites
✅ Node.js installed
✅ npm installed
✅ Terminal/Command prompt

---

## 🎯 **SIMPLE 3-STEP START**

### Step 1: Reset Database (New Schema with Users)
```bash
cd /Users/gozalig1/Documents/truckplatfourm
rm -f server/trucks.db
node server/seed.js
```

### Step 2: Start Backend Server
```bash
# In Terminal 1
node server/index.js
```
You should see: `Server running on http://localhost:5001`

### Step 3: Start Frontend Application
```bash
# In Terminal 2 (new terminal window)
cd client
npm start
```
Wait for: `webpack compiled successfully`

### Step 4: Open Browser
Navigate to: **http://localhost:3000**

---

## 🎉 **You're Running!**

Your platform is now accessible at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

---

## 🧪 **Test the New Features**

### Test Registration System

1. **Open Browser**: http://localhost:3000/register (if route exists)
2. **Or test via API**:

```bash
# Test tier information
curl http://localhost:5001/api/tiers

# Register a FREE user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "free@test.com",
    "password": "test123",
    "name": "Free User",
    "phone": "+1234567890",
    "tier": "free"
  }'

# Register a PREMIUM user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "premium@test.com",
    "password": "test123",
    "name": "Premium User",
    "phone": "+1234567890",
    "company_name": "Premium Trucks Co",
    "tier": "premium"
  }'

# Register a PROFESSIONAL user
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pro@test.com",
    "password": "test123",
    "name": "Pro User",
    "phone": "+49 40 123456",
    "company_name": "Hamburg Professional Trucks",
    "tier": "professional"
  }'
```

### After Registration, Test Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "pro@test.com",
    "password": "test123"
  }'
```

This will return a JWT token. Copy it for next steps!

### Test Professional Dealer Page

```bash
# Get dealer info
curl http://localhost:5001/api/dealers/hamburg-professional-trucks

# Get dealer's trucks
curl http://localhost:5001/api/dealers/hamburg-professional-trucks/trucks
```

### Test Creating a Truck Listing

```bash
# Replace YOUR_TOKEN with the token from login
curl -X POST http://localhost:5001/api/my-trucks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Mercedes-Benz Actros 2024 - Test Listing",
    "brand": "Mercedes-Benz",
    "model": "Actros 2024",
    "year": 2024,
    "price": 95000,
    "currency": "EUR",
    "mileage": 1000,
    "condition": "New",
    "location": "Hamburg",
    "country": "Germany",
    "category": "Tractor Unit",
    "engine_power": 530,
    "transmission": "Automatic",
    "fuel_type": "Diesel",
    "axle_configuration": "4x2",
    "color": "White",
    "description": "Brand new Mercedes-Benz Actros 2024 with latest technology",
    "image_url": "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
  }'
```

### Get User's Dashboard Stats

```bash
curl -X GET http://localhost:5001/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📁 **Current Platform Status**

### ✅ **FULLY IMPLEMENTED (Backend)**
- User registration with 3 tiers
- Login/logout authentication
- JWT token management
- User dashboard
- Truck listing management (CRUD)
- Professional dealer pages
- Tier-based listing limits
- Statistics and analytics

### ⚠️ **PARTIALLY IMPLEMENTED (Frontend)**
- Home page ✅
- Truck listings ✅
- Truck details ✅
- Search & filters ✅
- Auth context ✅
- Register page ✅ (component created)

### 🔄 **NEEDS UI INTEGRATION**
The following need to be added to App.js and styled:
- Login page (needs route)
- Dashboard page (needs creation)
- Professional dealer public page (needs creation)
- Create/Edit listing forms (needs creation)
- Update Header with auth state

---

## 🛠️ **To Complete the Full UI**

### Quick Frontend Completion (Optional)

If you want to see the full UI, we need to:

1. Create Login.js page
2. Create Dashboard.js page
3. Create DealerPage.js
4. Add all CSS files
5. Update App.js with routes:
   - /register
   - /login
   - /dashboard
   - /dealer/:subdomain
6. Update Header.js to show login state

**Would you like me to complete these frontend pages now?**

---

## 🎯 **What You Can Do NOW**

### Even without full UI, you can:

1. ✅ **Use the existing home page** to browse trucks
2. ✅ **Test all backend APIs** via curl/Postman
3. ✅ **Create users** in all 3 tiers via API
4. ✅ **Create truck listings** via API
5. ✅ **Access dealer pages** via `/dealer/subdomain` (backend)

### The Backend is 100% Complete!

All registration tiers work:
- FREE users: 5 listings max
- PREMIUM users: 25 listings max
- PROFESSIONAL users: Unlimited + custom page

---

## 🐛 **Troubleshooting**

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Database Issues
```bash
# Reset database
rm server/trucks.db
node server/seed.js
```

### Module Not Found
```bash
# Reinstall dependencies
npm install
cd client && npm install
```

---

## 📊 **Platform Features Summary**

### 🆓 FREE Tier
- 5 truck listings
- Basic search visibility
- Contact forms
- Email notifications

### ⭐ PREMIUM Tier
- 25 truck listings
- Featured listings
- Analytics dashboard
- Priority support

### 👑 PROFESSIONAL Tier
- **Unlimited listings**
- **Custom dealer page**: `/dealer/your-company`
- **Subdomain-style presence**
- Custom branding
- API access

---

## 🚀 **Current Running Status**

After following steps 1-3 above, you have:

```
Backend:  ✅ http://localhost:5001
Frontend: ✅ http://localhost:3000
Database: ✅ SQLite with users table
```

---

## 📞 **Need Help?**

Check these files:
- **USER_REGISTRATION_GUIDE.md** - Full registration system docs
- **DEMO_GUIDE.md** - Platform walkthrough
- **README.md** - Installation guide
- **INSTALLATION_COMPLETE.md** - Setup confirmation

---

**The platform is ready to run! Backend authentication and 3-tier system are fully functional.**
