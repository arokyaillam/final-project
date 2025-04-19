'use client';

import Cookies from 'js-cookie';

// Cookie names
export const TOKEN_COOKIE = 'token';
export const USER_COOKIE = 'user_info'; // Changed to match the name used in the API

// Cookie options
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Changed to lax for better compatibility
  expires: 1 // 1 day
};

// Only run debug code on the client side in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  try {
    const token = Cookies.get('token');
    console.log('Cookies module - Token cookie:', token ? 'Found' : 'Not found');
  } catch (error) {
    console.error('Cookies module - Error checking token:', error);
  }
}

/**
 * Set authentication cookies
 * @param {string} token - JWT token
 * @param {Object} user - User data (will be stringified)
 */
export const setAuthCookies = (token, user) => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies - Setting auth cookies');
  }

  Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
  Cookies.set(USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies - Auth cookies set successfully');
  }
};

/**
 * Get authentication token from cookies
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  // Only run on client side
  if (typeof window === 'undefined') return null;

  const token = Cookies.get(TOKEN_COOKIE) || null;

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies - Getting auth token:', token ? 'Found' : 'Not found');
  }

  return token;
};

/**
 * Get user data from cookies
 * @returns {Object|null} The user data or null if not found
 */
export const getUserFromCookies = () => {
  // Only run on client side
  if (typeof window === 'undefined') return null;

  const userCookie = Cookies.get(USER_COOKIE);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies - Getting user from cookies:', userCookie ? 'Found' : 'Not found');
  }

  if (!userCookie) return null;

  try {
    const user = JSON.parse(userCookie);

    if (process.env.NODE_ENV !== 'production') {
      console.log('Cookies - User parsed successfully');
    }

    return user;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Cookies - Error parsing user cookie:', error);
    }
    return null;
  }
};

/**
 * Clear authentication cookies using multiple methods for redundancy
 */
export const clearAuthCookies = () => {
  // Only run on client side
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookies Utility - Clearing auth cookies');
  }

  // Method 1: Using js-cookie library
  Cookies.remove(TOKEN_COOKIE, { path: '/' });
  Cookies.remove(USER_COOKIE, { path: '/' });

  // Method 2: Using document.cookie directly
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;`;
  document.cookie = `${USER_COOKIE}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;`;

  // Method 3: Try with different paths
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(USER_COOKIE);
  document.cookie = `${TOKEN_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  document.cookie = `${USER_COOKIE}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

  // Log the result in development
  if (process.env.NODE_ENV !== 'production') {
    const tokenAfter = Cookies.get(TOKEN_COOKIE);
    const userAfter = Cookies.get(USER_COOKIE);
    console.log('Cookies Utility - After clearing:', {
      token: tokenAfter ? 'still exists' : 'cleared',
      user: userAfter ? 'still exists' : 'cleared'
    });
  }
};

/**
 * Check if user is authenticated based on cookies
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  // Only run on client side
  if (typeof window === 'undefined') return false;

  // Direct check for token cookie
  const token = Cookies.get(TOKEN_COOKIE);
  const hasToken = !!token;

  if (process.env.NODE_ENV !== 'production') {
    console.log('isAuthenticated check - Token cookie:', hasToken ? 'Found' : 'Not found');
  }

  return hasToken;
};
