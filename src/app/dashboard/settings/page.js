'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ExternalLink, User, Bell, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    mobile: true,
    trades: true,
    marketUpdates: false,
    priceAlerts: true,
  });

  const [theme, setTheme] = useState('light');

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings Menu</h2>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <SettingsIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium leading-6 text-gray-900">General Settings</h3>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your general application settings.</p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <Link href="/dashboard/settings" className="text-indigo-600 hover:text-indigo-900 font-medium">Manage General Settings</Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <ExternalLink className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Upstox Integration</h3>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Connect and manage your Upstox trading account.</p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <Link href="/dashboard/settings/upstox" className="text-indigo-600 hover:text-indigo-900 font-medium">Manage Upstox Integration</Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Account Settings</h3>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your account details and password.</p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <Link href="/dashboard/settings/account" className="text-indigo-600 hover:text-indigo-900 font-medium">Manage Account</Link>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                  </div>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Manage your notification preferences.</p>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <Link href="/dashboard/settings/notifications" className="text-indigo-600 hover:text-indigo-900 font-medium">Manage Notifications</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>

            <div className="mt-6 space-y-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900">Notification Methods</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">Email notifications</label>
                      <p className="text-gray-500">Get notified via email for important updates.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="browser-notifications"
                        name="browser-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.browser}
                        onChange={() => handleNotificationChange('browser')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="browser-notifications" className="font-medium text-gray-700">Browser notifications</label>
                      <p className="text-gray-500">Receive browser notifications when you're online.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="mobile-notifications"
                        name="mobile-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.mobile}
                        onChange={() => handleNotificationChange('mobile')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="mobile-notifications" className="font-medium text-gray-700">Mobile notifications</label>
                      <p className="text-gray-500">Get push notifications on your mobile device.</p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-base font-medium text-gray-900">Notification Types</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="trade-notifications"
                        name="trade-notifications"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.trades}
                        onChange={() => handleNotificationChange('trades')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="trade-notifications" className="font-medium text-gray-700">Trade notifications</label>
                      <p className="text-gray-500">Get notified when your trades are executed.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="market-updates"
                        name="market-updates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.marketUpdates}
                        onChange={() => handleNotificationChange('marketUpdates')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="market-updates" className="font-medium text-gray-700">Market updates</label>
                      <p className="text-gray-500">Receive updates about market events and news.</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="price-alerts"
                        name="price-alerts"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={notifications.priceAlerts}
                        onChange={() => handleNotificationChange('priceAlerts')}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="price-alerts" className="font-medium text-gray-700">Price alerts</label>
                      <p className="text-gray-500">Get notified when prices hit your targets.</p>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Appearance</h2>

            <div className="mt-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900">Theme</legend>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <input
                      id="light"
                      name="theme"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={theme === 'light'}
                      onChange={() => setTheme('light')}
                    />
                    <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700">
                      Light
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="dark"
                      name="theme"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={theme === 'dark'}
                      onChange={() => setTheme('dark')}
                    />
                    <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700">
                      Dark
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="system"
                      name="theme"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={theme === 'system'}
                      onChange={() => setTheme('system')}
                    />
                    <label htmlFor="system" className="ml-3 block text-sm font-medium text-gray-700">
                      System
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
