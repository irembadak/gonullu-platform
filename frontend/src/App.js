import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { messaging, registerServiceWorker } from './firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import VolunteerActivities from './pages/VolunteerActivities';
import EmergencySupport from './pages/EmergencySupport';
import TransportationSupport from './pages/TransportationSupport';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Login from './pages/Login';
import Recommend from './pages/Recommend';
import Emergency from './pages/Emergency';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import ActivityDetail from './pages/ActivityDetail'; 
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useToast } from './hooks/useToast';
import { useNotification } from './utils/NotificationHandler';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#3498db' },
    secondary: { main: '#2c3e50' },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
});

function App() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const notificationService = useNotification();

  useEffect(() => {
    registerServiceWorker();

    const registerFCM = async () => {
      try {
        const token = await getToken(messaging, {
          vapidKey: process.env.REACT_APP_VAPID_KEY,
        });
        if (token && currentUser) {
          await notificationService.registerToken(token);
        }
      } catch (error) {
        console.error('FCM Token Hatası:', error);
      }
    };

    const setupNotifications = () => {
      onMessage(messaging, (payload) => {
        toast({
          title: payload.notification.title,
          description: payload.notification.body,
          status: "info",
        });
      });
    };

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        registerFCM();
        setupNotifications();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [currentUser, notificationService, toast]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Router>
        <div className="app">
          <Navbar />
          <main className="content">
            <Routes>
              {/* Herkese Açık Rotalar */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Giriş Yapmış Kullanıcılar İçin Korumalı Rotalar */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/recommend" element={<Recommend />} />
                <Route path="/activities" element={<VolunteerActivities />} />
                
                {/*  DETAY SAYFASI ROTASI --- */}
                <Route path="/activity/:id" element={<ActivityDetail />} />
                
                <Route path="/emergency-support" element={<EmergencySupport />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/transportation" element={<TransportationSupport />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Sadece Adminler İçin Korumalı Rota */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;