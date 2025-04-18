'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Edit, Trash2, Play } from 'lucide-react';

export default function ManageStrategiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manage Strategies</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Strategies</h2>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No strategies found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new strategy.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => window.location.href = '/dashboard/strategy/add-new'}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create New Strategy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
