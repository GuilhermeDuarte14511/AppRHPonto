import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * List Item Skeleton - Molecular Component
 * Representa o loading de um item de lista
 * 
 * @example
 * ```tsx
 * <ListItemSkeleton showAvatar showActions />
 * ```
 */

export interface ListItemSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Mostrar avatar
   * @default true
   */
  showAvatar?: boolean;
  /**
   * Mostrar ações
   * @default false
   */
  showActions?: boolean;
}

export const ListItemSkeleton = ({
  className,
  showAvatar = true,
  showActions = false,
}: ListItemSkeletonProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 border-b border-[var(--border)]',
        className
      )}
    >
      {showAvatar && (
        <Skeleton variant="circular" className="h-10 w-10 shrink-0" />
      )}
      
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      
      {showActions && (
        <Skeleton className="h-8 w-20 shrink-0" />
      )}
    </div>
  );
};

ListItemSkeleton.displayName = 'ListItemSkeleton';