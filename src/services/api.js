import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from cookies
    const token = Cookies.get('token');

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message
    });

    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log('Authentication error detected, redirecting to login');
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
