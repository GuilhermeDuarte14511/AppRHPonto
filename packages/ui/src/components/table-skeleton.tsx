import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * Table Skeleton - Molecular Component
 * Representa o loading de uma tabela
 * 
 * @example
 * ```tsx
 * <TableSkeleton rows={5} columns={4} showHeader showActions />
 * ```
 */

export interface TableSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Número de linhas
   * @default 5
   */
  rows?: number;
  /**
   * Número de colunas
   * @default 4
   */
  columns?: number;
  /**
   * Mostrar cabeçalho
   * @default true
   */
  showHeader?: boolean;
  /**
   * Mostrar coluna de ações
   * @default false
   */
  showActions?: boolean;
}

export const TableSkeleton = ({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
  showActions = false,
}: TableSkeletonProps) => {
  const actualColumns = showActions ? columns + 1 : columns;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex gap-4 pb-3 border-b border-[var(--border)]">
          {Array.from({ length: actualColumns }).map((_, i) => (
            <Skeleton
              key={`header-${i}`}
              className={cn(
                'h-4',
                i === actualColumns - 1 && showActions ? 'w-20' : 'flex-1'
              )}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 items-center py-2">
          {Array.from({ length: actualColumns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={cn(
                'h-10',
                colIndex === actualColumns - 1 && showActions
                  ? 'w-20'
                  : 'flex-1'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

TableSkeleton.displayName = 'TableSkeleton';