'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface UserGrowthData {
  label: string;
  users: number;
}

interface UserGrowthProps {
  total: string | number;
  data: UserGrowthData[];
  title?: string;
}

export default function UserGrowth({
  total,
  data,
  title = 'User Growth',
}: UserGrowthProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">New user registrations</p>
      </div>

      {/* Total */}
      <div className="mt-6">
        <p className="text-2xl font-bold text-slate-900">
          {total.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-slate-500">Total registered users</p>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[260px] w-full">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#E2E8F0"
              />

              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748B', fontSize: 12 }}
                allowDecimals={false}
              />

              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  'New Users',
                ]}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                }}
              />

              <Bar
                dataKey="users"
                fill="#10B981"
                radius={[5, 5, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            No user registration data available.
          </div>
        )}
      </div>
    </div>
  );
}
