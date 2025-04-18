'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated } from '@/lib/cookies';

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
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckStarted, setAuthCheckStarted] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', {
      isAuthenticated: isAuthenticatedState,
      sessionChecked,
      hasCookies: isAuthenticated()
    });

    // If already authenticated, we're good to go
    if (isAuthenticatedState) {
      console.log('ProtectedRoute - Already authenticated, showing content');
      setIsLoading(false);
      return;
    }

    // If we've checked the session and not authenticated, redirect to login
    if (!isAuthenticatedState && sessionChecked) {
      console.log('ProtectedRoute - Not authenticated and session checked, redirecting to login');
      router.push('/login');
      return;
    }

    // If we haven't checked the session yet but there might be a cookie, check it
    if (!sessionChecked && isAuthenticated() && !authCheckStarted) {
      console.log('ProtectedRoute - Session not checked but cookies found, verifying...');
      setAuthCheckStarted(true);

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log('ProtectedRoute - Session verification timed out, redirecting to login');
        setIsLoading(false);
        router.push('/login');
      }, 5000); // 5 seconds timeout

      // Dispatch the check auth action
      console.log('ProtectedRoute - Dispatching checkAuth action');
      dispatch(checkAuth())
        .unwrap()
        .then(() => {
          console.log('ProtectedRoute - Auth check successful');
          clearTimeout(timeoutId);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('ProtectedRoute - Auth check failed:', error);
          clearTimeout(timeoutId);
          setIsLoading(false);
          router.push('/login');
        });

      // Clean up timeout on unmount
      return () => {
        console.log('ProtectedRoute - Cleaning up timeout');
        clearTimeout(timeoutId);
      };
    }

    // If no cookies and session checked, redirect to login
    if (!isAuthenticated() && sessionChecked) {
      console.log('ProtectedRoute - No cookies and session checked, redirecting to login');
      router.push('/login');
      return;
    }

    // If we get here and everything is checked, we can stop loading
    if (sessionChecked) {
      setIsLoading(false);
    }
  }, [dispatch, router, isAuthenticatedState, sessionChecked, authCheckStarted]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  return isAuthenticatedState ? children : null;
}
