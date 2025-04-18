'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveMainMenu } from '@/store/slices/navigationSlice';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector(state => state.navigation);

  // Set active main menu based on pathname
  useEffect(() => {
    if (pathname.includes('/dashboard/market-data')) {
      dispatch(setActiveMainMenu('marketData'));
    } else if (pathname.includes('/dashboard/strategy')) {
      dispatch(setActiveMainMenu('strategy'));
    } else if (pathname.includes('/dashboard/paper-trading')) {
      dispatch(setActiveMainMenu('paperTrading'));
    } else if (pathname.includes('/dashboard/option-data')) {
      dispatch(setActiveMainMenu('optionData'));
    } else if (pathname.includes('/dashboard')) {
      dispatch(setActiveMainMenu('dashboard'));
    }
  }, [pathname, dispatch]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          {sidebarOpen && <Sidebar />}
          <main className={`flex-1 p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
