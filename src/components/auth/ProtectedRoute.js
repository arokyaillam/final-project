'use client';

import { useEffect } from 'react';
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

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', {
      isAuthenticated: isAuthenticatedState,
      sessionChecked,
      hasCookies: isAuthenticated()
    });

    // If not authenticated and we've checked the session, redirect to login
    if (!isAuthenticatedState && sessionChecked) {
      console.log('ProtectedRoute - Not authenticated and session checked, redirecting to login');
      router.push('/login');
      return;
    }

    // If we haven't checked the session yet but there might be a cookie, check it
    if (!sessionChecked && isAuthenticated()) {
      console.log('ProtectedRoute - Session not checked but cookies found, verifying...');

      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        // If verification takes too long, assume it failed and redirect to login
        if (!sessionChecked) {
          console.log('ProtectedRoute - Session verification timed out, redirecting to login');
          router.push('/login');
        }
      }, 5000); // 5 seconds timeout (increased from 3)

      // Dispatch the check auth action
      console.log('ProtectedRoute - Dispatching checkAuth action');
      dispatch(checkAuth())
        .unwrap()
        .then(() => {
          console.log('ProtectedRoute - Auth check successful');
          clearTimeout(timeoutId);
        })
        .catch((error) => {
          console.error('ProtectedRoute - Auth check failed:', error);
          clearTimeout(timeoutId);
          router.push('/login');
        });

      // Clean up timeout on unmount
      return () => {
        console.log('ProtectedRoute - Cleaning up timeout');
        clearTimeout(timeoutId);
      };
    }
  }, [dispatch, router, isAuthenticatedState, sessionChecked]);

  // Show loading state while checking authentication
  if (!sessionChecked) {
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
