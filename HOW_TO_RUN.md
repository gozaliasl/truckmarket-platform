# 🚀 HOW TO RUN - TruckMarket Platform

## ✅ CURRENTLY RUNNING!

Your platform is **LIVE and OPERATIONAL** right now!

---

## 📍 **Access Your Platform**

### Frontend Application
🌐 **http://localhost:3000**
- Browse trucks
- Search and filter
- View truck details

### Backend API
🔌 **http://localhost:5001**
- All authentication endpoints
- Truck management
- User registration (3 tiers)
- Professional dealer pages

---

## 🎯 **What's Working RIGHT NOW**

### ✅ **Existing Features (From Before)**
- Truck listings and browsing
- Search and advanced filters
- Truck detail pages
- Contact forms
- 8 sample trucks from Europe

### ✅ **NEW Features (Just Added)**

#### **🔐 User Authentication System**
- User registration with email/password
- Secure login with JWT tokens
- Session management
- Password hashing with bcrypt

#### **📊 Three-Tier Registration System**

**🆓 FREE Tier** - $0/month
- 5 truck listings
- Basic features
- Perfect for individuals

**⭐ PREMIUM Tier** - $29.99/month
- 25 truck listings
- Featured listings
- Analytics dashboard
- Priority support

**👑 PROFESSIONAL Tier** - $99.99/month
- **UNLIMITED listings (999)**
- **Custom dealer page** at `/dealer/your-company-name`
- **Subdomain-style presence**
- Custom branding (logo, colors)
- API access
- White-label options

#### **🏢 Professional Dealer Features**
- Each Professional user gets their own dealer page
- Unique URL: `/dealer/{subdomain}`
- Company profile display
- All their trucks in one place
- Shareable marketing link

---

## 🧪 **Test It Right Now!**

### 1. View the Platform
Open: **http://localhost:3000**

### 2. Test User Registration (via API)

#### Register a FREE user:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"free@test.com","password":"test123","name":"Free User","tier":"free"}'
```

#### Register a PREMIUM user:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@test.com","password":"test123","name":"Premium User","company_name":"Premium Trucks","tier":"premium"}'
```

#### Register a PROFESSIONAL user:
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dealer@test.com","password":"test123","name":"Pro Dealer","company_name":"Elite Trucks GmbH","phone":"+49123456","tier":"professional"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dealer@test.com","password":"test123"}'
```

**This returns a JWT token - save it!**

### 4. Test Professional Dealer Page
```bash
# The subdomain is auto-generated from company name
curl http://localhost:5001/api/dealers/elite-trucks-gmbh
```

### 5. Create a Truck Listing (Authenticated)
```bash
# Replace YOUR_TOKEN with token from login
curl -X POST http://localhost:5001/api/my-trucks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Mercedes-Benz Actros 2024","brand":"Mercedes-Benz","model":"Actros","year":2024,"price":95000,"currency":"EUR","mileage":1000,"condition":"New","location":"Hamburg","country":"Germany","category":"Tractor Unit","engine_power":530,"transmission":"Automatic","fuel_type":"Diesel","axle_configuration":"4x2","color":"White","description":"Brand new truck","image_url":"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"}'
```

### 6. View Your Listings
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/my-trucks
```

### 7. Get Dashboard Stats
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/dashboard/stats
```

---

## 🔄 **If You Need to Restart**

### Stop Everything
```bash
# Kill both servers
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Start Backend
```bash
cd /Users/gozalig1/Documents/truckplatfourm
node server/index.js
```
*Keep this terminal open*

### Start Frontend (in new terminal)
```bash
cd /Users/gozalig1/Documents/truckplatfourm/client
npm start
```
*Keep this terminal open*

### Reset Database (if needed)
```bash
cd /Users/gozalig1/Documents/truckplatfourm
rm server/trucks.db
node server/seed.js
```

---

## 📊 **Current System Status**

### Backend (✅ Running on port 5001)
- User authentication
- Three-tier registration
- Professional dealer pages
- Truck CRUD operations
- Dashboard statistics
- Session management

