import axios from 'axios';

// Local dev: http://localhost:5000
// Production: Render ka URL (Vercel env variable mein set karo)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const register = async (username, password) => {
  const response = await api.post('/register', { username, password });
  return response.data;
};
