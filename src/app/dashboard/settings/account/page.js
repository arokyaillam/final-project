'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User, Key, Mail } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Reset messages
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    
    // Here you would call an API to change the password
    // For now, we'll just simulate success
    setPasswordSuccess('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            
            <div className="border-t border-gray-200 pt-6">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <Mail className="h-5 w-5 mr-2 text-gray-400" />
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.email || 'Not available'}
                  </dd>
                </div>
                
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    User ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.id || user?._id || 'Not available'}
                  </dd>
                </div>
                
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="flex items-center text-sm font-medium text-gray-500">
                    <Key className="h-5 w-5 mr-2 text-gray-400" />
                    Account Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'Not available'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="mt-1">
                  <input
                    id="current-password"
                    name="current-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {passwordError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{passwordError}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {passwordSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">{passwordSuccess}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Security</h2>
            
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Protect your account by enabling two-factor authentication.
              </p>
            </div>
            
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Enable Two-Factor Authentication
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
