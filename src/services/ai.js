// src/services/api.js
import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.10.6:8080',
  //baseURL: 'http://192.168.189.252:8080',
  //baseURL: 'http://192.168.1.4:5000',
  baseURL: 'http://localhost:5000',
});

 api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

/* api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response && error.response.status === 401) {
    // Handle unauthorized error
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}); */

export default api;
