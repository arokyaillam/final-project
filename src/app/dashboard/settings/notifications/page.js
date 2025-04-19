'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Bell, Mail, Monitor, Smartphone, AlertTriangle } from 'lucide-react';

export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    mobile: true,
    trades: true,
    marketUpdates: false,
    priceAlerts: true,
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // Reset success message when changes are made
    setSaveSuccess(false);
  };
  
  const handleSave = () => {
    // Here you would call an API to save the notification settings
    // For now, we'll just simulate success
    setSaveSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Manage how and when you receive notifications from the trading platform.
            </p>
            
            <div className="mt-6 space-y-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900 flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  Notification Methods
                </legend>
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
                <legend className="text-base font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                  Notification Types
                </legend>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Frequency</h2>
            
            <div className="mt-4">
              <fieldset>
                <legend className="sr-only">Email frequency</legend>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="frequency-realtime"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      defaultChecked
                    />
                    <label htmlFor="frequency-realtime" className="ml-3 block text-sm font-medium text-gray-700">
                      Real-time
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="frequency-daily"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="frequency-daily" className="ml-3 block text-sm font-medium text-gray-700">
                      Daily digest
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="frequency-weekly"
                      name="frequency"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="frequency-weekly" className="ml-3 block text-sm font-medium text-gray-700">
                      Weekly digest
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        
        {saveSuccess && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Notification settings saved successfully!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
