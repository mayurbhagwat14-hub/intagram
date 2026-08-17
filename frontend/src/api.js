import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token is stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/me');
  return response.data;
};
