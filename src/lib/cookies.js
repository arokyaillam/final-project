'use client';

import Cookies from 'js-cookie';

// Cookie names
export const TOKEN_COOKIE = 'token';
export const USER_COOKIE = 'user';

// Cookie options
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // Changed to lax for better compatibility
  expires: 1 // 1 day
};

// Debug cookie access
console.log('Cookies module loaded, checking for token cookie');
try {
  const token = Cookies.get('token');
  console.log('Cookies module - Token cookie:', token ? 'Found' : 'Not found');
} catch (error) {
  console.error('Cookies module - Error checking token:', error);
}

/**
 * Set authentication cookies
 * @param {string} token - JWT token
 * @param {Object} user - User data (will be stringified)
 */
export const setAuthCookies = (token, user) => {
  console.log('Cookies - Setting auth cookies');
  Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
  Cookies.set(USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);
  console.log('Cookies - Auth cookies set successfully');
};

/**
 * Get authentication token from cookies
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  const token = Cookies.get(TOKEN_COOKIE) || null;
  console.log('Cookies - Getting auth token:', token ? 'Found' : 'Not found');
  return token;
};

/**
 * Get user data from cookies
 * @returns {Object|null} The user data or null if not found
 */
export const getUserFromCookies = () => {
  const userCookie = Cookies.get(USER_COOKIE);
  console.log('Cookies - Getting user from cookies:', userCookie ? 'Found' : 'Not found');

  if (!userCookie) return null;

  try {
    const user = JSON.parse(userCookie);
    console.log('Cookies - User parsed successfully');
    return user;
  } catch (error) {
    console.error('Cookies - Error parsing user cookie:', error);
    return null;
  }
};

/**
 * Clear authentication cookies
 */
export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_COOKIE, { path: '/' });
  Cookies.remove(USER_COOKIE, { path: '/' });
};

/**
 * Check if user is authenticated based on cookies
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
  // Direct check for token cookie
  const token = Cookies.get('token');
  const hasToken = !!token;
  console.log('isAuthenticated check - Token cookie:', hasToken ? 'Found' : 'Not found');
  return hasToken;
};
