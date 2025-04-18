'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { RefreshCw } from 'lucide-react';

export default function PositionPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Positions</h1>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Positions</h2>
              <div className="flex space-x-2">
                <select
                  className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue="all"
                >
                  <option value="all">All Positions</option>
                  <option value="day">Day Positions</option>
                  <option value="net">Net Positions</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No positions found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by placing a new order.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => window.location.href = '/dashboard/paper-trading/add-new'}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Place New Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Position Summary</h2>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Investment</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Value</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">P&L</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00 (0.00%)</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
