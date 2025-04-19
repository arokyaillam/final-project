'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { clearAuthCookies } from '@/lib/cookies';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutAttempted, setLogoutAttempted] = useState(false);

  // This effect runs once on mount
  useEffect(() => {
    // Only run once
    if (logoutAttempted) return;
    setLogoutAttempted(true);

    const performLogout = async () => {
      try {
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
          console.log('Logout Page - Starting logout process');
        }

        // 1. Clear cookies using our utility
        if (typeof window !== 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - Clearing cookies via utility');
          }
          clearAuthCookies();
        }

        // 2. Call the logout API directly
        try {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - Calling logout API');
          }

          const logoutResponse = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const responseData = await logoutResponse.json();

          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - API response:', responseData);
          }
        } catch (apiError) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Logout Page - API call error:', apiError);
          }
          // Continue with logout process even if API call fails
        }

        // 3. Dispatch Redux action
        try {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - Dispatching Redux action');
          }
          await dispatch(logoutUser());
        } catch (reduxError) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Logout Page - Redux dispatch error:', reduxError);
          }
          // Continue with logout process even if Redux dispatch fails
        }

        // 4. Clear cookies manually as a fallback
        if (typeof window !== 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - Manually clearing cookies');
          }
          document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
          document.cookie = 'user_info=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
        }

        // 5. Clear localStorage
        if (typeof window !== 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.log('Logout Page - Clearing localStorage');
          }
          localStorage.removeItem('upstox_access_token');
          localStorage.removeItem('upstox_token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth');
        }

        if (process.env.NODE_ENV !== 'production') {
          console.log('Logout Page - Logout completed, redirecting to login');
        }

        // 6. Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Logout Page - Error during logout:', error);
        }

        // Still redirect to login page even if there's an error
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      }
    };

    // Start the logout process
    performLogout();
  }, [dispatch, logoutAttempted]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    </div>
  );
}
