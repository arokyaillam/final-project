import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { getAuthToken, getUserFromCookies, clearAuthCookies, setAuthCookies } from '@/lib/cookies';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);

      // Token is stored in HTTP-only cookie by the server

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Login failed' });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);

      // Token is stored in HTTP-only cookie by the server

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { error: 'Registration failed' });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Auth Slice - Logging out user');

      // 1. Clear auth cookies using our utility function
      console.log('Auth Slice - Clearing client-side cookies via utility');
      clearAuthCookies();

      // 2. Clear cookies by making a request to the server
      console.log('Auth Slice - Sending logout request to server');
      const response = await api.post('/auth/logout');
      console.log('Auth Slice - Server logout response:', response.data);

      // 3. Manually clear cookies using js-cookie as a fallback
      console.log('Auth Slice - Manually clearing cookies via js-cookie');
      if (typeof window !== 'undefined') {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user_info', { path: '/' });
      }

      // 4. Manually clear cookies using document.cookie as a second fallback
      console.log('Auth Slice - Manually clearing cookies via document.cookie');
      if (typeof window !== 'undefined') {
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
        document.cookie = 'user_info=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
      }

      // 5. Clear localStorage items related to auth
      console.log('Auth Slice - Clearing localStorage');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('upstox_access_token');
        localStorage.removeItem('upstox_token');
        // Clear any other potential auth-related items
        localStorage.removeItem('user');
        localStorage.removeItem('auth');
      }

      // 6. Clear sessionStorage items as well
      console.log('Auth Slice - Clearing sessionStorage');
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }

      console.log('Auth Slice - Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Auth Slice - Logout error:', error);

      // Even if the server request fails, we still want to clear client-side state
      clearAuthCookies();

      // Manually clear cookies using all available methods
      if (typeof window !== 'undefined') {
        // js-cookie
        Cookies.remove('token', { path: '/' });
        Cookies.remove('user_info', { path: '/' });

        // document.cookie
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
        document.cookie = 'user_info=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';

        // Clear storage
        localStorage.removeItem('upstox_access_token');
        localStorage.removeItem('upstox_token');
        sessionStorage.clear();
      }

      return rejectWithValue({ error: 'Logout failed' });
    }
  }
);

// Check if user is already authenticated from cookies
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Auth Slice - Checking authentication from cookies');

      // Get user info from cookies
      const user = getUserFromCookies();
      const token = getAuthToken();

      console.log('Auth Slice - Cookie check results:', {
        userFound: !!user,
        tokenFound: !!token
      });

      if (!user || !token) {
        console.log('Auth Slice - Missing user or token in cookies');
        return rejectWithValue({ error: 'Not authenticated' });
      }

      console.log('Auth Slice - Verifying token with server');

      // Verify token with server - add a timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

      try {
        // Verify token with server
        const response = await api.get('/auth/verify', {
          signal: controller.signal
        });

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        console.log('Auth Slice - Token verified successfully with server');
        return { user: response.data.user, token };
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError.name === 'AbortError') {
          console.error('Auth Slice - Token verification request timed out');
          return rejectWithValue({ error: 'Verification timed out' });
        }

        throw fetchError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error('Auth Slice - Authentication check failed:', error.message || 'Unknown error');

      // Clear cookies if verification fails
      console.log('Auth Slice - Clearing auth cookies due to verification failure');
      clearAuthCookies();

      return rejectWithValue({ error: 'Session expired' });
    }
  }
);

// Get initial state from cookies if available
const token = typeof window !== 'undefined' ? getAuthToken() : null;
const user = typeof window !== 'undefined' ? getUserFromCookies() : null;

// Initial state - assume authenticated if we have both token and user in cookies
// This provides a better UX by avoiding the loading state on refresh
const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token && !!user,
  loading: false,
  error: null,
  sessionChecked: false, // We'll still verify with the server, but assume valid initially
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionChecked = true;

        // Also store in client-side cookies for redundancy
        if (typeof window !== 'undefined') {
          setAuthCookies(action.payload.token, action.payload.user);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.error || 'Logout failed';
      })

      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.sessionChecked = true;

        // Log the user data for debugging
        console.log('Auth Slice - User data after checkAuth:', action.payload.user);
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.sessionChecked = true;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
