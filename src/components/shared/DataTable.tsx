'use client';

import { ReactNode, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  MoreVertical,
  Plus,
} from 'lucide-react';
import Button from './Button';
import FormInput from './FormInput';
import Image from 'next/image';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  mode: 'recent' | 'detailed';
  columns: TableColumn<T>[];
  data: T[];
  renderActions?: (row: T) => ReactNode;
  onFilter?: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  // emptyImage?: ReactNode;
  emptyMessage?: string;
  onAdd?: () => void;
  addLabel?: string;
}

export default function DataTable<T>({
  mode,
  columns,
  data,
  renderActions,
  onFilter,
  onExport,
  searchPlaceholder = 'Search...',
  emptyMessage = 'No records found.',
  onAdd,
  addLabel,
}: DataTableProps<T>) {
  const isDetailed = mode === 'detailed';

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Local search
  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = (row as Record<string, unknown>)[String(column.key)];

        return String(value ?? '')
          .toLowerCase()
          .includes(query);
      })
    );
  }, [data, columns, search]);

  // Local pagination
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  const changePage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages] as const;
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        '...',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ] as const;
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ] as const;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Table toolbar */}
      {mode === 'detailed' && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div className="w-full sm:w-[420px] lg:w-[480px]">
            <FormInput
              id="table-search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search size={17} />}
              className="!py-2"
            />
          </div>
          <div className="flex items-center gap-2">
            {onAdd && (
              <Button leftIcon={<Plus size={17} />} onClick={onAdd}>
                {addLabel ?? 'Add New'}
              </Button>
            )}

            <Button
              variant="outline"
              leftIcon={<Filter size={17} />}
              onClick={onFilter}
            >
              Filter
            </Button>

            <Button leftIcon={<Download size={16} />} onClick={onExport}>
              Export
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-4 py-3">
                  {column.header}
                </th>
              ))}

              {isDetailed && (
                <th className="w-12 px-2 py-3 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className="text-slate-600">
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`px-3 py-2 ${column.className ?? ''}`}
                    >
                      {column.render
                        ? column.render(row)
                        : String(
                            (row as Record<string, unknown>)[
                              String(column.key)
                            ] ?? '-'
                          )}
                    </td>
                  ))}

                  {isDetailed && (
                    <td className="w-12 px-2 py-2 text-center">
                      <div className="flex items-center justify-center">
                        {renderActions?.(row) ?? (
                          <button
                            type="button"
                            aria-label="Row actions"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                          >
                            <MoreVertical size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (isDetailed ? 1 : 0)}
                  className="px-5 py-12"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-4">
                      <Image
                        src="/images/empty.svg"
                        alt="No records found"
                        width={300}
                        height={260}
                      />
                    </div>

                    {emptyMessage && (
                      <p className="text-sm font-medium text-slate-600">
                        {emptyMessage}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - detailed mode */}
      {isDetailed && totalEntries > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4">
          {/* Entry count */}
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-700">
              {startEntry}-{endEntry}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-700">{totalEntries}</span>{' '}
            Entries
          </p>

          {/* Page navigation */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
              className="flex h-8 items-center gap-1 rounded-lg border-0 px-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {getPageNumbers().map((page, index) =>
              page === '...' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-7 items-center justify-center text-slate-400"
                >
                  <MoreHorizontal size={18} />
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => changePage(page)}
                  className={`h-8 min-w-8 rounded-lg border-0 px-2 text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-transparent text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => changePage(currentPage + 1)}
              className="flex h-8 items-center gap-1 rounded-lg border-0 px-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Page size */}
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <span className="whitespace-nowrap text-sm text-slate-500">
              per page
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
