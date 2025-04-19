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

    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token
      });
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('API Response:', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText
      });
    }
    return response;
  },
  (error) => {
    // Handle errors globally
    if (process.env.NODE_ENV !== 'production') {
      // Don't log canceled requests as errors
      if (error.message !== 'canceled' && error.name !== 'AbortError') {
        console.log('API Response Error - Full error object:', error);
        console.error('API Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          data: error.response?.data || 'No data',
          stack: error.stack
        });
      } else {
        console.log('API Request canceled:', {
          url: error.config?.url,
          message: error.message
        });
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Authentication error detected');
      }

      // Special handling for login page - don't redirect
      if (error.config?.url === '/auth/login') {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Login attempt failed with 401, not redirecting');
          console.log('Login error details:', {
            response: error.response,
            data: error.response?.data,
            message: error.message
          });
        }

        // Create a standardized error object
        const errorData = error.response?.data || { error: 'Invalid credentials' };

        // Just pass through the error for the login page to handle
        return Promise.reject({
          ...error,
          response: {
            ...error.response,
            data: errorData
          },
          // Add a custom property to make it easier to identify this error
          isLoginError: true
        });
      }

      // For other pages, redirect to login
      // Only redirect if we're in the browser
      if (typeof window !== 'undefined') {
        // Don't redirect if we're already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Don't reject canceled requests in certain cases
    if ((error.message === 'canceled' || error.name === 'AbortError') &&
        error.config?.url === '/api/auth/verify') {
      // For auth verification, we'll handle this in the auth slice
      if (process.env.NODE_ENV !== 'production') {
        console.log('Auth verification request canceled, handling gracefully');
      }
      // Return a default response instead of rejecting
      return Promise.resolve({
        data: { status: 'canceled', message: 'Request canceled but proceeding' }
      });
    }

    return Promise.reject(error);
  }
);

export default api;
