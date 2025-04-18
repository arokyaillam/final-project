'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PaperTradingPage() {
  const router = useRouter();
  
  // Redirect to add-new by default
  useEffect(() => {
    router.push('/dashboard/paper-trading/add-new');
  }, [router]);
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading Paper Trading...</h2>
          <p className="mt-2 text-gray-500">Redirecting to add new trade</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
