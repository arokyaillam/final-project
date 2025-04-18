'use client';

import Cookies from 'js-cookie';

// Cookie names
export const TOKEN_COOKIE = 'token';
export const USER_COOKIE = 'user';

// Cookie options
const COOKIE_OPTIONS = {
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: 1 // 1 day
};

/**
 * Set authentication cookies
 * @param {string} token - JWT token
 * @param {Object} user - User data (will be stringified)
 */
export const setAuthCookies = (token, user) => {
  Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
  Cookies.set(USER_COOKIE, JSON.stringify(user), COOKIE_OPTIONS);
};

/**
 * Get authentication token from cookies
 * @returns {string|null} The token or null if not found
 */
export const getAuthToken = () => {
  return Cookies.get(TOKEN_COOKIE) || null;
};

/**
 * Get user data from cookies
 * @returns {Object|null} The user data or null if not found
 */
export const getUserFromCookies = () => {
  const userCookie = Cookies.get(USER_COOKIE);
  if (!userCookie) return null;
  
  try {
    return JSON.parse(userCookie);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
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
  return !!getAuthToken();
};
