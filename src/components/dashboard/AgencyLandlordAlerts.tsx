import {
  Wallet,
  AlertCircle,
  CalendarDays,
  House,
  ArrowUpRight,
} from 'lucide-react';

const alerts = [
  {
    title: 'Pending Rent Payments',
    value: '15',
    description: 'Awaiting payment',
    icon: Wallet,
    color: 'amber',
  },
  {
    title: 'Unresolved Issues',
    value: '12',
    description: 'Require attention',
    icon: AlertCircle,
    color: 'red',
  },
  {
    title: 'Vacant Units',
    value: '18',
    description: 'Available for occupancy',
    icon: House,
    color: 'blue',
  },
  {
    title: 'Lease Expirations',
    value: '7',
    description: 'Expiring within 30 days',
    icon: CalendarDays,
    color: 'amber',
  },
];

const colorStyles = {
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  blue: 'bg-blue-50 text-blue-600',
};

interface AgencyLandlordAlertsProps {
  isAgency: boolean;
}

export default function AgencyLandlordAlerts({
  isAgency,
}: AgencyLandlordAlertsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Platform Alerts</h3>
          <p className="mt-1 text-xs text-slate-500">
            Items that may require your attention
          </p>
        </div>

        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
          View all
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <div
              key={alert.title}
              className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  colorStyles[alert.color as keyof typeof colorStyles]
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500">{alert.title}</p>
                <p className="mt-0.5 text-lg font-semibold text-slate-900">
                  {alert.value}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {alert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
