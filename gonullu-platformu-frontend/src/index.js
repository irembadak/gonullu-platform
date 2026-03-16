import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import reportWebVitals from './reportWebVitals';
import 'leaflet/dist/leaflet.css'; // Harita için olmazsa olmaz

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        {/* Projenin kalbi burada atıyor */}
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);

// Uygulama performansını ölçmek istersen içine bir fonksiyon (örn: console.log) yazabilirsin.
reportWebVitals();