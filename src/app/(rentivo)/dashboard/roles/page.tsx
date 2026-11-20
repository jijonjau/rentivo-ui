'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { AuthService } from '@/src/services/AuthService';
import { RoleResponse } from '@/src/types/roles';
import { TableColumn } from '@/src/types/table';
import { useQuery } from '@tanstack/react-query';
import { Eye, Pencil, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RolesPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles'],
    queryFn: () => AuthService.FetchRoles(),
    staleTime: 5 * 60 * 1000,
  });

  const handleView = (role: RoleResponse) =>
    router.push(`/dashboard/roles/${role.id}`);

  const handleEdit = (role: RoleResponse) =>
    router.push(`/dashboard/roles/${role.id}/edit`);

  const handleToggleStatus = (role: RoleResponse) =>
    console.log('Toggle role status:', role);

  const columns: TableColumn<RoleResponse>[] = [
    {
      key: 'roleName',
      header: 'Role',
      className: 'font-medium text-slate-800',
    },
    { key: 'accountType', header: 'Account Type' },
    { key: 'createdAt', header: 'Created At' },
    { key: 'updatedAt', header: 'Last Updated' },
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
          data={Array.isArray(data) ? data : []}
          searchPlaceholder="Search roles by name..."
          onAdd={() => router.push('/dashboard/roles/add')}
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
                ...(role.roleName !== 'Super Admin'
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
