import axios from 'axios';
import keycloak from '../keycloak';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL, // Gateway URL
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const api = {

  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/api/users/${userId}`);
    return response.data;
  },

  updateHealthData: async (userId, healthData) => {
    const response = await apiClient.put(`/api/users/${userId}/update-health`, healthData);
    return response.data;
  },

  
  getUserAnalytics: async (userId) => {
    const response = await apiClient.get(`/api/analytics/user/${userId}`);
    return response.data;
  },

  logActivity: async (activityData) => {
    const response = await apiClient.post('/api/activities', activityData);
    return response.data; 
  },

  getActivityRecommendation: async (activityId) => {
    const response = await apiClient.get(`/api/finalRecommendations/activity/${activityId}`);
    return response.data;
  },

  getUserRecommendations: async (userId) => {
    const response = await apiClient.get(`/api/finalRecommendations/user/${userId}`);
    return response.data;
  }
};

export default api;