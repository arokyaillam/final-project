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
export const getAuthorizationUrl = async (clientId, redirectUri) => {
  try {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/login/authorization/dialog',
      headers: {}
    };

    // Add query parameters
    config.url += `?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error getting authorization URL:', error);
    throw error;
  }
};

// Exchange authorization code for tokens
export const getAccessToken = async (code, clientId, clientSecret, redirectUri) => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/login/authorization/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: new URLSearchParams({
        'code': code,
        'client_id': clientId,
        'client_secret': clientSecret,
        'redirect_uri': redirectUri,
        'grant_type': 'authorization_code'
      }).toString()
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken, clientId, clientSecret) => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.upstox.com/v2/login/authorization/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      data: new URLSearchParams({
        'refresh_token': refreshToken,
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'refresh_token'
      }).toString()
    };

    const response = await axios(config);
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
