import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css'; 

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        {/* */}
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();