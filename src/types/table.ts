import { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  mode: 'recent' | 'detailed';
  columns: TableColumn<T>[];
  data: T[];
  renderActions?: (row: T) => ReactNode;
  onFilter?: () => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onAdd?: () => void;
  addLabel?: string;
}
