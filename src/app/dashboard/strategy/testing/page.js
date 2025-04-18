'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Play, RefreshCw } from 'lucide-react';

export default function StrategyTestingPage() {
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [symbol, setSymbol] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRunTest = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Strategy Testing</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Backtest Configuration</h2>
            
            <form onSubmit={handleRunTest} className="space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="strategy" className="block text-sm font-medium text-gray-700">Strategy</label>
                  <div className="mt-1">
                    <select
                      id="strategy"
                      name="strategy"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                      required
                    >
                      <option value="">Select a strategy</option>
                      <option value="moving-average-crossover">Moving Average Crossover</option>
                      <option value="rsi-reversal">RSI Reversal</option>
                      <option value="macd-momentum">MACD Momentum</option>
                      <option value="custom">Custom Strategy</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">Symbol</label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="symbol"
                      id="symbol"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter symbol (e.g., NIFTY, RELIANCE)"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? 'Running Test...' : 'Run Backtest'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
              <button
                type="button"
                disabled={true}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No test results available</h3>
                <p className="mt-1 text-sm text-gray-500">Configure and run a backtest to see results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
