'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveSubMenu } from '@/store/slices/navigationSlice';
import { logoutUser } from '@/store/slices/authSlice';

// Icons
import {
  User, CreditCard, BarChart2, Settings, List,
  Database, TrendingUp, Plus, Package, Activity,
  ShoppingCart, Briefcase, PieChart, BarChart, Calculator,
  LogOut, Link as LinkIcon, ExternalLink
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { activeMainMenu, activeSubMenu, sidebarOpen } = useSelector(state => state.navigation);

  // Get submenu items based on active main menu
  const getSubmenuItems = () => {
    switch (activeMainMenu) {
      case 'dashboard':
        return [
          { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" />, path: '/dashboard/profile' },
          { id: 'funds', label: 'Funds', icon: <CreditCard className="h-5 w-5" />, path: '/dashboard/funds' },
          { id: 'profitLoss', label: 'Profit & Loss', icon: <BarChart2 className="h-5 w-5" />, path: '/dashboard/profit-loss' },
          { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/dashboard/settings' },
          { id: 'logout', label: 'Logout', icon: <LogOut className="h-5 w-5" />, path: '#', onClick: handleLogout },
        ];
      case 'marketData':
        return [
          { id: 'watchlist', label: 'Watchlist', icon: <List className="h-5 w-5" />, path: '/dashboard/market-data/watchlist' },
          { id: 'historicalData', label: 'Historical Data', icon: <Database className="h-5 w-5" />, path: '/dashboard/market-data/historical-data' },
          { id: 'intradayData', label: 'Intraday Data', icon: <TrendingUp className="h-5 w-5" />, path: '/dashboard/market-data/intraday-data' },
        ];
      case 'strategy':
        return [
          { id: 'addNew', label: 'Add New', icon: <Plus className="h-5 w-5" />, path: '/dashboard/strategy/add-new' },
          { id: 'preBuild', label: 'Pre-built', icon: <Package className="h-5 w-5" />, path: '/dashboard/strategy/pre-built' },
          { id: 'testing', label: 'Testing', icon: <Activity className="h-5 w-5" />, path: '/dashboard/strategy/testing' },
          { id: 'manage', label: 'Manage', icon: <Settings className="h-5 w-5" />, path: '/dashboard/strategy/manage' },
        ];
      case 'paperTrading':
        return [
          { id: 'addNew', label: 'Add New', icon: <Plus className="h-5 w-5" />, path: '/dashboard/paper-trading/add-new' },
          { id: 'orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" />, path: '/dashboard/paper-trading/orders' },
          { id: 'position', label: 'Position', icon: <Briefcase className="h-5 w-5" />, path: '/dashboard/paper-trading/position' },
          { id: 'performance', label: 'Performance', icon: <PieChart className="h-5 w-5" />, path: '/dashboard/paper-trading/performance' },
        ];
      case 'optionData':
        return [
          { id: 'optionChain', label: 'Option Chain', icon: <BarChart className="h-5 w-5" />, path: '/dashboard/option-data/option-chain' },
          { id: 'optionContract', label: 'Option Contract', icon: <Briefcase className="h-5 w-5" />, path: '/dashboard/option-data/option-contract' },
          { id: 'calculation', label: 'Calculation', icon: <Calculator className="h-5 w-5" />, path: '/dashboard/option-data/calculation' },
        ];
      case 'settings':
        return [
          { id: 'general', label: 'General', icon: <Settings className="h-5 w-5" />, path: '/dashboard/settings' },
          { id: 'upstox', label: 'Upstox Integration', icon: <ExternalLink className="h-5 w-5" />, path: '/dashboard/settings/upstox' },
          { id: 'account', label: 'Account', icon: <User className="h-5 w-5" />, path: '/dashboard/settings/account' },
          { id: 'notifications', label: 'Notifications', icon: <LinkIcon className="h-5 w-5" />, path: '/dashboard/settings/notifications' },
        ];
      default:
        return [];
    }
  };

  // Handle submenu item click
  const handleSubmenuClick = (submenu) => {
    dispatch(setActiveSubMenu(submenu));
  };

  // Handle logout
  const handleLogout = async () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Sidebar - Logging out user');
    }

    try {
      // 1. Call the logout API
      await fetch('/api/auth/logout-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 2. Clear cookies directly
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
      document.cookie = 'user_info=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';

      // 3. Clear localStorage
      localStorage.removeItem('upstox_access_token');
      localStorage.removeItem('upstox_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth');

      // 4. Dispatch logout action
      dispatch(logoutUser());

      // 5. Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Sidebar - Logout error:', error);
      }

      // Even if there's an error, still try to redirect
      window.location.href = '/login';
    }
  };

  // Set active submenu based on pathname
  useEffect(() => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Convert path format to camelCase for state
    const submenuId = lastSegment
      .split('-')
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join('');

    if (submenuId && submenuId !== activeSubMenu) {
      dispatch(setActiveSubMenu(submenuId));
    }
  }, [pathname, dispatch, activeSubMenu]);

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="py-4">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {activeMainMenu === 'marketData'
              ? 'Market Data'
              : activeMainMenu === 'paperTrading'
                ? 'Paper Trading'
                : activeMainMenu === 'optionData'
                  ? 'Option Data'
                  : activeMainMenu}
          </h2>
        </div>
        <nav className="space-y-1 px-2">
          {getSubmenuItems().map((item) => (
            item.id === 'logout' ? (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md ${
                  activeSubMenu === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className={`mr-3 ${
                  activeSubMenu === item.id
                    ? 'text-indigo-700'
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            ) : (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => handleSubmenuClick(item.id)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  activeSubMenu === item.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
              <div className={`mr-3 ${
                activeSubMenu === item.id
                  ? 'text-indigo-700'
                  : 'text-gray-500 group-hover:text-gray-700'
              }`}>
                {item.icon}
              </div>
              {item.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
