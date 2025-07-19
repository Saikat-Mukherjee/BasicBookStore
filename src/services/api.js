// src/services/api.js
import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.10.6:8080',
  //baseURL: 'http://192.168.189.252:8080',
  //baseURL: 'http://192.168.1.3:8080',
  baseURL: 'http://localhost:8080',
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
  console.log('Response:', response);
  return response;
}, (error) => {
  console.error('Response error:', error);
  if (error.response && error.response.status === 401) {
    // Handle unauthorized error
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
