import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalEntries: number;
  startEntry: number;
  endEntry: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export default function DataTablePagination({
  currentPage,
  totalPages,
  totalEntries,
  startEntry,
  endEntry,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
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
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4">
      {/* Entry count */}
      <p className="text-sm text-slate-500">
        Showing{' '}
        <span className="font-medium text-slate-700">
          {startEntry}-{endEntry}
        </span>{' '}
        of <span className="font-medium text-slate-700">{totalEntries}</span>{' '}
        Entries
      </p>

      {/* Page navigation */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
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
              aria-current={currentPage === page ? 'page' : undefined}
              onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 items-center gap-1 rounded-lg border-0 px-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-300"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Page size */}
      <div className="flex items-center gap-2">
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
  );
}
