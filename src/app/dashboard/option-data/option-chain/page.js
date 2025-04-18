'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { RefreshCw, Search } from 'lucide-react';

// Mock data for demonstration
const mockOptionChain = {
  symbol: 'NIFTY',
  spotPrice: 22450.75,
  expiryDates: ['25-Apr-2025', '02-May-2025', '09-May-2025'],
  strikes: [
    {
      strikePrice: 22300,
      calls: { bid: 210.25, ask: 211.50, iv: 14.2, oi: 12450, volume: 3245, delta: 0.65 },
      puts: { bid: 60.75, ask: 61.25, iv: 12.8, oi: 9870, volume: 2150, delta: -0.35 }
    },
    {
      strikePrice: 22350,
      calls: { bid: 175.50, ask: 176.75, iv: 13.8, oi: 10250, volume: 2890, delta: 0.58 },
      puts: { bid: 75.25, ask: 76.00, iv: 13.2, oi: 8750, volume: 1980, delta: -0.42 }
    },
    {
      strikePrice: 22400,
      calls: { bid: 145.25, ask: 146.50, iv: 13.5, oi: 15680, volume: 4120, delta: 0.52 },
      puts: { bid: 95.50, ask: 96.25, iv: 13.6, oi: 12340, volume: 3560, delta: -0.48 }
    },
    {
      strikePrice: 22450,
      calls: { bid: 118.75, ask: 119.50, iv: 13.2, oi: 18920, volume: 5240, delta: 0.45 },
      puts: { bid: 118.25, ask: 119.00, iv: 13.9, oi: 17650, volume: 4980, delta: -0.55 }
    },
    {
      strikePrice: 22500,
      calls: { bid: 95.25, ask: 96.00, iv: 12.9, oi: 16750, volume: 4560, delta: 0.38 },
      puts: { bid: 145.50, ask: 146.25, iv: 14.2, oi: 14320, volume: 3870, delta: -0.62 }
    },
    {
      strikePrice: 22550,
      calls: { bid: 75.50, ask: 76.25, iv: 12.6, oi: 12450, volume: 3120, delta: 0.32 },
      puts: { bid: 175.75, ask: 176.50, iv: 14.5, oi: 10980, volume: 2760, delta: -0.68 }
    },
    {
      strikePrice: 22600,
      calls: { bid: 58.25, ask: 59.00, iv: 12.3, oi: 9870, volume: 2340, delta: 0.25 },
      puts: { bid: 208.50, ask: 209.25, iv: 14.8, oi: 8450, volume: 1980, delta: -0.75 }
    },
  ]
};

// Mock fetch function
const fetchOptionChain = async (symbol) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { ...mockOptionChain, symbol: symbol || 'NIFTY' };
};

export default function OptionChainPage() {
  const [symbol, setSymbol] = useState('NIFTY');
  const [expiry, setExpiry] = useState('25-Apr-2025');
  
  // Use React Query to fetch option chain data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['optionChain', symbol, expiry],
    queryFn: () => fetchOptionChain(symbol),
    staleTime: 30000, // 30 seconds
  });
  
  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Option Chain</h1>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Search Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSearch} className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div>
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  name="symbol"
                  id="symbol"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Enter symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <select
                  id="expiry"
                  name="expiry"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                >
                  {data?.expiryDates?.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  )) || (
                    <option value="25-Apr-2025">25-Apr-2025</option>
                  )}
                </select>
              </div>
              
              <div className="sm:mt-6">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Option Chain Table */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">Loading option chain...</p>
            </div>
          ) : isError ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-red-500">Error loading option chain: {error?.message || 'Unknown error'}</p>
            </div>
          ) : (
            <div>
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{data.symbol}</span>
                    <span className="ml-2 text-sm text-gray-500">Spot Price: ₹{data.spotPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last Updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th colSpan="6" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">CALLS</th>
                      <th rowSpan="2" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 border-x border-gray-200">Strike Price</th>
                      <th colSpan="6" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 border-l border-gray-200">PUTS</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 border-r border-gray-200">Bid</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Ask</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">IV%</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">OI</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Volume</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 border-r border-gray-200">Delta</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 border-l border-gray-200">Bid</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Ask</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">IV%</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">OI</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Volume</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data.strikes.map((strike) => {
                      const atTheMoney = Math.abs(strike.strikePrice - data.spotPrice) < 25;
                      
                      return (
                        <tr key={strike.strikePrice} className={atTheMoney ? 'bg-indigo-50' : ''}>
                          <td className="px-3 py-2 text-center text-xs text-gray-900 border-r border-gray-200">{strike.calls.bid.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.calls.ask.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.calls.iv.toFixed(1)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.calls.oi.toLocaleString()}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.calls.volume.toLocaleString()}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900 border-r border-gray-200">{strike.calls.delta.toFixed(2)}</td>
                          <td className={`px-3 py-2 text-center text-sm font-medium ${atTheMoney ? 'text-indigo-700 font-semibold' : 'text-gray-900'} border-x border-gray-200`}>
                            {strike.strikePrice.toFixed(0)}
                          </td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900 border-l border-gray-200">{strike.puts.bid.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.puts.ask.toFixed(2)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.puts.iv.toFixed(1)}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.puts.oi.toLocaleString()}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.puts.volume.toLocaleString()}</td>
                          <td className="px-3 py-2 text-center text-xs text-gray-900">{strike.puts.delta.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
