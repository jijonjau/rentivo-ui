import { TableColumn } from '@/src/types/table';
import { useMemo, useState } from 'react';

interface UseDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  mode: 'recent' | 'detailed';
}

const RECENT_LIMIT = 10;

export default function useDataTable<T>({
  data,
  columns,
  mode,
}: UseDataTableProps<T>) {
  const [search, setSearchState] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const isDetailed = mode === 'detailed';

  // Search and filtering
  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query || !isDetailed) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = (row as Record<string, unknown>)[String(column.key)];

        return String(value ?? '')
          .toLowerCase()
          .includes(query);
      })
    );
  }, [data, columns, search, isDetailed]);

  // Pagination calculations
  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / pageSize);

  // Keep the active page within valid bounds
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  //   useEffect(() => {
  //     if (currentPage !== safeCurrentPage) {
  //       setCurrentPage(safeCurrentPage);
  //     }
  //   }, [currentPage, safeCurrentPage]);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;

    return filteredData.slice(start, start + pageSize);
  }, [filteredData, safeCurrentPage, pageSize]);

  // Recent mode intentionally displays only 10 records.
  const displayedData = isDetailed
    ? paginatedData
    : data.slice(0, RECENT_LIMIT);

  const startEntry =
    totalEntries === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;

  const endEntry = Math.min(safeCurrentPage * pageSize, totalEntries);

  const setSearch = (value: string) => {
    setSearchState(value);
    setCurrentPage(1);
  };

  const setPageSize = (value: number) => {
    setPageSizeState(value);
    setCurrentPage(1);
  };

  const changePage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, Math.max(totalPages, 1))));
  };

  return {
    search,
    setSearch,
    currentPage: safeCurrentPage,
    pageSize,
    setPageSize,
    displayedData,
    totalEntries,
    totalPages,
    startEntry,
    endEntry,
    changePage,
  };
}
