'use client';

import { useSelector } from 'react-redux';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
            
            <div className="border-t border-gray-200 pt-6">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?.email || 'Not available'}
                  </dd>
                </div>
                
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {user?._id || 'Not available'}
                  </dd>
                </div>
                
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Account Created</dt>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <p className="text-sm text-gray-500 mb-4">
              Manage your account settings and preferences.
            </p>
            
            <div className="mt-5 space-y-4">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change Password
              </button>
              
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
