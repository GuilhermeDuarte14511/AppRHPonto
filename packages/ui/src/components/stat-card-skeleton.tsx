import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * Stat Card Skeleton - Molecular Component
 * Representa o loading de um card de estatística
 * 
 * @example
 * ```tsx
 * <StatCardSkeleton />
 * ```
 */

export interface StatCardSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export const StatCardSkeleton = ({ className }: StatCardSkeletonProps) => {
  return (
    <div
      className={cn(
        'border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton variant="circular" className="h-12 w-12" />
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

StatCardSkeleton.displayName = 'StatCardSkeleton';