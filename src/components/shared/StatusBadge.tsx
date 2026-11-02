const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  Success: 'bg-green-100 text-green-700',
  Resolved: 'bg-teal-100 text-teal-700',

  Pending: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',

  Open: 'bg-orange-100 text-orange-700',
  Failed: 'bg-rose-100 text-rose-700',
  Rejected: 'bg-red-100 text-red-700',
  Disabled: 'bg-slate-200 text-slate-700',
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        statusStyles[status] ?? 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  );
}
