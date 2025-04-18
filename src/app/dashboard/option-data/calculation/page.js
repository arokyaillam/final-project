'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calculator } from 'lucide-react';

export default function CalculationPage() {
  const [formData, setFormData] = useState({
    spotPrice: '',
    strikePrice: '',
    interestRate: '10',
    volatility: '20',
    daysToExpiry: '30',
    optionType: 'call',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCalculate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate calculation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Option Calculator</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Black-Scholes Calculator</h2>
            
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="spotPrice" className="block text-sm font-medium text-gray-700">Spot Price</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="spotPrice"
                      id="spotPrice"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter current price"
                      value={formData.spotPrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="strikePrice" className="block text-sm font-medium text-gray-700">Strike Price</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="strikePrice"
                      id="strikePrice"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter strike price"
                      value={formData.strikePrice}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="interestRate"
                      id="interestRate"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 10"
                      value={formData.interestRate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="volatility" className="block text-sm font-medium text-gray-700">Volatility (%)</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="volatility"
                      id="volatility"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 20"
                      value={formData.volatility}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      max="200"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="daysToExpiry" className="block text-sm font-medium text-gray-700">Days to Expiry</label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="daysToExpiry"
                      id="daysToExpiry"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., 30"
                      value={formData.daysToExpiry}
                      onChange={handleChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="optionType" className="block text-sm font-medium text-gray-700">Option Type</label>
                  <div className="mt-1">
                    <select
                      id="optionType"
                      name="optionType"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.optionType}
                      onChange={handleChange}
                    >
                      <option value="call">Call Option</option>
                      <option value="put">Put Option</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  {isLoading ? 'Calculating...' : 'Calculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Results</h2>
            
            <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <div className="flex flex-col items-center justify-center py-12 bg-gray-50">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No calculation results</h3>
                <p className="mt-1 text-sm text-gray-500">Enter values and click Calculate to see results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
