import { TableColumn } from '@/src/types/table';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useDataTable from './useDataTable';

interface Agency {
  id: number;
  name: string;
  registrationNumber: string;
  status: string;
}

const agencies: Agency[] = Array.from({ length: 26 }, (_, index) => ({
  id: index + 1,
  name: `Agency ${index + 1}`,
  registrationNumber: `REG-${index + 1}`,
  status: index % 2 === 0 ? 'Active' : 'Pending',
}));

const columns: TableColumn<Agency>[] = [
  { key: 'name', header: 'Agency Name' },
  { key: 'registrationNumber', header: 'Registration Number' },
  { key: 'status', header: 'Status' },
];

const renderDataTable = (
  data = agencies,
  mode: 'recent' | 'detailed' = 'detailed'
) =>
  renderHook(() =>
    useDataTable({
      data,
      columns,
      mode,
    })
  );

describe('useDataTable', () => {
  describe('Search and filtering', () => {
    it('returns all records when search is empty', () => {
      const { result } = renderDataTable();

      expect(result.current.displayedData).toHaveLength(10);
      expect(result.current.totalEntries).toBe(26);
    });

    it('filters records by matching values', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.setSearch('Agency 1');
      });

      expect(result.current.displayedData).toHaveLength(10);
      expect(result.current.totalEntries).toBe(11);
      expect(result.current.displayedData[0].name).toBe('Agency 1');
    });

    it('searches without case sensitivity', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.setSearch('agency 1');
      });

      expect(result.current.totalEntries).toBe(11);
    });

    it('trims whitespace from the search query', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.setSearch('  Agency 1  ');
      });

      expect(result.current.totalEntries).toBe(11);
    });

    it('searches across multiple columns', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.setSearch('REG-2');
      });

      expect(result.current.totalEntries).toBe(8);
      expect(
        result.current.displayedData.some(
          (agency) => agency.name === 'Agency 2'
        )
      ).toBe(true);
    });

    it('returns all records when the search is cleared', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.setSearch('Agency 1');
      });

      expect(result.current.totalEntries).toBe(11);

      act(() => {
        result.current.setSearch('');
      });

      expect(result.current.totalEntries).toBe(26);
    });

    it('handles records with missing values', () => {
      const data = [
        {
          id: 1,
          name: 'Test Agency',
          registrationNumber: undefined,
          status: null,
        },
      ] as unknown as Agency[];

      const { result } = renderDataTable(data);

      act(() => {
        result.current.setSearch('test');
      });

      expect(result.current.totalEntries).toBe(1);
      expect(result.current.displayedData[0].name).toBe('Test Agency');
    });
  });

  describe('Recent mode', () => {
    it('limits displayed records to 10', () => {
      const { result } = renderDataTable(agencies, 'recent');

      expect(result.current.displayedData).toHaveLength(10);
      expect(result.current.displayedData[0].name).toBe('Agency 1');
      expect(result.current.displayedData[9].name).toBe('Agency 10');
    });

    it('does not apply detailed-mode searching', () => {
      const { result } = renderDataTable(agencies, 'recent');

      act(() => {
        result.current.setSearch('Agency 1');
      });

      expect(result.current.displayedData).toHaveLength(10);
      expect(result.current.displayedData[1].name).toBe('Agency 2');
    });

    it('returns fewer than 10 records when fewer are supplied', () => {
      const { result } = renderDataTable(agencies.slice(0, 5), 'recent');

      expect(result.current.displayedData).toHaveLength(5);
    });
  });

  describe('Pagination', () => {
    it('starts on the first page with a default page size of 10', () => {
      const { result } = renderDataTable();

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.startEntry).toBe(1);
      expect(result.current.endEntry).toBe(10);
    });

    it('moves to the next page', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.displayedData[0].name).toBe('Agency 11');
      expect(result.current.startEntry).toBe(11);
      expect(result.current.endEntry).toBe(20);
    });

    it('moves to the last page', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(3);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.displayedData).toHaveLength(6);
      expect(result.current.startEntry).toBe(21);
      expect(result.current.endEntry).toBe(26);
    });

    it('does not navigate beyond the available pages', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(100);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('does not navigate below the first page', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(-1);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('resets to the first page when search changes', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(2);
      });

      act(() => {
        result.current.setSearch('Agency 1');
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.startEntry).toBe(1);
    });

    it('changes page size and resets to the first page', () => {
      const { result } = renderDataTable();

      act(() => {
        result.current.changePage(2);
      });

      act(() => {
        result.current.setPageSize(5);
      });

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(5);
      expect(result.current.displayedData).toHaveLength(5);
      expect(result.current.totalPages).toBe(6);
    });

    // it('adjusts the current page when the supplied data shrinks', async () => {
    //   const { result, rerender } = renderDataTable();

    //   act(() => {
    //     result.current.changePage(3);
    //   });

    //   expect(result.current.currentPage).toBe(3);

    //   rerender();

    //   // Replace the hook's data with a smaller dataset.
    //   // The updated dataset is tested in the next case.
    // });

    it('keeps the current page within bounds when data changes', async () => {
      const { result, rerender } = renderHook(
        ({ data }) =>
          useDataTable({
            data,
            columns,
            mode: 'detailed',
          }),
        {
          initialProps: { data: agencies },
        }
      );

      act(() => {
        result.current.changePage(3);
      });

      expect(result.current.currentPage).toBe(3);

      rerender({ data: agencies.slice(0, 12) });

      await waitFor(() => {
        expect(result.current.currentPage).toBe(2);
      });

      expect(result.current.displayedData).toHaveLength(2);
      expect(result.current.startEntry).toBe(11);
      expect(result.current.endEntry).toBe(12);
    });

    it('handles empty data without invalid pagination', () => {
      const { result } = renderDataTable([]);

      expect(result.current.totalEntries).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.displayedData).toHaveLength(0);
      expect(result.current.startEntry).toBe(0);
      expect(result.current.endEntry).toBe(0);
    });
  });
});
