'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, checkAuth } from '@/store/slices/authSlice';
import { isAuthenticated } from '@/lib/cookies';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated: isAuthenticatedState, sessionChecked } = useSelector((state) => state.auth);

  // State to track if we're checking authentication
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Immediate check for authentication on component mount
  useEffect(() => {
    console.log('Register Page - Initial auth check');
    console.log('Register Page - Auth state:', { isAuthenticated: isAuthenticatedState, sessionChecked, hasCookies: isAuthenticated() });

    // If Redux state shows authenticated, redirect immediately
    if (isAuthenticatedState) {
      console.log('Register Page - Already authenticated in Redux state, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }

    // If we have cookies, assume authenticated and redirect immediately
    // This provides a better UX by avoiding the loading state
    if (isAuthenticated()) {
      console.log('Register Page - Found auth cookies, redirecting to dashboard immediately');
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

    // If we get here, we're not authenticated and should show the register form
    console.log('Register Page - Not authenticated, showing register form');
  }, [isAuthenticatedState, isAuthenticated, router, dispatch, sessionChecked, isCheckingAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset password error
    setPasswordError('');

    // Validate inputs
    if (!email || !password || !confirmPassword) {
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    // Check password length
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    const resultAction = await dispatch(registerUser({ email, password }));

    if (registerUser.fulfilled.match(resultAction)) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
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
                autoComplete="new-password"
                required
                className="relative block w-full border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {(error || passwordError) && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{passwordError || error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
