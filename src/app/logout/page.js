'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('Logout Page - Starting logout process');
        
        // 1. Call the logout API directly
        const logoutResponse = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Logout Page - API response:', await logoutResponse.json());
        
        // 2. Dispatch Redux action
        await dispatch(logoutUser());
        
        // 3. Clear cookies manually
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
        document.cookie = 'user_info=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=lax;';
        
        // 4. Clear localStorage
        localStorage.removeItem('upstox_access_token');
        localStorage.removeItem('upstox_token');
        
        console.log('Logout Page - Logout completed, redirecting to login');
        
        // 5. Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      } catch (error) {
        console.error('Logout Page - Error during logout:', error);
        
        // Still redirect to login page even if there's an error
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);
      }
    };

    performLogout();
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Logging out...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      </div>
    </div>
  );
}
