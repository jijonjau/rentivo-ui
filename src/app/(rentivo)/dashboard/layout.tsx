'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Clear authentication tokens/session
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="SUPER_ADMIN" onLogout={handleLogout} />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
