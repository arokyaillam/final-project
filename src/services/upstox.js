import axios from 'axios';

const UPSTOX_API_URL = 'https://api.upstox.com/v2';

// Create Upstox API instance
const upstoxApi = axios.create({
  baseURL: UPSTOX_API_URL,
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
upstoxApi.interceptors.request.use(
  (config) => {
    // Add token to headers if available
    const token = localStorage.getItem('upstox_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
upstoxApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle token expiration or other errors
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshToken = localStorage.getItem('upstox_refresh_token');
        if (refreshToken) {
          const response = await refreshAccessToken(refreshToken);
          if (response.access_token) {
            // Update tokens
            localStorage.setItem('upstox_access_token', response.access_token);
            localStorage.setItem('upstox_refresh_token', response.refresh_token);
            
            // Retry the original request
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
            return upstoxApi(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem('upstox_access_token');
        localStorage.removeItem('upstox_refresh_token');
      }
    }
    return Promise.reject(error);
  }
);

// Get authorization URL
export const getAuthorizationUrl = () => {
  const clientId = process.env.UPSTOX_CLIENT_ID;
  const redirectUri = process.env.UPSTOX_REDIRECT_URI;
  
  return `https://api.upstox.com/v2/login/authorization/dialog?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};

// Exchange authorization code for tokens
export const getAccessToken = async (code) => {
  try {
    const url = 'https://api.upstox.com/v2/login/authorization/token';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      'code': code,
      'client_id': process.env.UPSTOX_CLIENT_ID,
      'client_secret': process.env.UPSTOX_CLIENT_SECRET,
      'redirect_uri': process.env.UPSTOX_REDIRECT_URI,
      'grant_type': 'authorization_code',
    };
    
    const response = await axios.post(url, new URLSearchParams(data), { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    const url = 'https://api.upstox.com/v2/login/authorization/token';
    const headers = {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const data = {
      'refresh_token': refreshToken,
      'client_id': process.env.UPSTOX_CLIENT_ID,
      'client_secret': process.env.UPSTOX_CLIENT_SECRET,
      'grant_type': 'refresh_token',
    };
    
    const response = await axios.post(url, new URLSearchParams(data), { headers });
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await upstoxApi.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error.response?.data || error.message);
    throw error;
  }
};

// Get market data
export const getMarketData = async (instrumentKey) => {
  try {
    const response = await upstoxApi.get(`/market-quote/ltp?instrument_key=${instrumentKey}`);
    return response.data;
  } catch (error) {
    console.error('Error getting market data:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  getAuthorizationUrl,
  getAccessToken,
  refreshAccessToken,
  getUserProfile,
  getMarketData,
};
