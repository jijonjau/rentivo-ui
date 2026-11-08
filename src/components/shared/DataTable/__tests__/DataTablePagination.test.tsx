import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DataTablePagination from '../DataTablePagination';

const defaultProps = {
  currentPage: 1,
  totalPages: 3,
  totalEntries: 26,
  startEntry: 1,
  endEntry: 10,
  pageSize: 10,
  onPageChange: vi.fn(),
  onPageSizeChange: vi.fn(),
};

const renderPagination = (
  props: Partial<React.ComponentProps<typeof DataTablePagination>> = {}
) => render(<DataTablePagination {...defaultProps} {...props} />);

describe('DataTablePagination', () => {
  it('displays the current entry range', () => {
    renderPagination();

    // expect(screen.getByText('Showing')).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) => element?.textContent === 'Showing 1-10 of 26 Entries'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('1-10')).toBeInTheDocument();
    expect(screen.getByText('26')).toBeInTheDocument();
  });

  it('calls onPageChange when Next is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderPagination({ onPageChange });

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when Previous is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderPagination({
      currentPage: 2,
      onPageChange,
    });

    await user.click(screen.getByRole('button', { name: 'Previous' }));

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when a page number is selected', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    renderPagination({ onPageChange });

    await user.click(screen.getByRole('button', { name: '3' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous on the first page', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
  });

  it('disables Next on the last page', () => {
    renderPagination({
      currentPage: 3,
    });

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('marks the current page as active', () => {
    renderPagination({ currentPage: 2 });

    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('calls onPageSizeChange when page size changes', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();

    renderPagination({ onPageSizeChange });

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Rows per page' }),
      '20'
    );

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('renders the first-page layout when there are more than five pages', () => {
    renderPagination({
      totalPages: 10,
      totalEntries: 100,
    });

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '5' })).not.toBeInTheDocument();
  });

  it('renders the middle-page layout', () => {
    renderPagination({
      currentPage: 5,
      totalPages: 10,
      totalEntries: 100,
      startEntry: 41,
      endEntry: 50,
    });

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('renders the last-page layout', () => {
    renderPagination({
      currentPage: 10,
      totalPages: 10,
      totalEntries: 100,
      startEntry: 91,
      endEntry: 100,
    });

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  it('does not render ellipses when there are five or fewer pages', () => {
    renderPagination({
      totalPages: 3,
    });

    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
  });
});
