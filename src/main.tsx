import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Configure axios defaults
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Get token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);