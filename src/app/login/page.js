'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkAuth, clearError } from '@/store/slices/authSlice';
import { isAuthenticated, getAuthToken, setAuthCookies } from '@/lib/cookies';
import Cookies from 'js-cookie';
import { loginAction } from './actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shouldRedirectToRegister, setShouldRedirectToRegister] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);

  // Check if we have a callback code from Upstox
  const callbackCode = searchParams.get('callback_code');

  // State to track if we're checking authentication
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Use client-side only state to track if we're in the browser
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Force check for token on every render, but only on client-side
  useEffect(() => {
    // Skip on server-side rendering
    if (!isBrowser) return;

    // Check if authenticated via cookies
    const isAuth = isAuthenticated();
    if (process.env.NODE_ENV !== 'production') {
      console.log('Login Page - Auth check:', { isAuth, isAuthenticatedState });
    }

    // If we have a token cookie or Redux state shows authenticated, redirect to dashboard
    if (isAuth || isAuthenticatedState) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Login Page - Already authenticated, redirecting to dashboard');
      }
      router.push('/dashboard');
      return;
    }

    // If we get here, we're not authenticated and should show the login form
    if (process.env.NODE_ENV !== 'production') {
      console.log('Login Page - Not authenticated, showing login form');
    }

    // Clear any previous errors when showing the form
    if (error) {
      dispatch(clearError());
    }
  }, [router, isAuthenticatedState, isBrowser, dispatch, error]);

  // Handle redirect to register if needed
  useEffect(() => {
    if (shouldRedirectToRegister) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('Login Page - Redirecting to register page');
      }
      router.push(`/register?email=${encodeURIComponent(email)}`);
    }
  }, [shouldRedirectToRegister, router, email]);

  // Also check on mount to update Redux state if needed
  useEffect(() => {
    if (!sessionChecked && !isCheckingAuth) {
      const token = Cookies.get('token');
      if (token) {
        setIsCheckingAuth(true);
        dispatch(checkAuth())
          .finally(() => {
            setIsCheckingAuth(false);
          });
      }
    }
  }, [dispatch, sessionChecked, isCheckingAuth]);

  useEffect(() => {
    // Store the callback code in localStorage if it exists
    if (callbackCode) {
      localStorage.setItem('upstox_callback_code', callbackCode);
      console.log('Stored callback code in localStorage:', callbackCode);
    }
  }, [callbackCode]);

  // Memoize the submit handler to avoid recreating it on every render
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      console.log('Login Page - Attempting login with server action:', { email });

      // Clear any previous errors
      dispatch(clearError());

      // Use server action directly (bypass API)
      const result = await loginAction({ email, password });
      console.log('Login Page - Server action result:', result);

      if (result && result.success) {
        console.log('Login Page - Login successful via server action');

        // Set cookies on the client side
        setAuthCookies(result.token, result.user);

        // Also set cookies directly as a fallback
        document.cookie = `token=${result.token}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `user_info=${JSON.stringify(result.user)}; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Lax`;

        // Update Redux state
        dispatch({
          type: 'auth/loginUser/fulfilled',
          payload: result
        });

        // Check if we have a stored callback code
        const storedCallbackCode = localStorage.getItem('upstox_callback_code');

        if (storedCallbackCode) {
          // Clear the stored code
          localStorage.removeItem('upstox_callback_code');

          // Redirect to the callback URL with the code and userId
          router.push(`/api/upstox/callback?code=${storedCallbackCode}&userId=${result.user.id}`);
        } else {
          // Normal login flow
          router.push('/dashboard');
        }
      } else {
        console.log('Login Page - Login failed via server action:', result);

        // Set error in Redux state
        dispatch({
          type: 'auth/loginUser/rejected',
          payload: { error: result?.error || 'Login failed' }
        });

        // Check if the error is about invalid credentials
        if (result?.error === 'Invalid credentials') {
          console.log('Login Page - Invalid credentials detected, offering account creation');

          // Show a confirmation dialog to create a new account
          const confirmCreate = window.confirm(
            'Account not found. Would you like to create a new account with this email?'
          );

          if (confirmCreate) {
            setShouldRedirectToRegister(true);
          }
        }
      }
    } catch (error) {
      console.log('Login Page - Error during login - Full error:', error);

      // Log error details safely
      const errorDetails = {
        message: error?.message || 'Unknown error',
        name: error?.name || 'Error',
        stack: error?.stack || 'No stack trace',
        toString: error?.toString ? error.toString() : 'Error cannot be converted to string'
      };

      console.error('Login Page - Error during login:', errorDetails);

      // Set a generic error message if something went wrong
      dispatch({
        type: 'auth/loginUser/rejected',
        payload: { error: 'Login failed. Please check your connection and try again.' }
      });
    }
  }, [email, password, dispatch, router, clearError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error === 'Invalid credentials'
                  ? 'Invalid email or password. If you don\'t have an account, you can register below.'
                  : error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
