import axios from 'axios';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, InvoiceRequest, InvoiceResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      console.log('Login API call with data:', data);
      const response = await api.post('/auth/login', data);
      console.log('Login API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    try {
      console.log('Register API call with data:', data);
      const response = await api.post('/auth/register', data);
      console.log('Register API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register API error:', error);
      throw error;
    }
  },
};

export const invoiceAPI = {
  generatePDF: async (data: InvoiceRequest): Promise<ApiResponse<InvoiceResponse>> => {
    try {
      console.log('Generate PDF API call with data:', data);
      const response = await api.post('/invoice/generate', data);
      console.log('Generate PDF API response received');
      return response.data;
    } catch (error: any) {
      console.error('Generate PDF API error:', error);
      throw error;
    }
  },
};

export default api;