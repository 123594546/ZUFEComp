import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' });
http.interceptors.request.use((config) => {
  const store = useAuthStore();
  if (store.token) config.headers.Authorization = `Bearer ${store.token}`;
  return config;
});
