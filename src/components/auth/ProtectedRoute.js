'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated, getUserFromCookies, getAuthToken } from '@/lib/cookies';

/**
 * A wrapper component that protects routes requiring authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} The protected route
 */
export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid flash
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Use client-side only state to track if we're in the browser
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Authentication check effect
  useEffect(() => {
    // Skip on server-side rendering
    if (!isBrowser) return;

    // If already authenticated in Redux state, we're good
    if (isAuthenticatedState) {
      console.log('ProtectedRoute - Already authenticated in Redux state');
      return;
    }

    // If session checked and not authenticated, redirect to login
    if (sessionChecked && !isAuthenticatedState) {
      console.log('ProtectedRoute - Session checked and not authenticated, redirecting');
      router.push('/login');
      return;
    }

    // Quick check for cookies before doing a full verification
    const hasToken = isAuthenticated();

    if (!hasToken) {
      console.log('ProtectedRoute - No valid cookies found, redirecting');
      router.push('/login');
      return;
    }

    // If we have cookies but session not checked yet, start verification
    if (!sessionChecked && !authCheckComplete) {
      setIsLoading(true);
      setAuthCheckComplete(true);

      // Set a short timeout for the verification
      const timeoutId = setTimeout(() => {
        console.log('ProtectedRoute - Verification taking too long, showing content anyway');
        setIsLoading(false);
        // We don't redirect here - just show content and let verification continue in background
      }, 1000); // Just 1 second timeout for better UX

      // Start verification in background
      dispatch(checkAuth())
        .unwrap()
        .then(() => {
          clearTimeout(timeoutId);
          setIsLoading(false);
          console.log('ProtectedRoute - Verification successful');
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error('ProtectedRoute - Verification failed:', error);
          setIsLoading(false);
          router.push('/login');
        });

      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, router, isAuthenticatedState, sessionChecked, authCheckComplete, isBrowser]);

  // Show loading state only briefly
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If we're in the browser and authenticated (either by Redux state or cookies)
  if (isBrowser && (isAuthenticatedState || isAuthenticated())) {
    console.log('ProtectedRoute - Authenticated, showing content');
    return children;
  }

  // On the server, always render content and let client-side handle auth
  // This prevents hydration errors
  if (!isBrowser) {
    return children;
  }

  // Fallback - if no cookies and not authenticated, return null (will redirect in useEffect)
  return null;
}
