'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { fetchUpstoxToken, connectToUpstox } from '@/store/slices/upstoxSlice';
import UpstoxCredentialsForm from '@/components/UpstoxCredentialsForm';
import api from '@/services/api';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { token, isConnected, loading, error } = useSelector((state) => state.upstox);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(true);

  useEffect(() => {
    // Check if user has Upstox credentials
    const checkCredentials = async () => {
      try {
        setCredentialsLoading(true);
        const response = await api.get('/upstox/credentials');
        setHasCredentials(response.data.hasCredentials);
        setCredentialsLoading(false);

        // If user has credentials, fetch Upstox token
        if (response.data.hasCredentials) {
          const result = await dispatch(fetchUpstoxToken());

          // If token fetch was successful and we have an access token, store it in localStorage
          if (fetchUpstoxToken.fulfilled.match(result) && result.payload.accessToken) {
            localStorage.setItem('upstox_access_token', result.payload.accessToken);
            localStorage.setItem('upstox_token', result.payload.token || '');
          }
        }
      } catch (error) {
        console.error('Failed to check credentials:', error);
        setCredentialsLoading(false);
      }
    };

    checkCredentials();
  }, [dispatch]);

  const handleLogout = async () => {
    // Clear Upstox tokens from localStorage
    localStorage.removeItem('upstox_access_token');
    localStorage.removeItem('upstox_token');

    await dispatch(logoutUser());
    router.push('/login');
  };

  const handleConnectUpstox = async () => {
    // Pass the user ID to the connectToUpstox function
    const result = await dispatch(connectToUpstox(user?._id));

    // After connecting, fetch the token
    if (connectToUpstox.fulfilled.match(result)) {
      const tokenResult = await dispatch(fetchUpstoxToken());

      // If token fetch was successful and we have an access token, store it in localStorage
      if (fetchUpstoxToken.fulfilled.match(tokenResult) && tokenResult.payload.accessToken) {
        localStorage.setItem('upstox_access_token', tokenResult.payload.accessToken);
        localStorage.setItem('upstox_token', tokenResult.payload.token || '');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">User Information</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Email: {user?.email}</p>
            </div>
          </div>
        </div>

        {!credentialsLoading && !hasCredentials && (
          <UpstoxCredentialsForm
            onSuccess={() => setHasCredentials(true)}
          />
        )}

        {hasCredentials && (
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Upstox Integration</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  {isConnected
                    ? 'Your account is connected to Upstox.'
                    : 'Connect your account to Upstox to access trading features.'}
                </p>
              </div>
              <div className="mt-5">
                {isConnected ? (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          Connected to Upstox
                        </p>
                        <p className="mt-2 text-sm text-green-700">
                          Connected since: {token?.connectedAt ? new Date(token.connectedAt).toLocaleString() : 'Unknown'}
                        </p>
                        <p className="mt-2 text-sm text-green-700">
                          Token expires at: {token?.expiresAt ? new Date(token.expiresAt).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnectUpstox}
                    disabled={loading}
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
                  >
                    {loading ? 'Connecting...' : 'Connect to Upstox'}
                  </button>
                )}

                {error && (
                  <div className="mt-3 rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {error.includes('not found') ? 'Please connect to Upstox to continue.' : `Error: ${error}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
