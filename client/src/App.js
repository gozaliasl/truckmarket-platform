import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import HomeNew from './pages/HomeNew';
import TruckDetail from './pages/TruckDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import MyListings from './pages/MyListings';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import Subscription from './pages/Subscription';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomeNew />} />
            <Route path="/truck/:id" element={<TruckDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
