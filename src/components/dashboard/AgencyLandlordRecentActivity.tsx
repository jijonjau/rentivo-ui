'use client';

import { useState } from 'react';
import StatusBadge from '../shared/StatusBadge';
import DataTable from '../shared/DataTable/DataTable';
import { TableColumn } from '@/src/types/table';

type Tab = 'tenants' | 'properties' | 'payments';

const tabs: { label: string; value: Tab }[] = [
  { label: 'Recent Tenants', value: 'tenants' },
  { label: 'Recent Properties', value: 'properties' },
  { label: 'Recent Payments', value: 'payments' },
];

const tenants = [
  {
    name: 'John Kamau',
    accountType: 'Tenant',
    email: 'john@example.com',
    date: '02 Nov 2026',
    status: 'Active',
  },
  {
    name: 'Mary Wanjiku',
    accountType: 'Landlord',
    email: 'mary@example.com',
    date: '01 Nov 2026',
    status: 'Pending',
  },
  {
    name: 'Prime Properties',
    accountType: 'Agency',
    email: 'info@prime.com',
    date: '31 Oct 2026',
    status: 'Active',
  },
  {
    name: 'Mary Wanjiku',
    accountType: 'Landlord',
    email: 'mary@example.com',
    date: '01 Nov 2026',
    status: 'Pending',
  },
];

const properties = [
  {
    name: 'Sunrise Apartments',
    landlord: 'John Kamau',
    location: 'Kilimani, Nairobi',
    units: 24,
    status: 'Active',
  },
  {
    name: 'Greenview Estate',
    landlord: 'Mary Wanjiku',
    location: 'Rongai, Kajiado',
    units: 16,
    status: 'Active',
  },
  {
    name: 'Westlands Residency',
    landlord: 'Peter Mwangi',
    location: 'Westlands, Nairobi',
    units: 32,
    status: 'Pending',
  },
  {
    name: 'Greenview Estate',
    landlord: 'Mary Wanjiku',
    location: 'Rongai, Kajiado',
    units: 16,
    status: 'Active',
  },
];

const payments = [
  {
    reference: 'PAY-001',
    payer: 'John Kamau',
    amount: 'KSh 15,000',
    date: '02 Nov 2026',
    status: 'Success',
  },
  {
    reference: 'PAY-002',
    payer: 'Mary Wanjiku',
    amount: 'KSh 22,500',
    date: '01 Nov 2026',
    status: 'Pending',
  },
  {
    reference: 'PAY-003',
    payer: 'Peter Mwangi',
    amount: 'KSh 12,000',
    date: '31 Oct 2026',
    status: 'Failed',
  },
  {
    reference: 'PAY-002',
    payer: 'Mary Wanjiku',
    amount: 'KSh 22,500',
    date: '01 Nov 2026',
    status: 'Pending',
  },
];

const tenantColumns: TableColumn<(typeof tenants)[number]>[] = [
  { key: 'name', header: 'Name' },
  { key: 'accountType', header: 'Account Type' },
  { key: 'email', header: 'Email' },
  { key: 'date', header: 'Registration Date' },
  {
    key: 'status',
    header: 'Status',
    render: (user) => <StatusBadge status={user.status} />,
  },
];

const propertyColumns: TableColumn<(typeof properties)[number]>[] = [
  { key: 'name', header: 'Property' },
  { key: 'landlord', header: 'Landlord' },
  { key: 'location', header: 'Location' },
  { key: 'units', header: 'Units' },
  {
    key: 'status',
    header: 'Status',
    render: (property) => <StatusBadge status={property.status} />,
  },
];

const paymentColumns: TableColumn<(typeof payments)[number]>[] = [
  { key: 'reference', header: 'Reference' },
  { key: 'payer', header: 'Payer' },
  { key: 'amount', header: 'Amount' },
  { key: 'date', header: 'Date' },
  {
    key: 'status',
    header: 'Status',
    render: (payment) => <StatusBadge status={payment.status} />,
  },
];

interface AgencyLandlordAlertsProps {
  isAgency: boolean;
}

export default function AgencyLandlordAlerts({
  isAgency,
}: AgencyLandlordAlertsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tenants');

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-6 overflow-x-auto border-b border-slate-200 px-5 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`whitespace-nowrap border-b-2 pb-4 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'tenants' && (
          <DataTable mode="recent" columns={tenantColumns} data={tenants} />
        )}

        {activeTab === 'properties' && (
          <DataTable
            mode="recent"
            columns={propertyColumns}
            data={properties}
          />
        )}

        {activeTab === 'payments' && (
          <DataTable mode="recent" columns={paymentColumns} data={payments} />
        )}
      </div>
    </div>
  );
}
