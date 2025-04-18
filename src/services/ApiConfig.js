import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add 10 second timeout
  // Enable withCredentials for authentication requests
  withCredentials: true,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location = '/login';
    }

    // Check for network errors
    if (error.message === 'Network Error') {
      console.error('Network error detected. Server might be down or unreachable.');
      // You could dispatch an action to show a global notification here
    }

    return Promise.reject(error);
  }
);

export default apiClient;
