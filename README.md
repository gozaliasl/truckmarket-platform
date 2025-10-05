# 🚛 TruckMarket Platform

A full-featured commercial truck sales platform similar to autoline.info and mobile.de, built with React and Node.js.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green)](https://nodejs.org/)

## ✨ Features

### 🔐 User Management
- **Three-Tier Registration System**: Free, Premium, and Professional accounts
- **JWT Authentication**: Secure token-based authentication
- **User Dashboard**: Personalized dashboard with statistics and quick actions
- **Profile Management**: Update personal and business information

### 🚛 Truck Listings
- **Advanced Search & Filters**: Search by brand, model, year, price, location, and more
- **My Listings Management**: View, edit, and delete your truck listings
- **AI-Powered Specification Extraction**: Auto-fill truck specs from descriptions
- **Image Upload**: Upload multiple images and videos for each listing
- **Detailed Specifications**: Comprehensive truck information with brand-specific fields

### 💳 Subscription & Payments
- **Multiple Billing Periods**: 1, 3, 6, and 12-month subscriptions with discounts
- **Stripe Integration**: Secure payment processing (ready to integrate)
- **Plan Management**: Upgrade, downgrade, or cancel anytime
- **Professional Dealer Pages**: Custom subdomain pages for professional users

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Filtering**: Instant results as you adjust filters
- **Modern UI**: Clean, professional interface with smooth animations
- **Demo Accounts**: Pre-configured accounts for testing

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gozaliasl/truckmarket-platform.git
cd truckmarket-platform

# Install dependencies
npm install
cd client && npm install && cd ..

# Set up demo data
chmod +x demo-registration.sh
./demo-registration.sh

# Start the application
# Terminal 1: Backend
node server/index.js

# Terminal 2: Frontend
cd client && npm start
```

**Access the app**: http://localhost:3000

**Demo Accounts**:
- Free: `free@demo.com` / `demo123`
- Premium: `premium@demo.com` / `demo123`
- Professional: `professional@demo.com` / `demo123`

---

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](docs/) folder:

### 🚀 [Getting Started](docs/getting-started/)
- [Quick Start Guide](docs/getting-started/QUICK_START.md) - Get running in 5 minutes
- [Installation Guide](docs/getting-started/INSTALLATION.md) - Detailed setup instructions
- [How to Run](docs/getting-started/HOW_TO_RUN.md) - Start the application
- [Demo Guide](docs/getting-started/DEMO_GUIDE.md) - Test with demo accounts

### ✨ [Features](docs/features/)
- [Dashboard Overview](docs/features/DASHBOARD.md) - User dashboard features
- [User Registration](docs/features/USER_REGISTRATION.md) - Three-tier system
- [Premium Features](docs/features/PREMIUM_FEATURES.md) - Advanced functionality
- [New Features](docs/features/NEW_FEATURES.md) - Recently added features

### 🚢 [Deployment](docs/deployment/)
- [GitHub Setup](docs/deployment/GITHUB_SETUP.md) - Push to GitHub
- [Push Guide](docs/deployment/PUSH_TO_GITHUB.md) - Step-by-step instructions
- [Complete Setup](docs/deployment/COMPLETE_SETUP.md) - Production deployment

### 📖 [Complete Guide](FINAL_GUIDE.md)
- Comprehensive overview of the entire platform

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- React Router v6
- Context API for state management
- Axios for API calls
- Custom responsive CSS

**Backend**
- Node.js & Express.js
- SQLite database
- JWT authentication with bcrypt
- RESTful API architecture

**Features**
- AI-powered specification extraction
- Image upload capability
- Multi-tier subscription system
- Payment integration (Stripe-ready)

---

## 📦 Project Structure

```
truckmarket-platform/
├── client/                    # React frontend
│   ├── public/
│   └── src/
│       ├── components/        # Reusable components
│       ├── context/          # React Context (Auth)
│       ├── pages/            # Page components (12 pages)
│       └── App.js
├── server/                   # Node.js backend
│   ├── index.js             # Express server & API
│   ├── auth.js              # Authentication logic
│   ├── database.js          # SQLite setup
│   └── seed.js              # Sample data
├── docs/                     # Documentation
│   ├── getting-started/     # Setup guides
│   ├── features/            # Feature documentation
│   ├── deployment/          # Deployment guides
│   └── README.md            # Documentation index
├── demo-registration.sh      # Demo account setup
└── package.json
```

---

## 🎯 Subscription Tiers

| Tier | Listings | Price/Month | Features |
|------|----------|-------------|----------|
| **Free** | 5 | €0 | Basic listings, search, contact form |
| **Premium** | 25 | €29.99 | Featured listings, analytics, priority support |
| **Professional** | Unlimited | €99.99 | Custom dealer page, subdomain, API access |

**Discounts available**: 10% (3mo), 20% (6mo), 40% (12mo)

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Trucks
- `GET /api/trucks` - Get all trucks (with filters)
- `GET /api/trucks/:id` - Get single truck
- `GET /api/my-trucks` - Get user's trucks
- `POST /api/my-trucks` - Create truck listing
- `PUT /api/my-trucks/:id` - Update truck
- `DELETE /api/my-trucks/:id` - Delete truck

### Professional Dealers
- `GET /api/dealers/:subdomain` - Get dealer page

See [API Documentation](docs/guides/API.md) for detailed endpoint information.

---

## 🧪 Testing

```bash
# Run with demo accounts
./demo-registration.sh

# Test login
- Free: free@demo.com / demo123
- Premium: premium@demo.com / demo123
- Professional: professional@demo.com / demo123

# Test features
- Dashboard: http://localhost:3000/dashboard
- My Listings: http://localhost:3000/my-listings
- Add Listing: http://localhost:3000/add-listing
- Subscription: http://localhost:3000/subscription
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👥 Author

**TruckMarket Platform**  
GitHub: [@gozaliasl](https://github.com/gozaliasl)

---

## 🙏 Acknowledgments

- Inspired by autoline.info and mobile.de
- Built with modern web technologies
- AI-powered features for enhanced UX

---

## 📞 Support

- 📖 Check the [Documentation](docs/)
- 🐛 Report bugs via [GitHub Issues](https://github.com/gozaliasl/truckmarket-platform/issues)
- 💬 Discussions on [GitHub Discussions](https://github.com/gozaliasl/truckmarket-platform/discussions)

---

**⭐ If you like this project, please give it a star on GitHub!**
