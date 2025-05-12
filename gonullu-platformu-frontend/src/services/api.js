import axios from 'axios';

// Backend URL'ini .env'den al veya direkt belirt
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api', // Backend portunuza göre güncelleyin (5000/5001)
  withCredentials: true
});

// Örnek API fonksiyonları
export const getEvents = () => API.get('/events');
export const createEvent = (eventData) => API.post('/events', eventData);
export const login = (credentials) => API.post('/auth/login', credentials);