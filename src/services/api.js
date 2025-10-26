import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your actual backend URL
const API_BASE_URL = 'http://192.168.1.10:8081/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  login: async (phoneNumber, pin) => {
    const response = await apiClient.post('/delivery/login', { 
      phoneNumber, 
      pin: parseInt(pin, 10) // Convert PIN to integer
    });
    return response.data;
  },
  
  requestOTP: async (phoneNumber) => {
    const response = await apiClient.post('/delivery/request-otp', { phoneNumber });
    return response.data;
  },
  
  verifyOTP: async (phoneNumber, otp) => {
    const response = await apiClient.post('/delivery/verify-otp', { 
      phoneNumber, 
      otp: parseInt(otp, 10) // Convert OTP to integer
    });
    return response.data;
  },
};

// Delivery APIs
export const deliveryAPI = {
  getActiveOrders: async () => {
    const response = await apiClient.get('/delivery/orders/active');
    return response.data;
  },
  
  getOrderHistory: async (limit = 20, offset = 0) => {
    const response = await apiClient.get('/delivery/orders/history', {
      params: { limit, offset },
    });
    return response.data;
  },
  
  getOrderDetails: async (orderId) => {
    const response = await apiClient.get(`/delivery/orders/${orderId}`);
    return response.data;
  },
  
  acceptOrder: async (orderId) => {
    const response = await apiClient.post(`/delivery/orders/${orderId}/accept`);
    return response.data;
  },
  
  updateOrderStatus: async (orderId, status, location) => {
    const response = await apiClient.post(`/delivery/orders/${orderId}/status`, {
      status,
      location,
    });
    return response.data;
  },
  
  completeDelivery: async (orderId, location, signature) => {
    const response = await apiClient.post(`/delivery/orders/${orderId}/complete`, {
      location,
      signature,
    });
    return response.data;
  },
};

// Profile APIs
export const profileAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/delivery/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/delivery/profile', profileData);
    return response.data;
  },
  
  updateLocation: async (latitude, longitude) => {
    const response = await apiClient.post('/delivery/location', {
      latitude,
      longitude,
    });
    return response.data;
  },
  
  toggleAvailability: async (isAvailable) => {
    const response = await apiClient.post('/delivery/availability', { isAvailable });
    return response.data;
  },
};

// Earnings APIs
export const earningsAPI = {
  getEarnings: async (period = 'week') => {
    const response = await apiClient.get('/delivery/earnings', {
      params: { period },
    });
    return response.data;
  },
  
  getEarningsHistory: async (limit = 50, offset = 0) => {
    const response = await apiClient.get('/delivery/earnings/history', {
      params: { limit, offset },
    });
    return response.data;
  },
};

export default apiClient;

