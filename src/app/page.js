'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated } from '@/lib/cookies';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);

  // Check authentication status and redirect if authenticated
  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (isAuthenticatedState) {
      router.push('/dashboard');
      return;
    }

    // If we haven't checked the session yet but there might be a cookie, check it
    if (!sessionChecked && isAuthenticated()) {
      dispatch(checkAuth()).then((result) => {
        // If authentication check was successful, redirect to dashboard
        if (checkAuth.fulfilled.match(result)) {
          router.push('/dashboard');
        }
      });
    }
  }, [dispatch, router, isAuthenticatedState, sessionChecked]);

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
