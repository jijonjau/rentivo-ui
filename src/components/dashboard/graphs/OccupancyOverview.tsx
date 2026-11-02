'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface OccupancyOverviewProps {
  occupied: number;
  vacant: number;
}

const COLORS = ['#2563EB', '#E2E8F0'];

export default function OccupancyOverview({
  occupied,
  vacant,
}: OccupancyOverviewProps) {
  const total = occupied + vacant;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const data = [
    { name: 'Occupied', value: occupied },
    { name: 'Vacant', value: vacant },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-semibold text-slate-900">Occupancy Overview</h3>
        <p className="mt-1 text-xs text-slate-500">
          Overview of your property units
        </p>
      </div>

      <div className="relative mt-4 h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip formatter={(value, name) => [`${value} units`, name]} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900">
            {occupancyRate}%
          </span>
          <span className="text-xs text-slate-500">Occupancy</span>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span className="text-sm text-slate-600">Occupied Units</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">
            {occupied}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            <span className="text-sm text-slate-600">Vacant Units</span>
          </div>
          <span className="text-sm font-semibold text-slate-900">{vacant}</span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-sm font-medium text-slate-600">
            Total Units
          </span>
          <span className="text-sm font-semibold text-slate-900">{total}</span>
        </div>
      </div>
    </div>
  );
}
