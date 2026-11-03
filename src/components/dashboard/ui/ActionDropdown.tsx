'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { ReactNode } from 'react';

export interface ActionDropdownItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
}

export default function ActionDropdown({ items }: ActionDropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="More actions"
        >
          <MoreVertical size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 min-w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg outline-none"
        >
          {items.map((item, index) => (
            <DropdownMenu.Item
              key={index}
              disabled={item.disabled}
              onSelect={item.onClick}
              className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition
                data-[highlighted]:bg-slate-100
                data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50
                ${
                  item.variant === 'danger'
                    ? 'text-red-600 data-[highlighted]:bg-red-50'
                    : 'text-slate-700'
                }`}
            >
              {item.icon}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
