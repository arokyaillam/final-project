'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated } from '@/lib/cookies';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);

  // State to track if we're checking authentication
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Immediate check for authentication on component mount
  useEffect(() => {
    console.log('Home Page - Initial auth check');
    console.log('Home Page - Auth state:', { isAuthenticated: isAuthenticatedState, sessionChecked, hasCookies: isAuthenticated() });

    // If Redux state shows authenticated, redirect immediately
    if (isAuthenticatedState) {
      console.log('Home Page - Already authenticated in Redux state, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    // If we have cookies, assume authenticated and redirect immediately
    // This provides a better UX by avoiding the loading state
    if (isAuthenticated()) {
      console.log('Home Page - Found auth cookies, redirecting to dashboard immediately');
      router.push('/dashboard');

      // Also trigger the check auth action in the background to update Redux state
      // This ensures the state is properly updated for future navigation
      if (!sessionChecked && !isCheckingAuth) {
        setIsCheckingAuth(true);
        dispatch(checkAuth())
          .finally(() => {
            setIsCheckingAuth(false);
          });
      }
      return;
    }

    // If we get here, we're not authenticated and should show the home page
    console.log('Home Page - Not authenticated, showing home page');
  }, [isAuthenticatedState, isAuthenticated, router, dispatch, sessionChecked, isCheckingAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Trading Dashboard</h1>
        <p className="text-xl mb-8">A powerful trading platform with Upstox integration, market data analysis, and strategy management.</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
