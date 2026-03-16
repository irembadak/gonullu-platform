import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3001/api', 
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// REQUEST INTERCEPTOR
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

// RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (res) => res, 
  (err) => {
    if (err.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); 
      window.location.href = '/login';
    }
    const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Bir hata oluştu';
    return Promise.reject(errorMessage);
  }
);

export const authService = {
  login: (credentials) => API.post('/users/login', credentials),
  register: (data) => API.post('/users/register', data),
  getMe: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
};

export const eventService = {
  getAll: (params) => API.get('/events', { params }),
  getById: (id) => API.get(`/events/${id}`),
  create: (data) => API.post('/events', data),
  join: (id) => API.post(`/events/${id}/join`),
  getRecommendations: () => API.get('/events/recommendations'), 
  getPending: () => API.get('/events/pending'), 
};

export const emergencyService = {
  report: (data) => API.post('/emergencies', data), 
  getAll: () => API.get('/emergencies'),
};

export const organizationService = {
  getAll: () => API.get('/organizations'),
  getById: (id) => API.get(`/organizations/${id}`),
  create: (data) => API.post('/organizations', data), 
  getPending: () => API.get('/organizations/admin/pending'),
  verify: (id, status) => API.patch(`/organizations/${id}/verify`, { status }),
};

export const transportService = {
  getAll: (params) => API.get('/transport', { params }),
  create: (data) => API.post('/transport', data),
  update: (id, data) => API.patch(`/transport/${id}`, data),
  delete: (id) => API.delete(`/transport/${id}`),
};

export default API;