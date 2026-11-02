import { DashboardProps } from '@/src/app/(rentivo)/dashboard/page';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import StatCard from '@/src/components/dashboard/ui/StatCard';
import { Users, Building2, CreditCard, AlertCircle, House } from 'lucide-react';
import PaymentOverview from './graphs/PaymentOverview';
import UserGrowth from './graphs/UserGrowth';
import RecentActivity from './RecentActivity';
import RentivoAssistant from './RentivoAssistant';
import PlatformAlerts from './PlatformAlerts';

export default function SuperAdminDashboard({ name, role }: DashboardProps) {
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
            Here&apos;s what&apos;s happening across your Rentivo platform.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Users"
            value="1,250"
            icon={Users}
            change={12.5}
            trend="up"
          />

          <StatCard
            title="Agencies"
            value="45"
            icon={Building2}
            change={8.2}
            trend="up"
          />

          <StatCard
            title="Landlords"
            value="320"
            icon={House}
            change={4.5}
            trend="up"
          />

          <StatCard
            title="Payments"
            value="KSh 2.4M"
            icon={CreditCard}
            change={6.8}
            trend="up"
          />

          <StatCard
            title="Issues"
            value="28"
            icon={AlertCircle}
            change={3.2}
            trend="down"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PaymentOverview
              total="KSh 2.4M"
              data={[
                { label: 'May', value: 320000 },
                { label: 'Jun', value: 410000 },
                { label: 'Jul', value: 380000 },
                { label: 'Aug', value: 520000 },
                { label: 'Sep', value: 480000 },
                { label: 'Oct', value: 650000 },
              ]}
            />
          </div>

          <UserGrowth
            total={1250}
            data={[
              { label: 'May', users: 65 },
              { label: 'Jun', users: 82 },
              { label: 'Jul', users: 74 },
              { label: 'Aug', users: 110 },
              { label: 'Sep', users: 95 },
              { label: 'Oct', users: 130 },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <PlatformAlerts />
            <RecentActivity />
          </div>

          <RentivoAssistant role="SUPER_ADMIN" />
        </div>
      </div>
    </>
  );
}
