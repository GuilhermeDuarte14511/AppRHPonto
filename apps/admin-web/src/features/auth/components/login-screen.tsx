import { LoginForm } from './login-form';

const accessHighlights = [
  {
    label: 'Acesso protegido',
    value: 'Só pessoas com perfil administrativo conseguem entrar no painel e abrir os módulos do RH.',
  },
  {
    label: 'Perfis e permissões',
    value: 'Cada conta entra apenas no ambiente compatível com o seu papel dentro da operação.',
  },
  {
    label: 'Rotina do RH',
    value: 'Funcionários, marcações, férias, documentos e auditoria ficam disponíveis em um só lugar.',
  },
];

export const LoginScreen = () => (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,225,255,0.92),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(221,225,255,0.58),transparent_26%)]" />
    <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[rgba(219,225,255,0.65)] blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[rgba(221,225,255,0.72)] blur-3xl" />

    <div className="relative grid w-full max-w-6xl gap-5 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden min-h-[720px] flex-col justify-between rounded-[2rem] bg-[rgba(255,255,255,0.52)] p-10 shadow-[var(--shadow-card)] backdrop-blur-xl lg:flex">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full bg-[var(--surface-container-lowest)] px-4 py-2 shadow-[var(--shadow-card)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl primary-gradient font-headline text-sm font-black text-white">
              PP
            </span>
            <div>
              <p className="font-headline text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                Gestão de jornada
              </p>
              <p className="text-xs text-[var(--on-surface-variant)]">Painel administrativo do RH</p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <p className="font-headline text-xs font-extrabold uppercase tracking-[0.22em] text-[var(--primary)]">
              Operação centralizada
            </p>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.05] text-[var(--on-background)]">
              Entre no painel e acompanhe a rotina do RH com mais clareza e menos retrabalho.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--on-surface-variant)]">
              Use sua conta administrativa para consultar jornadas, aprovações, documentos, auditoria e fechamento da folha.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {accessHighlights.map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-card)]">
              <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--on-surface-variant)]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-5">
        <div className="w-full rounded-[1.75rem] bg-[rgba(255,255,255,0.82)] p-5 shadow-[var(--shadow-card)] backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl primary-gradient font-headline text-sm font-black text-white">
              PP
            </span>
            <div>
              <p className="font-headline text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--primary)]">
                Gestão de jornada
              </p>
              <p className="text-xs text-[var(--on-surface-variant)]">Acesso administrativo do RH.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {accessHighlights.map((item) => (
              <div key={item.label} className="rounded-[1.25rem] bg-[var(--surface-container-lowest)] p-4">
                <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--on-surface-variant)]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <LoginForm />
      </section>
    </div>
  </div>
);
