'use client';

import ActionDropdown from '@/src/components/dashboard/ui/ActionDropdown';
import DashboardHeader from '@/src/components/dashboard/ui/DashboardHeader';
import DataTable from '@/src/components/shared/DataTable/DataTable';
import PageHeader from '@/src/components/shared/PageHeader';
import StatusBadge from '@/src/components/shared/StatusBadge';
import { TableColumn } from '@/src/types/table';
import { Eye } from 'lucide-react';

export interface Payment {
  id: number;
  transactionReference: string;
  tenant: string;
  property: string;
  amount: string;
  paymentMethod: string;
  datePaid: string;
  status: string;
}

export const payments: Payment[] = [
  {
    id: 1,
    transactionReference: 'RNT-2026-00124',
    tenant: 'John Kamau',
    property: 'Greenwood Apartments',
    amount: 'KES 25,000',
    paymentMethod: 'M-Pesa',
    datePaid: '01 Nov 2026',
    status: 'Success',
  },
  {
    id: 2,
    transactionReference: 'RNT-2026-00125',
    tenant: 'Jane Wanjiku',
    property: 'Sunrise Residency',
    amount: 'KES 18,500',
    paymentMethod: 'Bank Transfer',
    datePaid: '02 Nov 2026',
    status: 'Pending',
  },
];

export default function PaymentsPage() {
  const handleView = (payment: Payment) =>
    console.log('View payment:', payment);

  const columns: TableColumn<Payment>[] = [
    {
      key: 'transactionReference',
      header: 'Transaction Reference',
      className: 'font-medium text-slate-800',
    },
    { key: 'tenant', header: 'Tenant' },
    { key: 'property', header: 'Property' },
    { key: 'amount', header: 'Amount' },
    { key: 'paymentMethod', header: 'Payment Method' },
    { key: 'datePaid', header: 'Date Paid' },
    {
      key: 'status',
      header: 'Status',
      render: (payment) => <StatusBadge status={payment.status} />,
    },
  ];

  return (
    <>
      <DashboardHeader name="George Njau" role="Super Admin" />

      <div className="space-y-6 p-6">
        <PageHeader
          title="Payments"
          description="View and monitor payment transactions across the Rentivo platform."
          showBackButton
        />

        <DataTable
          mode="detailed"
          columns={columns}
          data={payments}
          searchPlaceholder="Search by reference, tenant, property..."
          onFilter={() => console.log('Open filters')}
          onExport={() => console.log('Export payments')}
          renderActions={(payment) => (
            <ActionDropdown
              items={[
                {
                  label: 'View Details',
                  icon: <Eye size={16} />,
                  onClick: () => handleView(payment),
                },
              ]}
            />
          )}
          emptyMessage="No payment records found."
        />
      </div>
    </>
  );
}
