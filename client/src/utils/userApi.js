import axios from 'axios';

// Mirrors client/src/utils/api.js but for the student/teacher account system
// (kept completely separate from the admin panel's token, so being logged
// into one never affects the other).
const baseURL = import.meta.env.VITE_API_URL || '';

const userApi = axios.create({ baseURL });

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default userApi;
