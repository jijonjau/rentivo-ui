'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { TableColumn } from '@/src/types/table';
import { Eye, Ban } from 'lucide-react';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  dateJoined: string;
  status: string;
}

export const users: User[] = [
  {
    id: 1,
    name: 'John Kamau',
    email: 'john.kamau@gmail.com',
    phone: '+254 712 345 678',
    role: 'Landlord',
    dateJoined: '12 Oct 2026',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Wanjiku',
    email: 'jane.wanjiku@gmail.com',
    phone: '+254 723 456 789',
    role: 'Tenant',
    dateJoined: '15 Oct 2026',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Peter Mwangi',
    email: 'peter@primehomes.co.ke',
    phone: '+254 734 567 890',
    role: 'Agency Admin',
    dateJoined: '18 Oct 2026',
    status: 'Pending',
  },
];

export default function UsersPage() {
  const handleView = (user: User) => {
    console.log('View user:', user);
  };

  const handleDisable = (user: User) => {
    console.log('Disable user:', user);
  };

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'User',
      className: 'font-medium text-slate-800',
    },
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'phone',
      header: 'Phone Number',
    },
    {
      key: 'role',
      header: 'Role',
    },
    {
      key: 'dateJoined',
      header: 'Date Joined',
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => <StatusBadge status={user.status} />,
    },
  ];

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title="Users"
          description="Manage agencies, landlords and tenants across the Rentivo platform."
          showBackButton
        />

        <DataTable
          mode="detailed"
          columns={columns}
          data={users}
          searchPlaceholder="Search users by name, email, phone..."
          onFilter={() => console.log('Open filters')}
          onExport={() => console.log('Export users')}
          renderActions={(user) => (
            <ActionDropdown
              items={[
                {
                  label: 'View Details',
                  icon: <Eye size={16} />,
                  onClick: () => handleView(user),
                },
                {
                  label:
                    user.status === 'Disabled' ? 'Enable User' : 'Disable User',
                  icon: <Ban size={16} />,
                  variant: 'danger',
                  onClick: () => handleDisable(user),
                },
              ]}
            />
          )}
          emptyMessage="No users found."
        />
      </div>
    </>
  );
}
