import axios from 'axios';
import { AnalyticsData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebase-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const analyticsAPI = {
  getSummary: async (userId: string, month?: string): Promise<AnalyticsData> => {
    const params = month ? { month } : {};
    const response = await api.get(`/analytics/summary/${userId}`, { params });
    return response.data;
  },

  getSuggestions: async (userId: string): Promise<AnalyticsData['suggestions']> => {
    const response = await api.get(`/analytics/suggestions/${userId}`);
    return response.data;
  },

  getTrends: async (userId: string, months: number = 6): Promise<AnalyticsData['trends']> => {
    const response = await api.get(`/analytics/trends/${userId}`, {
      params: { months }
    });
    return response.data;
  }
};

export default api;