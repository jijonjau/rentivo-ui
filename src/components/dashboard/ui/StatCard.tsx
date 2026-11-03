import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  trend?: 'up' | 'down';
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  trend,
  description = 'from last month',
}: StatCardProps) {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Title and Icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>

      {/* Value */}
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      {/* Trend */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`flex items-center gap-1 font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          <TrendIcon size={14} />
          {Math.abs(change ?? 0)}%
        </span>

        <span className="text-slate-500">{description}</span>
      </div>
    </div>
  );
}
