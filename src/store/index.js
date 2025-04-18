import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Import reducers
import counterReducer from './slices/counterSlice';

export const store = configureStore({
  reducer: {
    // Add reducers here
    counter: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Enable listener behavior for the store
setupListeners(store.dispatch);

export default store;
