import * as React from 'react';

import { cn } from '../lib/cn';

interface Column<TItem> {
  key: keyof TItem | string;
  label: string;
  render?: (item: TItem) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<TItem> {
  columns: Column<TItem>[];
  items: TItem[];
  getRowKey: (item: TItem) => string;
  className?: string;
  emptyState?: React.ReactNode;
}

const getColumnContent = <TItem,>(column: Column<TItem>, item: TItem) =>
  column.render ? column.render(item) : String(item[column.key as keyof TItem] ?? '-');

export const DataTable = <TItem,>({
  columns,
  items,
  getRowKey,
  className,
  emptyState,
}: DataTableProps<TItem>) => (
  <div
    className={cn(
      'overflow-hidden rounded-[var(--radius-lg)] border border-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-card)]',
      className,
    )}
  >
    <div className="md:hidden">
      {items.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-[var(--on-surface-variant)]">
          {emptyState ?? 'Nenhum registro encontrado.'}
        </div>
      ) : (
        <div className="divide-y divide-[color:color-mix(in_srgb,var(--outline-variant)_14%,transparent)]">
          {items.map((item) => (
            <article key={getRowKey(item)} className="space-y-4 px-4 py-5">
              {columns.map((column) => (
                <div key={String(column.key)} className="space-y-1.5">
                  <p className="font-headline text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--on-surface-variant)]">
                    {column.label}
                  </p>
                  <div className="text-sm text-[var(--on-surface)]">{getColumnContent(column, item)}</div>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </div>

    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="bg-[color:color-mix(in_srgb,var(--surface-container-low)_64%,white)] text-[var(--on-surface-variant)]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'px-4 py-4 font-headline text-[10px] font-extrabold uppercase tracking-[0.14em] lg:px-6 lg:py-5',
                  column.className,
                  column.headerClassName,
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td className="px-4 py-10 text-center text-sm text-[var(--on-surface-variant)] lg:px-6 lg:py-12" colSpan={columns.length}>
                {emptyState ?? 'Nenhum registro encontrado.'}
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr
                key={getRowKey(item)}
                className={cn(
                  'text-[var(--on-surface)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--surface-container-low)_70%,white)]',
                  index % 2 === 1 ? 'bg-[color:color-mix(in_srgb,var(--surface-container-low)_30%,transparent)]' : '',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn('px-4 py-4 align-middle text-sm lg:px-6', column.className, column.cellClassName)}
                  >
                    {getColumnContent(column, item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);
