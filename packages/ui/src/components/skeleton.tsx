import { cn } from '../lib/cn';

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    aria-hidden="true"
    className={cn(
      'animate-pulse rounded-[var(--radius-md)] bg-[color:color-mix(in_srgb,var(--surface-container-high)_76%,white)]',
      className,
    )}
  />
);