### Frontend (✅ Running on port 3000)
- Home page with truck listings
- Search and filters
- Truck detail pages
- Contact forms
- **Note**: Registration/Login UI pages created but not yet integrated into routes

### Database (✅ SQLite)
- Users table with tiers
- Trucks table with ownership
- Sessions table for auth
- Contacts table
- Favorites table
- 8 sample trucks

---

## 🎨 **What's Been Built**

### Backend Files Created:
- ✅ `/server/auth.js` - Authentication system
- ✅ `/server/index.js` - Updated with auth routes
- ✅ `/server/database.js` - Updated schema with users

### Frontend Files Created:
- ✅ `/client/src/context/AuthContext.js` - Auth state management
- ✅ `/client/src/pages/Register.js` - Registration page component

### Documentation Created:
- ✅ `USER_REGISTRATION_GUIDE.md` - Full auth system docs
- ✅ `QUICK_START.md` - Quick start guide
- ✅ `HOW_TO_RUN.md` - This file!

---

## 🎯 **What You Can Do RIGHT NOW**

### Via Browser (http://localhost:3000):
- ✅ Browse 8 sample trucks
- ✅ Search and filter trucks
- ✅ View truck details
- ✅ Submit contact forms

### Via API (curl/Postman):
- ✅ Register users in all 3 tiers
- ✅ Login and get JWT token
- ✅ Create truck listings
- ✅ View dealer profiles
- ✅ Manage your listings
- ✅ Get dashboard statistics

---

## 📱 **Professional Tier Example**

When you register a Professional user with company name "Hamburg Trucks GmbH":

1. **Subdomain created**: `hamburg-trucks-gmbh`
2. **Dealer page URL**: `/dealer/hamburg-trucks-gmbh`
3. **Can post**: Unlimited trucks (999 max)
4. **Gets**: Custom branded page showing all their inventory

### Example:
```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"contact@hamburgtrucks.com","password":"secure123","name":"Hans Schmidt","company_name":"Hamburg Trucks GmbH","phone":"+49 40 123456","tier":"professional"}'

# View their dealer page
curl http://localhost:5001/api/dealers/hamburg-trucks-gmbh

# View their trucks
curl http://localhost:5001/api/dealers/hamburg-trucks-gmbh/trucks
```

---

## 🔒 **Security Features**

- ✅ Bcrypt password hashing (10 rounds)
- ✅ JWT token authentication
- ✅ 7-day token expiration
- ✅ Session management
- ✅ Route protection middleware
- ✅ Ownership verification for listings

---

## 📈 **Tier Comparison Table**

| Feature | Free | Premium | Professional |
|---------|------|---------|--------------|
| Monthly Cost | $0 | $29.99 | $99.99 |
| Listings | 5 | 25 | **Unlimited** |
| Search Visibility | ✓ | ✓ | ✓ |
| Contact Forms | ✓ | ✓ | ✓ |
| Featured Listings | ✗ | ✓ | ✓ |
| Analytics | ✗ | ✓ | ✓ |
| Priority Support | ✗ | ✓ | ✓ |
| **Custom Dealer Page** | ✗ | ✗ | **✓** |
| **Subdomain URL** | ✗ | ✗ | **✓** |
| **Custom Branding** | ✗ | ✗ | **✓** |
| **API Access** | ✗ | ✗ | **✓** |

---

## 🎊 **Success! Your Platform is Live**

Both servers are running:
- **Frontend**: http://localhost:3000 ✅
- **Backend**: http://localhost:5001 ✅

**You can start testing immediately!**

---

## 📞 **Need More Info?**

Check these docs:
- **USER_REGISTRATION_GUIDE.md** - Complete auth system documentation
- **DEMO_GUIDE.md** - Platform feature walkthrough
- **README.md** - Installation and setup
- **QUICK_START.md** - Quick start commands

---

**The platform is fully functional with user registration, authentication, and 3-tier system including Professional dealer pages!**
