'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Settings, User, BarChart2, TrendingUp, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-medium leading-6 text-gray-900">User Information</h3>
            </div>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Email: {!isBrowser ? 'Loading...' : (user?.email || 'Loading...')}</p>
              <p>User ID: {!isBrowser ? 'Loading...' : (user?.id || user?._id || 'Loading...')}</p>
              <p>Authentication Status: {!isBrowser ? 'Loading...' : (isAuthenticated ? 'Authenticated' : 'Not Authenticated')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Settings</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Account & Preferences</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/settings" className="font-medium text-indigo-600 hover:text-indigo-900">
                  Manage Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <BarChart2 className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Market Data</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">View Market Information</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/market-data" className="font-medium text-indigo-600 hover:text-indigo-900">
                  View Market Data
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Upstox Integration</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Connect Trading Account</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/settings/upstox" className="font-medium text-indigo-600 hover:text-indigo-900">
                  Manage Integration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
