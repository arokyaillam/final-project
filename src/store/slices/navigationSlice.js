import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  activeMainMenu: 'dashboard',
  activeSubMenu: 'profile',
  sidebarOpen: true,
  mobileMenuOpen: false,
};

// Navigation slice
const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveMainMenu: (state, action) => {
      state.activeMainMenu = action.payload;
      
      // Set default submenu based on main menu
      switch (action.payload) {
        case 'dashboard':
          state.activeSubMenu = 'profile';
          break;
        case 'marketData':
          state.activeSubMenu = 'watchlist';
          break;
        case 'strategy':
          state.activeSubMenu = 'addNew';
          break;
        case 'paperTrading':
          state.activeSubMenu = 'addNew';
          break;
        case 'optionData':
          state.activeSubMenu = 'optionChain';
          break;
        default:
          state.activeSubMenu = '';
      }
    },
    setActiveSubMenu: (state, action) => {
      state.activeSubMenu = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false;
    },
  },
});

// Export actions
export const {
  setActiveMainMenu,
  setActiveSubMenu,
  toggleSidebar,
  toggleMobileMenu,
  closeMobileMenu,
} = navigationSlice.actions;

// Export reducer
export default navigationSlice.reducer;
