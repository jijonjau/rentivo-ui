'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { TableColumn } from '@/src/types/table';
import { Eye, CheckCircle, Ban } from 'lucide-react';
interface Agency {
  id: number;
  name: string;
  registrationNumber: string;
  admin: string;
  email: string;
  phone: string;
  properties: number;
  dateJoined: string;
  status: string;
}

const agencies: Agency[] = [
  {
    id: 1,
    name: 'Prime Properties',
    registrationNumber: 'CPR/2024/001',
    admin: 'John Kamau',
    email: 'info@primeproperties.co.ke',
    phone: '+254712345678',
    properties: 24,
    dateJoined: '18 Oct 2026',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Urban Homes',
    registrationNumber: 'CPR/2025/014',
    admin: 'Mary Wanjiku',
    email: 'info@urbanhomes.co.ke',
    phone: '+254723456789',
    properties: 8,
    dateJoined: '24 Oct 2026',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Elite Property Management',
    registrationNumber: 'CPR/2023/027',
    admin: 'Peter Mwangi',
    email: 'info@eliteproperties.co.ke',
    phone: '+254734567890',
    properties: 15,
    dateJoined: '12 Oct 2026',
    status: 'Disabled',
  },
];

export default function AgenciesPage() {
  const handleView = (agency: Agency) => {
    console.log('View agency:', agency);
  };

  const handleApprove = (agency: Agency) => {
    console.log('Approve agency:', agency);
  };

  const handleDisable = (agency: Agency) => {
    console.log('Disable agency:', agency);
  };

  const columns: TableColumn<Agency>[] = [
    {
      key: 'name',
      header: 'Agency',
      className: 'font-medium text-slate-800',
    },
    {
      key: 'registrationNumber',
      header: 'Registration No',
    },
    {
      key: 'admin',
      header: 'Administrator',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'properties',
      header: 'Properties',
    },
    {
      key: 'dateJoined',
      header: 'Date Joined',
    },
    {
      key: 'status',
      header: 'Status',
      render: (agency) => <StatusBadge status={agency.status} />,
    },
  ];

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title="Agencies"
          description="View and manage agency information."
          showBackButton
        />
        <DataTable
          mode="detailed"
          columns={columns}
          data={agencies}
          searchPlaceholder="Search agencies by name, registration number..."
          onFilter={() => console.log('Open filters')}
          onExport={() => console.log('Export agencies')}
          renderActions={(agency) => (
            <ActionDropdown
              items={[
                {
                  label: 'View Details',
                  icon: <Eye size={16} />,
                  onClick: () => handleView(agency),
                },
                ...(agency.status === 'Pending'
                  ? [
                      {
                        label: 'Approve Agency',
                        icon: <CheckCircle size={16} />,
                        onClick: () => handleApprove(agency),
                      },
                    ]
                  : []),
                {
                  label:
                    agency.status === 'Disabled'
                      ? 'Enable Agency'
                      : 'Disable Agency',
                  icon: <Ban size={16} />,
                  variant: 'danger',
                  onClick: () => handleDisable(agency),
                },
              ]}
            />
          )}
          emptyMessage="No agencies found."
        />
      </div>
    </>
  );
}
