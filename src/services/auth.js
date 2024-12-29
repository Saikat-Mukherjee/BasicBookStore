// src/services/auth.js

import { useNavigate } from 'react-router-dom';
import api from './api';

export const loginUser = async (username, password) => {
  try {
    const response = await api.post(`/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    console.log('Login response:', response.data);
    console.log('Login response og :', response);
    //const { token } = response.data;
    const token = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = (navigate) => {
  localStorage.removeItem('token');
  navigate('/login');
};
