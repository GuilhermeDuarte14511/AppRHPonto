'use client';

import { useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';

import { Button, FormField, Input } from '@rh-ponto/ui';

import { useLoginForm } from '../hooks/use-login-form';
import { getLoginReasonMessage } from '../lib/auth-routes';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const { form, handleSubmit } = useLoginForm();
  const reasonMessage = getLoginReasonMessage(searchParams.get('reason'));

  return (
    <div className="w-full max-w-md rounded-[2rem] bg-[var(--surface-container-lowest)] p-5 shadow-[var(--shadow-float)] sm:p-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[var(--primary-fixed)] text-[var(--primary)]">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-[var(--on-background)]">
          PontoPrecise
        </h1>
        <p className="mt-2 text-sm font-medium tracking-[0.18em] text-[var(--on-surface-variant)]">
          ACESSO ADMINISTRATIVO
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {reasonMessage ? (
          <div className="rounded-[var(--radius-md)] bg-[var(--tertiary-fixed)] px-4 py-3 text-sm text-[var(--on-tertiary-fixed-variant)]">
            {reasonMessage}
          </div>
        ) : null}
        {form.formState.errors.root?.message ? (
          <div className="rounded-[var(--radius-md)] bg-[var(--error-container)] px-4 py-3 text-sm text-[var(--on-error-container)]">
            {form.formState.errors.root.message}
          </div>
        ) : null}

        <FormField label="Email" htmlFor="email" error={form.formState.errors.email?.message}>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--outline)]" />
            <Input id="email" className="pl-11" placeholder="nome@empresa.com.br" type="email" {...form.register('email')} />
          </div>
        </FormField>

        <FormField label="Senha" htmlFor="password" error={form.formState.errors.password?.message}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--outline)]" />
            <Input id="password" className="pl-11" placeholder="********" type="password" {...form.register('password')} />
          </div>
        </FormField>

        <Button className="w-full justify-center" disabled={form.formState.isSubmitting} size="lg" type="submit">
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="mt-8 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
        <p className="font-headline text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--primary)]">
          Acesso seguro
        </p>
        <p className="mt-4 text-sm leading-7 text-[var(--on-surface-variant)]">
          Entre com uma conta administrativa válida para abrir o painel e consultar os dados operacionais do RH.
        </p>
      </div>
    </div>
  );
};
