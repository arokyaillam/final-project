'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Send } from 'lucide-react';

export default function AddNewTradePage() {
  const [formData, setFormData] = useState({
    symbol: '',
    orderType: 'MARKET',
    transactionType: 'BUY',
    quantity: '',
    price: '',
    triggerPrice: '',
    stopLoss: '',
    target: '',
    validity: 'DAY',
    product: 'INTRADAY',
    exchange: 'NSE',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Reset form
      setFormData({
        symbol: '',
        orderType: 'MARKET',
        transactionType: 'BUY',
        quantity: '',
        price: '',
        triggerPrice: '',
        stopLoss: '',
        target: '',
        validity: 'DAY',
        product: 'INTRADAY',
        exchange: 'NSE',
      });
      alert('Order placed successfully!');
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Place New Order</h1>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="px-6 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold leading-6 text-gray-900">Order Details</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the details for your paper trade order.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="symbol" className="block text-sm font-medium leading-6 text-gray-900">
                    Symbol
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="symbol"
                      id="symbol"
                      value={formData.symbol}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="e.g., RELIANCE, NIFTY"
                      required
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="exchange" className="block text-sm font-medium leading-6 text-gray-900">
                    Exchange
                  </label>
                  <div className="mt-2">
                    <select
                      id="exchange"
                      name="exchange"
                      value={formData.exchange}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="NSE">NSE</option>
                      <option value="BSE">BSE</option>
                      <option value="NFO">NFO</option>
                      <option value="MCX">MCX</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="transactionType" className="block text-sm font-medium leading-6 text-gray-900">
                    Transaction Type
                  </label>
                  <div className="mt-2">
                    <select
                      id="transactionType"
                      name="transactionType"
                      value={formData.transactionType}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="orderType" className="block text-sm font-medium leading-6 text-gray-900">
                    Order Type
                  </label>
                  <div className="mt-2">
                    <select
                      id="orderType"
                      name="orderType"
                      value={formData.orderType}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="MARKET">MARKET</option>
                      <option value="LIMIT">LIMIT</option>
                      <option value="SL">STOP LOSS</option>
                      <option value="SL-M">STOP LOSS MARKET</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="product" className="block text-sm font-medium leading-6 text-gray-900">
                    Product
                  </label>
                  <div className="mt-2">
                    <select
                      id="product"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="INTRADAY">INTRADAY</option>
                      <option value="DELIVERY">DELIVERY</option>
                    </select>
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">
                    Quantity
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      required
                    />
                  </div>
                </div>
                
                {(formData.orderType === 'LIMIT' || formData.orderType === 'SL') && (
                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                      Price
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.05"
                        min="0"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required={formData.orderType === 'LIMIT' || formData.orderType === 'SL'}
                      />
                    </div>
                  </div>
                )}
                
                {(formData.orderType === 'SL' || formData.orderType === 'SL-M') && (
                  <div className="sm:col-span-3">
                    <label htmlFor="triggerPrice" className="block text-sm font-medium leading-6 text-gray-900">
                      Trigger Price
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="triggerPrice"
                        id="triggerPrice"
                        value={formData.triggerPrice}
                        onChange={handleChange}
                        step="0.05"
                        min="0"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required={formData.orderType === 'SL' || formData.orderType === 'SL-M'}
                      />
                    </div>
                  </div>
                )}
                
                <div className="sm:col-span-3">
                  <label htmlFor="stopLoss" className="block text-sm font-medium leading-6 text-gray-900">
                    Stop Loss (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="stopLoss"
                      id="stopLoss"
                      value={formData.stopLoss}
                      onChange={handleChange}
                      step="0.05"
                      min="0"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="target" className="block text-sm font-medium leading-6 text-gray-900">
                    Target (Optional)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      name="target"
                      id="target"
                      value={formData.target}
                      onChange={handleChange}
                      step="0.05"
                      min="0"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="validity" className="block text-sm font-medium leading-6 text-gray-900">
                    Validity
                  </label>
                  <div className="mt-2">
                    <select
                      id="validity"
                      name="validity"
                      value={formData.validity}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      <option value="DAY">DAY</option>
                      <option value="IOC">IMMEDIATE OR CANCEL</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
