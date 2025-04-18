'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { ArrowRight } from 'lucide-react';

export default function PreBuiltStrategiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Pre-built Strategies</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-6 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Strategies</h2>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Moving Average Crossover</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>A simple strategy that generates buy signals when a short-term moving average crosses above a long-term moving average.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">RSI Reversal</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Identifies potential reversals using the Relative Strength Index (RSI) indicator to spot overbought and oversold conditions.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">MACD Momentum</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Uses the Moving Average Convergence Divergence (MACD) indicator to identify momentum shifts in the market.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Bollinger Band Breakout</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Identifies potential breakouts when price moves outside the Bollinger Bands, indicating increased volatility.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Gap Trading</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Capitalizes on price gaps that occur between market close and open, with rules for both gap up and gap down scenarios.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Options Iron Condor</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>A neutral options strategy that profits when the underlying asset remains within a specific price range until expiration.</p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
