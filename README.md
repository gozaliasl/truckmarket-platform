# TruckMarket - Commercial Truck Sales Platform

A modern truck sales platform similar to autoline.info and mobile.de, built with React and Node.js.

## Features

- **Advanced Search & Filters**: Search trucks by brand, model, year, price, location, and more
- **Multi-category Support**: Tractor units, tippers, semi-trailers, and other commercial vehicles
- **Detailed Listings**: Comprehensive truck specifications and seller information
- **Contact System**: Direct communication between buyers and sellers
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Filtering**: Instant results as you adjust filters
- **Sorting Options**: Sort by price, year, mileage, or newest listings

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite database
- RESTful API

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Initialize Database

```bash
# Seed the database with sample truck listings
node server/seed.js
```

### Step 3: Run the Application

You have two options:

**Option A: Run both server and client together (Recommended)**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Run backend server
npm run server

# Terminal 2 - Run frontend client
npm run client
```

### Step 4: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Trucks
- `GET /api/trucks` - Get all trucks with filters
  - Query params: brand, minPrice, maxPrice, minYear, maxYear, category, country, condition, transmission, search, sortBy, sortOrder
- `GET /api/trucks/:id` - Get single truck by ID
- `GET /api/filters` - Get available filter options

### Contacts
- `POST /api/contacts` - Submit contact form for a truck listing

### Health Check
- `GET /api/health` - API health status

## Project Structure

```
truckplatfourm/
├── server/
│   ├── index.js          # Express server & API routes
│   ├── database.js       # SQLite database setup
│   ├── seed.js           # Sample data seeder
│   └── trucks.db         # SQLite database (created after seeding)
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/   # Reusable components
│       │   ├── Header.js
│       │   ├── SearchBar.js
│       │   ├── FilterSidebar.js
│       │   └── TruckCard.js
│       ├── pages/        # Page components
│       │   ├── Home.js
│       │   └── TruckDetail.js
│       ├── App.js
│       └── index.js
├── package.json
└── README.md
```

## Sample Data

The platform comes with 8 sample truck listings from various European countries:
- Mercedes-Benz, Volvo, MAN, Scania, DAF, Iveco, Renault
- Various categories: Tractor Units, Tippers
- Prices ranging from €32,000 to €68,000
- Different specifications and conditions

## Future Enhancements

- User authentication and authorization
- Advanced image gallery with multiple photos
- Favorites/Watchlist functionality
- Comparison tool for multiple trucks
- Multi-language support
- Payment integration
- Seller dashboard for managing listings
- Advanced analytics and reporting
- Mobile app (React Native)
- Email notifications
- Social media integration

## License

ISC

## Author

TruckMarket Platform Demo
