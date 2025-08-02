import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// Countries API
export const countriesAPI = {
  getAll: () => api.get('/countries'),
  getByCode: (code) => api.get(`/countries/${code}`),
};

// FAQs API
export const faqsAPI = {
  getAll: (category) => api.get('/faqs', { params: { category } }),
  search: (query, category) => api.get('/faqs/search', { params: { q: query, category } }),
};

// Visa Applications API
export const visaApplicationsAPI = {
  create: (applicationData) => api.post('/visa-applications', applicationData),
  getAll: () => api.get('/visa-applications'),
  getById: (id) => api.get(`/visa-applications/${id}`),
  update: (id, applicationData) => api.put(`/visa-applications/${id}`, applicationData),
  submit: (id) => api.post(`/visa-applications/${id}/submit`),
  delete: (id) => api.delete(`/visa-applications/${id}`),
};

// Auth utilities
export const authUtils = {
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },
  
  getToken: () => {
    return localStorage.getItem('auth_token');
  },
  
  removeToken: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
  },
  
  setUserId: (userId) => {
    localStorage.setItem('user_id', userId);
  },
  
  getUserId: () => {
    return localStorage.getItem('user_id');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  }
};

export default api;