// src/services/api.js
import axios from 'axios';
const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  //baseURL: 'http://192.168.10.6:8080',
  //baseURL: 'http://192.168.189.252:8080',
  //baseURL: 'http://192.168.1.3:8080',
  //baseURL: 'http://localhost:8080',
  baseURL: apiURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  const status = error.response?.status;
  const requestUrl = error.config?.url || '';

  // Don't intercept auth endpoints — let the login/signup pages handle their own errors
  const isAuthRequest = requestUrl.includes('/users/login') || requestUrl.includes('/users/register');

  if (status === 401 && !isAuthRequest) {
    // Session expired or token invalid — clear token and redirect
    localStorage.removeItem('token');
    window.location.href = '/login?session=expired';
  }

  return Promise.reject(error);
});

export default api;
