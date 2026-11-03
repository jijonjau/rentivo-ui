'use client';

import { Bell, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface DashboardHeaderProps {
  name: string;
  role: string;
  avatar?: string;
}

export default function DashboardHeader({
  name,
  role,
  avatar,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-end border-b border-slate-200 bg-white px-8">
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button
          className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <Bell size={21} strokeWidth={1.8} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* User Profile */}
        <button className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" />
            ) : (
              name
                .split(' ')
                .map((part) => part[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()
            )}
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">{name}</p>
            <p className="text-xs text-slate-500">{role.toLowerCase()}</p>
          </div>

          <ChevronDown size={17} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}
