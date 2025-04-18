'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpstoxToken, connectToUpstox } from '@/store/slices/upstoxSlice';
import UpstoxCredentialsForm from '@/components/UpstoxCredentialsForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/services/api';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { token, isConnected, loading, error } = useSelector((state) => state.upstox);

  // Debug user data
  useEffect(() => {
    console.log('Dashboard - User data:', user);
    console.log('Dashboard - Authentication state:', isAuthenticated);
  }, [user, isAuthenticated]);
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



  const handleConnectUpstox = async () => {
    // Pass the user ID to the connectToUpstox function
    const userId = user?.id || user?._id;
    console.log('Connecting to Upstox with user ID:', userId);
    const result = await dispatch(connectToUpstox(userId));

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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">User Information</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Email: {user?.email || 'Loading...'}</p>
              <p>User ID: {user?.id || user?._id || 'Loading...'}</p>
              <p>Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
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
      </div>
    </DashboardLayout>
  );
}
