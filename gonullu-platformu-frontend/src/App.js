import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VolunteerActivities from './pages/VolunteerActivities';
import EmergencySupport from './pages/EmergencySupport';
import TransportationSupport from './pages/TransportationSupport';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/activities" element={<VolunteerActivities />} />
            <Route path="/emergency" element={<EmergencySupport />} />
            <Route path="/transportation" element={<TransportationSupport />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
