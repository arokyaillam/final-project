import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Async thunks
export const fetchUpstoxToken = createAsyncThunk(
  'upstox/fetchToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/upstox/token');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch Upstox token' });
    }
  }
);

export const connectToUpstox = createAsyncThunk(
  'upstox/connect',
  async (userId, { rejectWithValue }) => {
    try {
      // Get authorization URL
      const response = await api.get('/upstox/auth');

      // Store userId in localStorage for the callback
      if (userId) {
        localStorage.setItem('upstox_user_id', userId);
      }

      // Open authorization URL in the same window to maintain session cookies
      window.location.href = response.data.authorizationUrl;

      return { initiated: true };
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to connect to Upstox' });
    }
  }
);

// Initial state
const initialState = {
  token: null,
  isConnected: false,
  connectedAt: null,
  accessToken: null,
  tokenType: null,
  expiresIn: null,
  expiresAt: null,
  loading: false,
  error: null,
};

// Upstox slice
const upstoxSlice = createSlice({
  name: 'upstox',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUpstoxState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch token cases
      .addCase(fetchUpstoxToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpstoxToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
        // Set isConnected based on the response
        state.isConnected = action.payload.isConnected !== false; // If isConnected is explicitly false, use that value
        state.connectedAt = action.payload.connectedAt || null;
        state.accessToken = action.payload.accessToken || null;
        state.tokenType = action.payload.tokenType || null;
        state.expiresIn = action.payload.expiresIn || null;
        state.expiresAt = action.payload.expiresAt || null;
      })
      .addCase(fetchUpstoxToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch Upstox token';
        // Set isConnected to false on any error
        state.isConnected = false;
      })

      // Connect to Upstox cases
      .addCase(connectToUpstox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(connectToUpstox.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(connectToUpstox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to connect to Upstox';
      });
  },
});

export const { clearError, resetUpstoxState } = upstoxSlice.actions;

export default upstoxSlice.reducer;
