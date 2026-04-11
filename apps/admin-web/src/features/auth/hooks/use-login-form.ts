'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AppError } from '@rh-ponto/core';
import { loginSchema, type LoginSchema } from '@rh-ponto/validations';

import { resolvePostLoginRoute, resolveRoleHomeRoute } from '@/features/auth/lib/auth-routes';
import { showValidationToast } from '@/shared/lib/form-feedback';
import { useSession } from '@/shared/providers/session-provider';

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signOut } = useSession();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit(
    async (values) => {
      form.clearErrors('root');

      try {
        const session = await signIn(values);

        if (session.user.role !== 'admin') {
          await signOut();
          router.replace(resolveRoleHomeRoute(session.user.role));
          return;
        }

        router.push(resolvePostLoginRoute(session, searchParams.get('next')));
      } catch (error) {
        const message =
          error instanceof AppError
            ? error.message
            : error instanceof Error && error.message
              ? error.message
              : 'Não foi possível entrar. Tente novamente.';

        form.setError('root', {
          message,
        });

        toast.error('Não foi possível entrar.', {
          description: message,
        });
      }
    },
    () => {
      showValidationToast(form.formState.errors, {
        title: 'Confira seu e-mail e sua senha.',
      });
    },
  );

  return {
    form,
    handleSubmit,
  };
};
