'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Summary</h2>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Total P&L</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Win Rate</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0%</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Profit</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Loss</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0.00</dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Chart</h2>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No performance data available</h3>
                <p className="mt-1 text-sm text-gray-500">Complete some trades to see your performance metrics.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trade Statistics</h2>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No trade statistics available</h3>
                <p className="mt-1 text-sm text-gray-500">Complete some trades to see your statistics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
