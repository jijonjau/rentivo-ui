import { DashboardProps } from '@/src/app/(rentivo)/dashboard/page';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import StatCard from '@/src/components/dashboard/ui/StatCard';
import {
  Wallet,
  CircleCheck,
  WalletCards,
  CalendarDays,
  Wrench,
} from 'lucide-react';

export default function TenantDashboard({ name, role }: DashboardProps) {
  return (
    <>
      <DashboardHeader name={name} role={role} />

      {/* Dashboard Content */}
      <div className="space-y-6 p-8">
        {/* Page Heading */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here&apos;s an overview of your home, rent payments and account
            activity.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Monthly Rent"
            value="Ksh 6,500"
            icon={Wallet}
            description="Due this month"
          />

          <StatCard
            title="Amount Paid"
            value="Ksh 5,000"
            icon={CircleCheck}
            description="Payment received"
          />

          <StatCard
            title="Outstanding Balance"
            value="Ksh 1,500"
            icon={WalletCards}
            description="Payment pending"
          />

          <StatCard
            title="Next Due Date"
            value="05/12/2026"
            icon={CalendarDays}
            description="Rent payment deadline"
          />

          <StatCard
            title="Issues Raised"
            value="2"
            icon={Wrench}
            description="Currently reported issues"
          />
        </div>
      </div>
    </>
  );
}
