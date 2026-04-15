import * as React from 'react';
import { cn } from '../lib/cn';
import { Skeleton } from './skeleton';

/**
 * Form Skeleton - Molecular Component
 * Representa o loading de um formulário
 * 
 * @example
 * ```tsx
 * <FormSkeleton fields={5} showSubmit />
 * ```
 */

export interface FormSkeletonProps {
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Número de campos
   * @default 4
   */
  fields?: number;
  /**
   * Mostrar botão de submit
   * @default true
   */
  showSubmit?: boolean;
}

export const FormSkeleton = ({
  className,
  fields = 4,
  showSubmit = true,
}: FormSkeletonProps) => {
  return (
    <div className={cn('space-y-6', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      {showSubmit && (
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-24" />
        </div>
      )}
    </div>
  );
};

FormSkeleton.displayName = 'FormSkeleton';