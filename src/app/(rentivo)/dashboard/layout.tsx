'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { AuthService } from '@/src/services/AuthService';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // Continue with local cleanup even if the request fails.
    } finally {
      sessionStorage.removeItem('otpToken');
      sessionStorage.removeItem('passwordResetToken');

      router.push('/auth/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="SUPER_ADMIN" onLogout={handleLogout} />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
