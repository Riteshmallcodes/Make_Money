import axios from 'axios';
import { readStoredAuth } from './authStorage';

const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const resolvedBaseUrl = import.meta.env.DEV ? '/api' : envBaseUrl || 'https://makemoney.livoras.online/';

const api = axios.create({
  baseURL: resolvedBaseUrl,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'X-Client-Device': 'mobile',
  },
});

api.defaults.transformRequest = [
  (data, headers) => {
    if (!data || typeof data !== 'object' || data instanceof FormData) {
      return data;
    }

    headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    const payload = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        payload.append(key, String(value));
      }
    });
    return payload.toString();
  },
  ...axios.defaults.transformRequest,
];

api.interceptors.request.use((config) => {
  config.headers['X-Screen-Width'] = `${window.innerWidth}`;
  const { token } = readStoredAuth();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

export default api;
