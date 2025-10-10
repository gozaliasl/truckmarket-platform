import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeNew from './pages/HomeNew';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Subscription from './pages/Subscription';
import AdminDashboard from './pages/AdminDashboard';

// Lazy-loaded components for better performance
import {
  LazyTruckDetail,
  LazyLogin,
  LazyAbout,
  LazyAIDemo,
  LazyTermsConditions,
  LazyCarsPage,
  LazyMotorcyclesPage,
  LazyEBikesPage,
  LazyCaravansPage,
  LazySecurityDashboard,
  LazyPerformanceDashboard,
  LazyAdvancedAI,
  preloadCriticalComponents
} from './components/LazyComponents';

import PerformanceMonitor from './components/PerformanceMonitor';
import './App.css';

function App() {
  // Preload critical components after initial render
  useEffect(() => {
    // Preload critical components after a short delay
    const timer = setTimeout(() => {
      preloadCriticalComponents();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <PerformanceMonitor showDetails={false} />
          <Routes>
            <Route path="/" element={<HomeNew />} />
            <Route path="/truck/:id" element={<LazyTruckDetail />} />
            <Route path="/login" element={<LazyLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<LazyAbout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/ai-demo" element={<LazyAIDemo />} />
            <Route path="/terms-conditions" element={<LazyTermsConditions />} />
            <Route path="/security-dashboard" element={<LazySecurityDashboard />} />
            <Route path="/performance-dashboard" element={<LazyPerformanceDashboard />} />
            <Route path="/advanced-ai" element={<LazyAdvancedAI />} />
            <Route path="/cars" element={<LazyCarsPage />} />
            <Route path="/car/:id" element={<LazyTruckDetail />} />
            <Route path="/motorcycles" element={<LazyMotorcyclesPage />} />
            <Route path="/motorcycle/:id" element={<LazyTruckDetail />} />
            <Route path="/ebikes" element={<LazyEBikesPage />} />
            <Route path="/ebike/:id" element={<LazyTruckDetail />} />
            <Route path="/caravans" element={<LazyCaravansPage />} />
            <Route path="/caravan/:id" element={<LazyTruckDetail />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
