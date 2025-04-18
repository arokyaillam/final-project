'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  setActiveMainMenu,
  toggleSidebar,
  toggleMobileMenu
} from '@/store/slices/navigationSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

// Icons
import {
  Menu, X, ChevronDown, User, BarChart2,
  TrendingUp, Activity, PieChart, LogOut
} from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { activeMainMenu, mobileMenuOpen } = useSelector(state => state.navigation);
  const { user } = useSelector(state => state.auth);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  // Set isBrowser to true once component mounts (client-side only)
  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Handle menu item click
  const handleMenuClick = (menu) => {
    dispatch(setActiveMainMenu(menu));
    dispatch(toggleMobileMenu(false));

    // Navigate to the appropriate page
    switch (menu) {
      case 'dashboard':
        router.push('/dashboard');
        break;
      case 'marketData':
        router.push('/dashboard/market-data');
        break;
      case 'strategy':
        router.push('/dashboard/strategy');
        break;
      case 'paperTrading':
        router.push('/dashboard/paper-trading');
        break;
      case 'optionData':
        router.push('/dashboard/option-data');
        break;
      default:
        router.push('/dashboard');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="mr-2 p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                Trading App
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button
              onClick={() => handleMenuClick('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeMainMenu === 'dashboard'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleMenuClick('marketData')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeMainMenu === 'marketData'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Market Data
            </button>
            <button
              onClick={() => handleMenuClick('strategy')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeMainMenu === 'strategy'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Strategy
            </button>
            <button
              onClick={() => handleMenuClick('paperTrading')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeMainMenu === 'paperTrading'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Paper Trading
            </button>
            <button
              onClick={() => handleMenuClick('optionData')}
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                activeMainMenu === 'optionData'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Option Data
            </button>
          </nav>

          {/* User menu */}
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserMenuOpen(!userMenuOpen);
                  }}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    {/* Use a static value for server rendering, then update on client */}
                    {!isBrowser ? 'U' : (user?.email?.charAt(0).toUpperCase() || 'U')}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {!isBrowser ? 'User' : (user?.email || 'User')}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>
              </div>
              {userMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleMenuClick('dashboard')}
              className={`block w-full text-left px-3 py-2 text-base font-medium ${
                activeMainMenu === 'dashboard'
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleMenuClick('marketData')}
              className={`block w-full text-left px-3 py-2 text-base font-medium ${
                activeMainMenu === 'marketData'
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              Market Data
            </button>
            <button
              onClick={() => handleMenuClick('strategy')}
              className={`block w-full text-left px-3 py-2 text-base font-medium ${
                activeMainMenu === 'strategy'
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              Strategy
            </button>
            <button
              onClick={() => handleMenuClick('paperTrading')}
              className={`block w-full text-left px-3 py-2 text-base font-medium ${
                activeMainMenu === 'paperTrading'
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              Paper Trading
            </button>
            <button
              onClick={() => handleMenuClick('optionData')}
              className={`block w-full text-left px-3 py-2 text-base font-medium ${
                activeMainMenu === 'optionData'
                  ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              Option Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
