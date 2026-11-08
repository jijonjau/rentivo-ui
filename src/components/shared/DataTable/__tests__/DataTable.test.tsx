import { TableColumn } from '@/src/types/table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DataTable from '../DataTable';

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt ?? ''} />
  ),
}));

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

const renderRecentTable = (data = agencies) =>
  render(<DataTable mode="recent" columns={columns} data={data} />);

const renderDetailedTable = (
  props: Partial<React.ComponentProps<typeof DataTable<Agency>>> = {}
) =>
  render(
    <DataTable mode="detailed" columns={columns} data={agencies} {...props} />
  );

describe('DataTable', () => {
  describe('Rendering', () => {
    it('renders the supplied column headings', () => {
      renderRecentTable();

      expect(screen.getByText('Agency Name')).toBeInTheDocument();
      expect(screen.getByText('Registration Number')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders the supplied records', () => {
      renderRecentTable(agencies.slice(0, 2));

      expect(screen.getByText('Agency 1')).toBeInTheDocument();
      expect(screen.getByText('Agency 2')).toBeInTheDocument();
    });

    it('renders custom column content', () => {
      const customColumns: TableColumn<Agency>[] = [
        {
          key: 'name',
          header: 'Agency',
          render: (agency) => <strong>{agency.name.toUpperCase()}</strong>,
        },
      ];

      render(
        <DataTable
          mode="recent"
          columns={customColumns}
          data={agencies.slice(0, 1)}
        />
      );

      expect(screen.getByText('AGENCY 1')).toBeInTheDocument();
    });

    it('applies a custom column className', () => {
      const customColumns: TableColumn<Agency>[] = [
        {
          key: 'name',
          header: 'Agency',
          className: 'custom-column',
        },
      ];

      render(
        <DataTable
          mode="recent"
          columns={customColumns}
          data={agencies.slice(0, 1)}
        />
      );

      expect(screen.getByText('Agency 1')).toHaveClass('custom-column');
    });

    it('displays a dash for missing values', () => {
      const data = [
        {
          id: 1,
          name: 'Test Agency',
          registrationNumber: undefined,
          status: null,
        },
      ] as unknown as Agency[];

      renderRecentTable(data);

      const row = screen.getByRole('row', { name: /Test Agency/ });

      expect(within(row).getAllByText('-')).toHaveLength(2);
    });

    it('displays only the first 10 records in recent mode', () => {
      renderRecentTable();

      expect(screen.getByText('Agency 1')).toBeInTheDocument();
      expect(screen.getByText('Agency 10')).toBeInTheDocument();

      expect(screen.queryByText('Agency 11')).not.toBeInTheDocument();
      expect(screen.queryByText('Agency 26')).not.toBeInTheDocument();
    });
  });

  describe('Recent mode', () => {
    it('does not render the search toolbar', () => {
      renderRecentTable();

      expect(
        screen.queryByPlaceholderText('Search...')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Filter' })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).not.toBeInTheDocument();
    });

    it('does not render the Actions column', () => {
      renderRecentTable();

      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
    });

    it('does not render pagination', () => {
      renderRecentTable();

      expect(
        screen.queryByRole('button', { name: 'Next' })
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
  });

  describe('Detailed mode', () => {
    it('renders the search toolbar and Actions column', () => {
      renderDetailedTable();

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Filter' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Export' })
      ).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('uses the supplied search placeholder', () => {
      renderDetailedTable({
        searchPlaceholder: 'Search agencies by name...',
      });

      expect(
        screen.getByPlaceholderText('Search agencies by name...')
      ).toBeInTheDocument();
    });

    it('renders the Add button when onAdd is supplied', () => {
      renderDetailedTable({ onAdd: vi.fn() });

      expect(
        screen.getByRole('button', { name: /Add New/ })
      ).toBeInTheDocument();
    });

    it('uses the supplied addLabel', () => {
      renderDetailedTable({
        onAdd: vi.fn(),
        addLabel: 'Add Agency',
      });

      expect(
        screen.getByRole('button', { name: /Add Agency/ })
      ).toBeInTheDocument();
    });

    it('does not render the Add button when onAdd is omitted', () => {
      renderDetailedTable();

      expect(
        screen.queryByRole('button', { name: /Add New/ })
      ).not.toBeInTheDocument();
    });

    it('calls onAdd when Add is clicked', async () => {
      const user = userEvent.setup();
      const onAdd = vi.fn();

      renderDetailedTable({ onAdd });

      await user.click(screen.getByRole('button', { name: /Add New/ }));

      expect(onAdd).toHaveBeenCalledOnce();
    });

    it('calls onFilter when Filter is clicked', async () => {
      const user = userEvent.setup();
      const onFilter = vi.fn();

      renderDetailedTable({ onFilter });

      await user.click(screen.getByRole('button', { name: 'Filter' }));

      expect(onFilter).toHaveBeenCalledOnce();
    });

    it('calls onExport when Export is clicked', async () => {
      const user = userEvent.setup();
      const onExport = vi.fn();

      renderDetailedTable({ onExport });

      await user.click(screen.getByRole('button', { name: 'Export' }));

      expect(onExport).toHaveBeenCalledOnce();
    });
  });

  describe('Search', () => {
    it('filters records by name', async () => {
      const user = userEvent.setup();

      renderDetailedTable();

      await user.type(screen.getByPlaceholderText('Search...'), 'Agency 1');

      expect(screen.getByText('Agency 1')).toBeInTheDocument();
      expect(screen.getByText('Agency 10')).toBeInTheDocument();
      expect(screen.queryByText('Agency 2')).not.toBeInTheDocument();
    });

    it('uses the supplied columns for searching', async () => {
      const user = userEvent.setup();

      renderDetailedTable();

      await user.type(screen.getByPlaceholderText('Search...'), 'REG-2');

      expect(screen.getByText('Agency 2')).toBeInTheDocument();
      expect(screen.queryByText('Agency 1')).not.toBeInTheDocument();
    });

    it('displays the empty state when no records match', async () => {
      const user = userEvent.setup();

      renderDetailedTable();

      await user.type(
        screen.getByPlaceholderText('Search...'),
        'Nonexistent Agency'
      );

      expect(screen.getByText('No records found.')).toBeInTheDocument();
      expect(screen.getByAltText('No records found')).toBeInTheDocument();
    });
  });

  describe('Empty state', () => {
    it('renders the default empty message', () => {
      renderRecentTable([]);

      expect(screen.getByText('No records found.')).toBeInTheDocument();
      expect(screen.getByAltText('No records found')).toBeInTheDocument();
    });

    it('renders a custom empty message', () => {
      render(
        <DataTable
          mode="recent"
          columns={columns}
          data={[]}
          emptyMessage="No agencies found."
        />
      );

      expect(screen.getByText('No agencies found.')).toBeInTheDocument();
    });

    it('hides the message when an empty string is supplied', () => {
      render(
        <DataTable mode="recent" columns={columns} data={[]} emptyMessage="" />
      );

      expect(screen.queryByText('No records found.')).not.toBeInTheDocument();
    });

    it('does not render pagination when there are no records', () => {
      renderDetailedTable({ data: [] });

      expect(
        screen.queryByRole('button', { name: 'Next' })
      ).not.toBeInTheDocument();
    });
  });

  describe('Row actions', () => {
    it('renders the default row action button', () => {
      renderDetailedTable({ data: agencies.slice(0, 1) });

      expect(
        screen.getByRole('button', { name: 'Row actions' })
      ).toBeInTheDocument();
    });

    it('renders custom row actions', () => {
      renderDetailedTable({
        data: agencies.slice(0, 1),
        renderActions: (agency) => (
          <button type="button">View {agency.name}</button>
        ),
      });

      expect(
        screen.getByRole('button', { name: 'View Agency 1' })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Row actions' })
      ).not.toBeInTheDocument();
    });

    it('passes the correct row to renderActions', () => {
      const renderActions = vi.fn(() => <button type="button">View</button>);

      renderDetailedTable({
        data: agencies.slice(0, 2),
        renderActions,
      });

      expect(renderActions).toHaveBeenCalledTimes(2);
      expect(renderActions).toHaveBeenNthCalledWith(1, agencies[0]);
      expect(renderActions).toHaveBeenNthCalledWith(2, agencies[1]);
    });
  });
});
