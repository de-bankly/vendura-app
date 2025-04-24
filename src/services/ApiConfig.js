import axios from 'axios';

/**
 * Axios instance configured for API communication.
 * Includes base URL, default headers, timeout, and credential handling.
 * @type {import('axios').AxiosInstance}
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.vendura.me',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
  withCredentials: true,
});

/**
 * Request interceptor to automatically add the Authorization header
 * with the JWT token from localStorage if it exists.
 */
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

/**
 * Response interceptor to handle global errors.
 * Specifically handles 401 Unauthorized errors by clearing credentials
 * and redirecting to the login page. Also logs network errors.
 */
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.history.pushState({}, '', '/login');
      window.location.reload();
    }

    if (error.message === 'Network Error') {
      console.error('Network error detected. Server might be down or unreachable.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
