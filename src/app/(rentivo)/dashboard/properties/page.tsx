'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { TableColumn } from '@/src/types/table';
import { Eye, Ban } from 'lucide-react';

export interface Property {
  id: number;
  name: string;
  location: string;
  units: number;
  occupiedUnits: number;
  landlord: string;
  dateAdded: string;
  status: string;
}

const properties: Property[] = [
  {
    id: 1,
    name: 'Greenwood Apartments',
    location: 'Kilimani, Nairobi',
    units: 24,
    occupiedUnits: 20,
    landlord: 'John Kamau',
    dateAdded: '18 Oct 2026',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sunrise Residency',
    location: 'Westlands, Nairobi',
    units: 16,
    occupiedUnits: 12,
    landlord: 'Mary Wanjiku',
    dateAdded: '25 Oct 2026',
    status: 'Pending',
  },
];

export default function PropertiesPage() {
  const handleView = (property: Property) =>
    console.log('View property:', property);

  const handleDisable = (property: Property) =>
    console.log('Toggle property status:', property);

  const columns: TableColumn<Property>[] = [
    {
      key: 'name',
      header: 'Property',
      className: 'font-medium text-slate-800',
    },
    { key: 'location', header: 'Location' },
    { key: 'units', header: 'Total Units' },
    { key: 'occupiedUnits', header: 'Occupied Units' },
    { key: 'landlord', header: 'Landlord' },
    { key: 'dateAdded', header: 'Date Added' },
    {
      key: 'status',
      header: 'Status',
      render: (property) => <StatusBadge status={property.status} />,
    },
  ];

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title="Properties"
          description="View and manage properties registered on the Rentivo platform."
          showBackButton
        />

        <DataTable
          mode="detailed"
          columns={columns}
          data={properties}
          searchPlaceholder="Search properties by name, location..."
          onFilter={() => console.log('Open filters')}
          onExport={() => console.log('Export properties')}
          renderActions={(property) => (
            <ActionDropdown
              items={[
                {
                  label: 'View Details',
                  icon: <Eye size={16} />,
                  onClick: () => handleView(property),
                },
                {
                  label:
                    property.status === 'Disabled'
                      ? 'Enable Property'
                      : 'Disable Property',
                  icon: <Ban size={16} />,
                  variant: 'danger',
                  onClick: () => handleDisable(property),
                },
              ]}
            />
          )}
          emptyMessage="No properties found."
        />
      </div>
    </>
  );
}
