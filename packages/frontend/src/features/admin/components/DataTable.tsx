import { useState, useMemo, type ReactNode } from 'react';
import { Input, Pagination, Skeleton } from '@/design-system/components';
import { cn } from '@/utils';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
  rowKey: keyof T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  pagination,
  actions,
  emptyMessage = 'No data available',
  rowKey,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle sort
  const handleSort = (accessor: keyof T | ((row: T) => ReactNode)) => {
    if (typeof accessor === 'function') return; // Can't sort by function accessors

    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  // Sort and filter data
  const processedData = useMemo(() => {
    let result = [...data];

    // Client-side search if no onSearch callback
    if (searchQuery && !onSearch) {
      result = result.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Client-side sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchQuery, sortColumn, sortDirection, onSearch]);

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor];
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-hover border-b border-border">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      'px-6 py-3 text-left text-xs font-medium text-fg-secondary uppercase tracking-wider',
                      column.sortable && 'cursor-pointer hover:bg-surface-hover/80',
                      column.className
                    )}
                    onClick={() =>
                      column.sortable && typeof column.accessor !== 'function'
                        ? handleSort(column.accessor)
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && sortColumn === column.accessor && (
                        <span className="text-accent">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-fg-secondary uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    )}
                  </tr>
                ))
              ) : processedData.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-6 py-12 text-center text-fg-secondary"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                // Data rows
                processedData.map((row) => (
                  <tr
                    key={String(row[rowKey])}
                    className="hover:bg-surface-hover transition-colors"
                  >
                    {columns.map((column, index) => (
                      <td key={index} className={cn('px-6 py-4 text-sm text-fg', column.className)}>
                        {column.render
                          ? column.render(getCellValue(row, column), row)
                          : String(getCellValue(row, column) ?? '')}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.ceil(pagination.total / pagination.pageSize)}
            onPageChange={pagination.onPageChange}
          />
        </div>
      )}
    </div>
  );
}
