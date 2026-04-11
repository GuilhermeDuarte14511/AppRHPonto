import { LoaderCircle, ShieldCheck } from 'lucide-react';

interface AuthTransitionScreenProps {
  title: string;
  description: string;
  helperText?: string;
}

export const AuthTransitionScreen = ({
  title,
  description,
  helperText = 'Isso leva só alguns segundos.',
}: AuthTransitionScreenProps) => (
  <div className="flex min-h-screen items-center justify-center px-6 py-10">
    <main className="w-full max-w-sm">
      <section
        aria-live="polite"
        className="rounded-[2rem] bg-[var(--surface-container-lowest)] px-8 py-10 text-center shadow-[var(--shadow-card)]"
        role="status"
      >
        <div className="space-y-10">
          <div className="space-y-2">
            <p className="font-headline text-lg font-extrabold tracking-[-0.03em] text-[var(--primary)]">PontoPrecise</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--on-surface-variant)]">
              Ambiente administrativo
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary-fixed)]">
              <span className="absolute inset-0 rounded-full border border-[color:color-mix(in_srgb,var(--primary)_14%,transparent)]" />
              <LoaderCircle className="h-7 w-7 animate-spin text-[var(--primary)]" strokeWidth={1.75} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-headline text-xl font-extrabold tracking-[-0.03em] text-[var(--on-surface)]">{title}</h1>
            <p className="text-sm leading-7 text-[var(--on-surface-variant)]">{description}</p>
            <p className="text-xs font-medium text-[var(--on-surface-variant)]">{helperText}</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-container-low)] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--on-surface-variant)]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.2} />
            Sessão segura
          </div>
        </div>
      </section>

      <footer className="mt-6 text-center text-[10px] font-medium tracking-[0.08em] text-[var(--on-surface-variant)]">
        © 2026 PontoPrecise Enterprise
      </footer>
    </main>
  </div>
);
