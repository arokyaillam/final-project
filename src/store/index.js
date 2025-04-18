import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';
import upstoxReducer from './slices/upstoxSlice';
import navigationReducer from './slices/navigationSlice';

export const store = configureStore({
  reducer: {
    // Add reducers here
    counter: counterReducer,
    auth: authReducer,
    upstox: upstoxReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export default store;
