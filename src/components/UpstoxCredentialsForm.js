'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/services/api';

export default function UpstoxCredentialsForm({ onSuccess }) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/api/upstox/callback'); // This is correct as it's a full URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientId || !clientSecret || !redirectUri) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/upstox/credentials', {
        clientId,
        clientSecret,
        redirectUri,
      });

      setSuccess(true);
      setLoading(false);

      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save credentials');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg mt-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Upstox API Credentials</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Enter your Upstox API credentials to connect your account.</p>
        </div>

        {success ? (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Credentials saved successfully!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 sm:flex sm:flex-col sm:gap-4">
            <div>
              <label htmlFor="client-id" className="block text-sm font-medium leading-6 text-gray-900">
                Client ID
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="client-id"
                  id="client-id"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Your Upstox Client ID"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="client-secret" className="block text-sm font-medium leading-6 text-gray-900">
                Client Secret
              </label>
              <div className="mt-2">
                <input
                  type="password"
                  name="client-secret"
                  id="client-secret"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Your Upstox Client Secret"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="redirect-uri" className="block text-sm font-medium leading-6 text-gray-900">
                Redirect URI
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="redirect-uri"
                  id="redirect-uri"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="Redirect URI"
                  value={redirectUri}
                  onChange={(e) => setRedirectUri(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Saving...' : 'Save Credentials'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
