import axios from 'axios';

const resolvedBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : 'https://makebuddy.livoras.online/');

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Device': 'mobile',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bonus_buddy_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['X-Screen-Width'] = `${window.innerWidth}`;
  return config;
});

export default api;