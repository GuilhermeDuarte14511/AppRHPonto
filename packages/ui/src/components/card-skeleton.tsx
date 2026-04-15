import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * Card Skeleton - Molecular Component
 * Representa o loading de um card genérico
 * 
 * @example
 * ```tsx
 * <CardSkeleton lines={3} showAvatar showActions />
 * ```
 */

export interface CardSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Número de linhas de texto
   * @default 3
   */
  lines?: number;
  /**
   * Mostrar avatar/ícone
   * @default false
   */
  showAvatar?: boolean;
  /**
   * Mostrar botões de ação
   * @default false
   */
  showActions?: boolean;
}

export const CardSkeleton = ({
  className,
  lines = 3,
  showAvatar = false,
  showActions = false,
}: CardSkeletonProps) => {
  return (
    <div
      className={cn(
        'border border-[var(--border)] rounded-[var(--radius-lg)] p-6 space-y-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        {showAvatar && (
          <Skeleton variant="circular" className="h-12 w-12 shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* Content Lines */}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'h-4',
              i === lines - 1 ? 'w-5/6' : 'w-full' // Última linha menor
            )}
          />
        ))}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      )}
    </div>
  );
};

CardSkeleton.displayName = 'CardSkeleton';