'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Save, X } from 'lucide-react';

// Mock save function
const saveStrategy = async (strategyData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Strategy saved:', strategyData);
  return { id: 'new-strategy-id', ...strategyData };
};

export default function AddNewStrategyPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'intraday',
    entryCondition: '',
    exitCondition: '',
    stopLoss: '',
    targetProfit: '',
    timeFrame: '5min',
  });
  
  // Use React Query mutation for saving
  const mutation = useMutation({
    mutationFn: saveStrategy,
    onSuccess: (data) => {
      alert(`Strategy "${data.name}" saved successfully!`);
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'intraday',
        entryCondition: '',
        exitCondition: '',
        stopLoss: '',
        targetProfit: '',
        timeFrame: '5min',
      });
    },
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Add New Strategy</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Strategy Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Define your trading strategy parameters.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                    Strategy Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">
                    Strategy Type
                  </label>
                  <div className="mt-2">
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="intraday">Intraday</option>
                      <option value="swing">Swing</option>
                      <option value="positional">Positional</option>
                      <option value="options">Options</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="timeFrame" className="block text-sm font-medium leading-6 text-gray-900">
                    Time Frame
                  </label>
                  <div className="mt-2">
                    <select
                      id="timeFrame"
                      name="timeFrame"
                      value={formData.timeFrame}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="1min">1 Minute</option>
                      <option value="5min">5 Minutes</option>
                      <option value="15min">15 Minutes</option>
                      <option value="30min">30 Minutes</option>
                      <option value="1hour">1 Hour</option>
                      <option value="1day">Daily</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="entryCondition" className="block text-sm font-medium leading-6 text-gray-900">
                    Entry Condition
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="entryCondition"
                      name="entryCondition"
                      rows={3}
                      value={formData.entryCondition}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="E.g., Buy when price crosses above 20 EMA and RSI > 50"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-6">
                  <label htmlFor="exitCondition" className="block text-sm font-medium leading-6 text-gray-900">
                    Exit Condition
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="exitCondition"
                      name="exitCondition"
                      rows={3}
                      value={formData.exitCondition}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="E.g., Sell when price crosses below 20 EMA or RSI < 30"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="stopLoss" className="block text-sm font-medium leading-6 text-gray-900">
                    Stop Loss (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="stopLoss"
                      id="stopLoss"
                      value={formData.stopLoss}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="E.g., 2.5"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="targetProfit" className="block text-sm font-medium leading-6 text-gray-900">
                    Target Profit (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="targetProfit"
                      id="targetProfit"
                      value={formData.targetProfit}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="E.g., 5"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => setFormData({
                  name: '',
                  description: '',
                  type: 'intraday',
                  entryCondition: '',
                  exitCondition: '',
                  stopLoss: '',
                  targetProfit: '',
                  timeFrame: '5min',
                })}
              >
                <X className="h-4 w-4 inline mr-1" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
              >
                <Save className="h-4 w-4 mr-2" />
                {mutation.isPending ? 'Saving...' : 'Save Strategy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
