'use client';

import { Search, Filter, Download, MoreVertical, Plus } from 'lucide-react';
import Image from 'next/image';
import Button from '../Button';
import FormInput from '../FormInput';
import DataTablePagination from './DataTablePagination';
import { DataTableProps } from '@/src/types/table';
import useDataTable from '@/src/utils/customHooks/useDataTable';

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

  const {
    search,
    setSearch,
    currentPage,
    pageSize,
    setPageSize,
    displayedData,
    totalEntries,
    totalPages,
    startEntry,
    endEntry,
    changePage,
  } = useDataTable({
    data,
    columns,
    mode,
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Toolbar */}
      {isDetailed && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div className="w-full sm:w-[420px] lg:w-[480px]">
            <FormInput
              id="table-search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
            {displayedData.length > 0 ? (
              displayedData.map((row, index) => (
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

      {/* Pagination */}
      {isDetailed && totalEntries > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          startEntry={startEntry}
          endEntry={endEntry}
          pageSize={pageSize}
          onPageChange={changePage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  );
}
