'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

// Mock data for demonstration
const mockStocks = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 1.25, changePercent: 0.70 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corporation', price: 417.88, change: -2.32, changePercent: -0.55 },
  { id: 3, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 152.50, change: 0.75, changePercent: 0.49 },
  { id: 4, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.15, change: 3.45, changePercent: 1.97 },
  { id: 5, symbol: 'TSLA', name: 'Tesla, Inc.', price: 237.49, change: -5.23, changePercent: -2.15 },
];

// Mock fetch function
const fetchWatchlist = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockStocks;
};

export default function WatchlistPage() {
  const [newSymbol, setNewSymbol] = useState('');
  
  // Use React Query to fetch watchlist data
  const { data: stocks, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['watchlist'],
    queryFn: fetchWatchlist,
    staleTime: 60000, // 1 minute
  });
  
  const handleAddSymbol = (e) => {
    e.preventDefault();
    // In a real app, this would call an API to add the symbol
    console.log('Adding symbol:', newSymbol);
    setNewSymbol('');
    refetch();
  };
  
  const handleRemoveSymbol = (symbol) => {
    // In a real app, this would call an API to remove the symbol
    console.log('Removing symbol:', symbol);
    refetch();
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Watchlist</h1>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Add Symbol Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Add Symbol</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Add a new symbol to your watchlist.</p>
            </div>
            <form onSubmit={handleAddSymbol} className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="symbol" className="sr-only">Symbol</label>
                <input
                  type="text"
                  name="symbol"
                  id="symbol"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter symbol (e.g., AAPL)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </button>
            </form>
          </div>
        </div>
        
        {/* Watchlist Table */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">Loading watchlist...</p>
            </div>
          ) : isError ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-red-500">Error loading watchlist: {error?.message || 'Unknown error'}</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Symbol</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Change</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stocks?.map((stock) => (
                  <tr key={stock.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{stock.symbol}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{stock.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">${stock.price.toFixed(2)}</td>
                    <td className={`whitespace-nowrap px-3 py-4 text-sm text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => handleRemoveSymbol(stock.symbol)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {stock.symbol}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
