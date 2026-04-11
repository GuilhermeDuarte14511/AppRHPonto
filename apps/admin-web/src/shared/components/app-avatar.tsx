'use client';

import { cn } from '@rh-ponto/ui';

interface AppAvatarProps {
  name: string;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMeta?: boolean;
}

const avatarSizes = {
  sm: 'h-9 w-9 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
} as const;

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const AppAvatar = ({ name, email, size = 'md', className, showMeta = false }: AppAvatarProps) => (
  <div className={cn('flex items-center gap-3', className)}>
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border border-[color:color-mix(in_srgb,var(--outline-variant)_18%,transparent)] bg-[linear-gradient(135deg,var(--primary-fixed),white)] font-headline font-extrabold text-[var(--primary)]',
        avatarSizes[size],
      )}
    >
      {getInitials(name)}
    </div>
    {showMeta ? (
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[var(--on-surface)]">{name}</p>
        <p className="truncate text-xs text-[var(--on-surface-variant)]">{email ?? '-'}</p>
      </div>
    ) : null}
  </div>
);
