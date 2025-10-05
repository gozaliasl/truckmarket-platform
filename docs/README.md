# TruckMarket Platform Documentation

Welcome to the TruckMarket Platform documentation! This guide will help you understand, install, and develop with our full-featured truck marketplace.

## 📚 Documentation Structure

### 🚀 Getting Started
Quick setup and installation guides to get you running in minutes.

- **[Quick Start](getting-started/QUICK_START.md)** - 5-minute setup guide
- **[Installation Guide](getting-started/INSTALLATION.md)** - Complete installation instructions
- **[How to Run](getting-started/HOW_TO_RUN.md)** - Start the application
- **[Demo Guide](getting-started/DEMO_GUIDE.md)** - Test with demo accounts

### ✨ Features
Detailed documentation of all platform features.

- **[Dashboard](features/DASHBOARD.md)** - User dashboard overview
- **[User Registration](features/USER_REGISTRATION.md)** - Three-tier registration system
- **[Premium Features](features/PREMIUM_FEATURES.md)** - Advanced features guide
- **[New Features](features/NEW_FEATURES.md)** - Recently added features

### 🚢 Deployment
Guides for deploying and managing the platform.

- **[GitHub Setup](deployment/GITHUB_SETUP.md)** - Push to GitHub
- **[Push to GitHub](deployment/PUSH_TO_GITHUB.md)** - Step-by-step push guide
- **[Complete Setup](deployment/COMPLETE_SETUP.md)** - Production deployment

### 📖 Development Guides
In-depth guides for developers.

- **[Architecture Overview](guides/ARCHITECTURE.md)** - System architecture
- **[API Documentation](guides/API.md)** - Backend API reference
- **[Testing Guide](guides/TESTING.md)** - How to test the platform

---

## 🎯 Quick Links

**Just want to get started?**  
→ Go to [Quick Start](getting-started/QUICK_START.md)

**Need to install from scratch?**  
→ Go to [Installation Guide](getting-started/INSTALLATION.md)

**Want to push to GitHub?**  
→ Go to [Push to GitHub](deployment/PUSH_TO_GITHUB.md)

**Looking for specific features?**  
→ Check [Features Documentation](features/)

---

## 📋 What's in the Platform?

### Frontend (React)
- 12 pages including Dashboard, My Listings, Add/Edit Listing, Subscription
- Complete authentication system with JWT
- Responsive design for all devices
- AI-powered truck specification extraction

### Backend (Node.js/Express)
- RESTful API with full CRUD operations
- User authentication and authorization
- Three-tier subscription system (Free, Premium, Professional)
- SQLite database

### Features
- User registration with tier selection
- Truck listing management (create, read, update, delete)
- Image upload capability
- Subscription management with multiple billing periods
- Professional dealer pages with custom subdomains
- Payment integration (Stripe-ready)

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Context API
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Authentication**: JWT with bcrypt
- **Styling**: Custom CSS with responsive design

---

## 👥 Demo Accounts

All demo accounts use password: `demo123`

| Email | Tier | Listings | Features |
|-------|------|----------|----------|
| free@demo.com | Free | 0/5 | Basic features |
| premium@demo.com | Premium | 0/25 | Featured listings, analytics |
| professional@demo.com | Professional | 3/999 | Custom dealer page, unlimited |

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check existing documentation
- Review the guides in this documentation

---

## 🎉 Happy Coding!

Start with the [Quick Start Guide](getting-started/QUICK_START.md) and you'll be up and running in no time!
