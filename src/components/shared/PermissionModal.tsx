'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Button from './Button';
import Modal from './Modal';
import { DropdownResponse } from '@/src/types/dropdown';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: DropdownResponse[];
  selectedIds: number[];
  onApply: (ids: number[]) => void;
}

export default function PermissionModal({
  isOpen,
  onClose,
  permissions,
  selectedIds,
  onApply,
}: PermissionModalProps) {
  const [tempIds, setTempIds] = useState<number[]>(selectedIds);
  const [search, setSearch] = useState('');

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, DropdownResponse[]>>(
      (groups, permission) => {
        const resource = permission.name.split('_')[0];

        if (!groups[resource]) {
          groups[resource] = [];
        }

        groups[resource].push(permission);
        return groups;
      },
      {}
    );
  }, [permissions]);

  const filteredGroups = useMemo(() => {
    return Object.entries(groupedPermissions)
      .map(([resource, items]) => ({
        resource,
        items: items.filter((permission) =>
          permission.name.toLowerCase().includes(search.toLowerCase())
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedPermissions, search]);

  const togglePermissions = (ids: number[]) => {
    setTempIds((current) => {
      const allSelected = ids.every((id) => current.includes(id));

      return allSelected
        ? current.filter((id) => !ids.includes(id))
        : [...new Set([...current, ...ids])];
    });
  };

  const allSelected =
    permissions.length > 0 &&
    permissions.every((permission) => tempIds.includes(permission.id));

  const applyPermissions = () => {
    onApply(tempIds);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Role Permissions"
      description="Choose the permissions this role should have access to."
      className="w-full max-w-2xl"
    >
      <div className="p-6">
        {/* Search */}
        <div className="relative mb-5">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Select all */}
        <label className="mb-4 flex cursor-pointer items-center justify-between rounded-lg border border-blue-200 bg-blue-50/50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Select all permissions
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              Grant access to every available permission.
            </p>
          </div>

          <input
            type="checkbox"
            checked={allSelected}
            onChange={() =>
              togglePermissions(permissions.map((permission) => permission.id))
            }
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
        </label>

        {/* Permission groups */}
        <div className="max-h-[45vh] space-y-3 overflow-y-auto pr-1">
          {filteredGroups.map(({ resource, items }) => {
            const selectedCount = items.filter((permission) =>
              tempIds.includes(permission.id)
            ).length;

            const groupSelected =
              items.length > 0 &&
              items.every((permission) => tempIds.includes(permission.id));

            return (
              <section
                key={resource}
                className="rounded-lg border border-slate-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {resource.replace(/^./, (char) => char.toUpperCase())}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {selectedCount} of {items.length} selected
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={groupSelected}
                    onChange={() =>
                      togglePermissions(items.map((item) => item.id))
                    }
                    aria-label={`Select all ${resource} permissions`}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="grid gap-2 p-4 sm:grid-cols-2">
                  {items.map((permission) => {
                    const checked = tempIds.includes(permission.id);

                    return (
                      <label
                        key={permission.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                          checked
                            ? 'border-blue-300 bg-blue-50/60'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermissions([permission.id])}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span className="text-sm text-slate-700">
                          {permission.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {filteredGroups.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No permissions found.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">
              {tempIds.length}
            </span>{' '}
            permissions selected
          </p>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="button" onClick={applyPermissions}>
              Apply Permissions
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
