'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated } from '@/lib/cookies';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);

  // Check if we have a callback code from Upstox
  const callbackCode = searchParams.get('callback_code');

  // Check for existing session on component mount
  useEffect(() => {
    // If we already checked the session and the user is authenticated, redirect to dashboard
    if (sessionChecked && isAuthenticatedState) {
      router.push('/dashboard');
      return;
    }

    // If we haven't checked the session yet, check it
    if (!sessionChecked && isAuthenticated()) {
      dispatch(checkAuth());
    }
  }, [dispatch, router, sessionChecked, isAuthenticatedState]);

  useEffect(() => {
    // Store the callback code in localStorage if it exists
    if (callbackCode) {
      localStorage.setItem('upstox_callback_code', callbackCode);
      console.log('Stored callback code in localStorage:', callbackCode);
    }
  }, [callbackCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      // Check if we have a stored callback code
      const storedCallbackCode = localStorage.getItem('upstox_callback_code');

      if (storedCallbackCode) {
        // Clear the stored code
        localStorage.removeItem('upstox_callback_code');

        // Redirect to the callback URL with the code and userId
        router.push(`/api/upstox/callback?code=${storedCallbackCode}&userId=${resultAction.payload.user.id}`);
      } else {
        // Normal login flow
        router.push('/dashboard');
      }
    }
  };

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
              <div className="text-sm text-red-700">{error}</div>
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
