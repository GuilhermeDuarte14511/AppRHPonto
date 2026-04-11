export const LoadingState = ({ label = 'Carregando...' }: { label?: string }) => (
  <div className="flex min-h-40 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-card)]">
    <div className="flex items-center gap-3 text-sm font-medium text-[var(--on-surface-variant)]">
      <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--tertiary)]">
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--tertiary)] opacity-60" />
      </span>
      {label}
    </div>
  </div>
);
