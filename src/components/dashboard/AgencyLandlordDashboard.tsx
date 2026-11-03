import AgencyLandlordAlerts from './AgencyLandlordAlerts';
import AgencyLandlordRecentActivity from './AgencyLandlordRecentActivity';
import OccupancyOverview from './graphs/OccupancyOverview';
import PaymentOverview from './graphs/PaymentOverview';
import RentivoAssistant from './RentivoAssistant';
import DashboardHeader from './ui/DashboardHeader';
import StatCard from './ui/StatCard';
import { Users, Building2, CreditCard, House, HousePlus } from 'lucide-react';

interface AgencyLandlordDashboardProps {
  name: string;
  role: 'AGENCY' | 'LANDLORD';
}

export default function AgencyLandlordDashboard({
  name,
  role,
}: AgencyLandlordDashboardProps) {
  const isAgency = role === 'AGENCY';

  return (
    <>
      <DashboardHeader name={name} role={role} />

      <div className="space-y-6 p-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isAgency
              ? "Here's an overview of your agency's properties, tenants and rental operations."
              : "Here's an overview of your properties, tenants and rental income."}
          </p>
        </div>

        {/* Statistics - customize labels and data based on role */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Properties"
            value="50"
            icon={Users}
            change={12.5}
            trend="up"
          />

          <StatCard
            title="Units"
            value="1,245"
            icon={Building2}
            change={8.2}
            trend="up"
          />

          <StatCard
            title="Tenants"
            value="1,120"
            icon={House}
            change={4.5}
            trend="up"
          />

          <StatCard
            title="Rent Collected"
            value="KSh 2.4M"
            icon={CreditCard}
            change={6.8}
            trend="up"
          />

          <StatCard
            title="Vacancies"
            value="28"
            icon={HousePlus}
            change={3.2}
            trend="down"
          />
        </div>
        {/* Payment Overview + Occupancy Overview */}

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

          <OccupancyOverview occupied={185} vacant={35} />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <AgencyLandlordAlerts isAgency={isAgency} />

            <AgencyLandlordRecentActivity isAgency={isAgency} />
          </div>

          <RentivoAssistant role={role} />
        </div>
      </div>
    </>
  );
}
