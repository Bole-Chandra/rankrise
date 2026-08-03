import axios from 'axios';

// In local dev, Vite's proxy (see vite.config.js) forwards '/api' to the
// backend, so an empty base URL works fine. In production, set
// VITE_API_URL in your build environment if the frontend and backend are
// deployed on different domains/subdomains on Hostinger (e.g.
// VITE_API_URL=https://api.rankrise.in). If they're deployed together
// (server/app.js serving client/dist), leave it unset — relative '/api'
// calls will work automatically.
const baseURL = import.meta.env.VITE_API_URL || '';

const api = axios.create({ baseURL });

// Automatically attach the admin JWT (if present) to every request, and
// automatically log the admin out if the token has expired.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
