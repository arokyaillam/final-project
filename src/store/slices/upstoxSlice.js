import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Async thunks
export const fetchUpstoxToken = createAsyncThunk(
  'upstox/fetchToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/upstox/token');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Failed to fetch Upstox token' });
    }
  }
);

export const connectToUpstox = createAsyncThunk(
  'upstox/connect',
  async (_, { rejectWithValue }) => {
    try {
      // Get authorization URL
      const response = await api.get('/api/upstox/auth');
      
      // Open authorization URL in new window
      window.open(response.data.authorizationUrl, '_blank');
      
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
        state.isConnected = true;
      })
      .addCase(fetchUpstoxToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch Upstox token';
        // Only set isConnected to false if it's a 404 (token not found)
        if (action.payload?.status === 404) {
          state.isConnected = false;
        }
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
