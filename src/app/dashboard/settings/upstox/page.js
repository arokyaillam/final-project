'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUpstoxToken, connectToUpstox } from '@/store/slices/upstoxSlice';
import UpstoxCredentialsForm from '@/components/UpstoxCredentialsForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/services/api';
import { ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

export default function UpstoxIntegrationPage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { token, isConnected, loading, error } = useSelector(state => state.upstox);
  
  const [hasCredentials, setHasCredentials] = useState(false);
  const [credentialsLoading, setCredentialsLoading] = useState(true);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    // Skip on server-side rendering
    if (!isBrowser) return;

    // Only check credentials if user is authenticated
    if (!isAuthenticated && !user) {
      console.log('Upstox Settings - Skipping credentials check, user not authenticated');
      return;
    }

    // Check if user has Upstox credentials
    const checkCredentials = async () => {
      try {
        console.log('Upstox Settings - Checking Upstox credentials');
        setCredentialsLoading(true);

        const response = await api.get('/upstox/credentials');
        console.log('Upstox Settings - Credentials response:', response.data);

        setHasCredentials(response.data.hasCredentials);
        setCredentialsLoading(false);

        // If user has credentials, fetch Upstox token
        if (response.data.hasCredentials) {
          console.log('Upstox Settings - User has credentials, fetching token');
          try {
            const result = await dispatch(fetchUpstoxToken());

            // If token fetch was successful and we have an access token, store it in localStorage
            if (fetchUpstoxToken.fulfilled.match(result) && result.payload.accessToken) {
              console.log('Upstox Settings - Token fetch successful, storing token');
              localStorage.setItem('upstox_access_token', result.payload.accessToken);
              localStorage.setItem('upstox_token', result.payload.token || '');
            }
          } catch (tokenError) {
            console.error('Upstox Settings - Failed to fetch token:', tokenError);
            // Continue even if token fetch fails
          }
        }
      } catch (error) {
        console.error('Upstox Settings - Failed to check credentials:', error);
        setCredentialsLoading(false);
      }
    };

    checkCredentials();
  }, [dispatch, isAuthenticated, user, isBrowser]);

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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Upstox Integration</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Connection Status</h2>
            
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
                    <CheckCircle className="h-5 w-5 text-green-400" />
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
                  disabled={loading || !hasCredentials}
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
                >
                  {loading ? 'Connecting...' : 'Connect to Upstox'}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!credentialsLoading && !hasCredentials && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-6 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upstox API Credentials</h2>
              <p className="text-sm text-gray-500 mb-4">
                To connect to Upstox, you need to provide your API credentials. You can get these from the Upstox Developer Portal.
              </p>
              <UpstoxCredentialsForm
                onSuccess={() => setHasCredentials(true)}
              />
            </div>
          </div>
        )}

        {hasCredentials && (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-6 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage Credentials</h2>
              <p className="text-sm text-gray-500 mb-4">
                Your Upstox API credentials are securely stored. You can update them if needed.
              </p>
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update Credentials
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
