'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function OptionDataPage() {
  const router = useRouter();
  
  // Redirect to option-chain by default
  useEffect(() => {
    router.push('/dashboard/option-data/option-chain');
  }, [router]);
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading Option Data...</h2>
          <p className="mt-2 text-gray-500">Redirecting to option chain</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
