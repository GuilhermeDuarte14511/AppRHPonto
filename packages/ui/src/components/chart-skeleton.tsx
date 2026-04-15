import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * Chart Skeleton - Molecular Component
 * Representa o loading de um gráfico
 * 
 * @example
 * ```tsx
 * <ChartSkeleton height="h-64" />
 * ```
 */

export interface ChartSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Altura do gráfico
   * @default "h-64"
   */
  height?: string;
}

export const ChartSkeleton = ({
  className,
  height = 'h-64',
}: ChartSkeletonProps) => {
  return (
    <div className={cn('border border-[var(--border)] rounded-[var(--radius-lg)] p-6', className)}>
      <Skeleton className="h-6 w-48 mb-6" />
      <div className={cn('flex items-end gap-2', height)}>
        {Array.from({ length: 7 }).map((_, i) => {
          const randomHeight = Math.floor(Math.random() * 60) + 40;
          return (
            <Skeleton
              key={i}
              className="flex-1 rounded-t-md"
              style={{ height: `${randomHeight}%` }}
            />
          );
        })}
      </div>
    </div>
  );
};

ChartSkeleton.displayName = 'ChartSkeleton';