import * as React from 'react';
import { cn } from '../lib/cn';

/**
 * Skeleton Component - Atomic Design Pattern
 * Componente primitivo para estados de loading
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" className="w-full" />
 * <Skeleton variant="circular" className="h-12 w-12" />
 * <Skeleton variant="rectangular" className="h-32" />
 * ```
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variante visual do skeleton
   * @default "rectangular"
   */
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  /**
   * Tipo de animação
   * @default "pulse"
   */
  animation?: 'pulse' | 'wave' | 'shimmer' | 'none';
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export const Skeleton = ({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  ...props
}: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-[var(--radius-md)]',
    circular: 'rounded-full',
    rounded: 'rounded-[var(--radius-lg)]',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-skeleton-wave bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%]',
    shimmer: 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
    none: '',
  };

  return (
    <div
      role="status"
      aria-label="Carregando..."
      aria-live="polite"
      className={cn(
        'bg-[color:color-mix(in_srgb,var(--surface-container-high)_76%,white)]',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  );
};

Skeleton.displayName = 'Skeleton';
