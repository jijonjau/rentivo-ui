import AgencyLandlordDashboard from '@/src/components/dashboard/AgencyLandlordDashboard';
import SuperAdminDashboard from '@/src/components/dashboard/SuperAdminDashboard';
import TenantDashboard from '@/src/components/dashboard/TenantDashboard';

export interface DashboardProps {
  name: string;
  role: string;
}

export default function DashboardPage() {
  const user = {
    name: 'George Njau',
    role: 'SUPER_ADMIN',
  }; // Temporary — replace with authenticated user data.

  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard name={user.name} role="Super Admin" />;

    case 'AGENCY':
      return <AgencyLandlordDashboard name={user.name} role="AGENCY" />;

    case 'LANDLORD':
      return <AgencyLandlordDashboard name={user.name} role="LANDLORD" />;

    case 'TENANT':
      return <TenantDashboard name={user.name} role="Tenant" />;

    default:
      return <div>Unauthorized</div>;
  }
}
