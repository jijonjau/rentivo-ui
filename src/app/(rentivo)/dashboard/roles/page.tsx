'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { TableColumn } from '@/src/types/table';
import { Eye, Pencil, Ban } from 'lucide-react';

export interface Role {
  id: number;
  name: string;
  description: string;
  users: number;
  dateCreated: string;
  status: string;
}

export const roles: Role[] = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access to manage the Rentivo platform.',
    users: 1,
    dateCreated: '10 Sep 2026',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Agency Admin',
    description: 'Manages agency operations, properties and staff.',
    users: 8,
    dateCreated: '12 Sep 2026',
    status: 'Active',
  },
];

export default function RolesPage() {
  const handleView = (role: Role) => console.log('View role:', role);

  const handleEdit = (role: Role) => console.log('Edit role:', role);

  const handleToggleStatus = (role: Role) =>
    console.log('Toggle role status:', role);

  const columns: TableColumn<Role>[] = [
    {
      key: 'name',
      header: 'Role',
      className: 'font-medium text-slate-800',
    },
    { key: 'description', header: 'Description' },
    { key: 'users', header: 'Assigned Users' },
    { key: 'dateCreated', header: 'Date Created' },
    {
      key: 'status',
      header: 'Status',
      render: (role) => <StatusBadge status={role.status} />,
    },
  ];

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title="Roles"
          description="Manage platform roles and their access permissions."
          showBackButton
        />

        <DataTable
          mode="detailed"
          columns={columns}
          data={roles}
          searchPlaceholder="Search roles by name..."
          onAdd={() => console.log('Create role')}
          addLabel="Add Role"
          onFilter={() => console.log('Open filters')}
          onExport={() => console.log('Export roles')}
          renderActions={(role) => (
            <ActionDropdown
              items={[
                {
                  label: 'View Details',
                  icon: <Eye size={16} />,
                  onClick: () => handleView(role),
                },
                {
                  label: 'Edit Role',
                  icon: <Pencil size={16} />,
                  onClick: () => handleEdit(role),
                },
                ...(role.name !== 'Super Admin'
                  ? [
                      {
                        label:
                          role.status === 'Disabled'
                            ? 'Enable Role'
                            : 'Disable Role',
                        icon: <Ban size={16} />,
                        variant: 'danger' as const,
                        onClick: () => handleToggleStatus(role),
                      },
                    ]
                  : []),
              ]}
            />
          )}
          emptyMessage="No roles found."
        />
      </div>
    </>
  );
}
