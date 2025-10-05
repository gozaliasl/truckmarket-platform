# TruckMarket Platform - Demo Guide

## Overview
A fully functional truck sales platform prototype similar to autoline.info and mobile.de, featuring advanced search, filters, and listing management.

## Currently Running Services

✅ **Backend API**: Running on http://localhost:5001
✅ **Frontend App**: Running on http://localhost:3000
✅ **Database**: SQLite with 8 sample truck listings

## Access the Application

### Frontend (Main Interface)
Open your browser and navigate to: **http://localhost:3000**

### Backend API
API is accessible at: **http://localhost:5001/api/**

## Features Demonstrated

### 1. Homepage (http://localhost:3000)
- **Hero Section** with search bar
- **Filter Sidebar** with multiple filter options:
  - Brand (Mercedes-Benz, Volvo, MAN, Scania, DAF, Iveco, Renault)
  - Category (Tractor Unit, Tipper)
  - Country (Germany, Netherlands, Poland, Belgium, Italy, France)
  - Price Range
  - Year Range
  - Condition (New/Used)
  - Transmission (Automatic/Manual)

- **Truck Grid** displaying:
  - Truck images
  - Title and specifications
  - Year, mileage, engine power
  - Location and country
  - Price
  - Category badge

- **Sorting Options**:
  - Newest First
  - Price: Low to High
  - Year: Newest
  - Mileage: Lowest

- **Search Functionality**: Search by brand, model, or keywords

### 2. Truck Detail Page (Click any truck card)
- **Full truck information**:
  - Large image display
  - Complete specifications grid
  - Detailed description
  - Seller information
  - Contact form

- **Contact Features**:
  - Send message to seller
  - Direct call button
  - Email link

### 3. Sample Data
The platform includes 8 diverse truck listings:
1. Mercedes-Benz Actros 1851 (Germany) - €45,500
2. Volvo FH 500 (Netherlands) - €52,000
3. MAN TGX 18.480 (Germany) - €38,900
4. Scania R 450 (Poland) - €58,000
5. DAF XF 480 (Belgium) - €47,500
6. Iveco Stralis 460 (Italy) - €32,000
7. Renault T 520 (France) - €49,000
8. Mercedes-Benz Arocs 3345 Tipper (Germany) - €68,000

## Testing the Features

### Test Filters
1. Select "Mercedes-Benz" from Brand filter → See 2 Mercedes trucks
2. Set price range: Min 40000, Max 50000 → See trucks in that price range
3. Select "Germany" from Country → See German listings
4. Clear all filters to see all trucks again

### Test Search
1. Type "Volvo" in search bar → Find Volvo truck
2. Search "automatic" → Find trucks with automatic transmission
3. Search "tipper" → Find construction tipper truck

### Test Sorting
1. Sort by "Price: Low to High" → Cheapest truck first
2. Sort by "Year: Newest" → Most recent trucks first

### Test Detail Page
1. Click any truck card
2. View complete specifications
3. Click "Send Message" to see contact form
4. Fill out form and submit (saved to database)

## API Endpoints Available

### Get All Trucks (with filters)
```bash
curl 'http://localhost:5001/api/trucks'
curl 'http://localhost:5001/api/trucks?brand=Volvo'
curl 'http://localhost:5001/api/trucks?minPrice=40000&maxPrice=50000'
curl 'http://localhost:5001/api/trucks?country=Germany'
```

### Get Single Truck
```bash
curl 'http://localhost:5001/api/trucks/1'
```

### Get Filter Options
```bash
curl 'http://localhost:5001/api/filters'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"truck_id":1,"name":"John Doe","email":"john@example.com","message":"Interested"}'
```

## Technology Stack

### Backend
- Node.js + Express.js
- SQLite database
- RESTful API architecture
- CORS enabled

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Responsive CSS design
- Modern component architecture

## Key Differences from Autoline.info

### Implemented Features ✅
- Advanced filtering system
- Search functionality
- Truck listings with images
- Detailed truck specifications
- Seller contact system
- Responsive design
- Multi-country support
- Price display in EUR
- Category-based browsing

### Future Enhancements (Not Implemented)
- User authentication
- Multiple photos per listing
- Favorites/Watchlist
- Comparison tool
- Multi-language interface
- Payment integration
- Seller dashboard
- Reviews and ratings
- Advanced analytics

## Responsive Design
The platform is fully responsive and works on:
- Desktop (1400px+)
- Tablet (768px - 1400px)
- Mobile (< 768px)

## Performance
- Fast API responses (< 100ms)
- Efficient database queries with indexing
- Optimized React rendering
- Lazy loading ready

## Next Steps for Production

1. **Security**:
   - Add user authentication (JWT)
   - Input validation and sanitization
   - Rate limiting
   - HTTPS/SSL

2. **Features**:
   - Image upload system
   - User accounts and profiles
   - Messaging system
   - Payment gateway

3. **Infrastructure**:
   - Move to PostgreSQL/MySQL
   - Deploy to cloud (AWS, Heroku, etc.)
   - CDN for images
   - Caching (Redis)

4. **SEO**:
   - Server-side rendering (Next.js)
   - Meta tags
   - Sitemap
   - Schema markup

## Troubleshooting

### Frontend not loading?
- Check that port 3000 is not in use
- Clear browser cache
- Restart the React dev server

### Backend errors?
- Check that port 5001 is available
- Verify database file exists: `server/trucks.db`
- Check API health: `curl http://localhost:5001/api/health`

### No trucks showing?
- Reseed database: `node server/seed.js`
- Restart backend server
- Check browser console for errors

## Contact
For questions or improvements, refer to the README.md file.

---

**Demo created**: October 2025
**Status**: Fully Functional Prototype
**Production Ready**: No (Development/Demo only)
