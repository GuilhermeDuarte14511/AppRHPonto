import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { LoginForm } from './login-form';

vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    useSearchParams: () => new URLSearchParams('reason=session-expired'),
  };
});

const mockedHandleSubmit = vi.fn((event?: React.FormEvent<HTMLFormElement>) => event?.preventDefault());
const mockedRegister = vi.fn((name: string) => ({ name, onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }));

vi.mock('../hooks/use-login-form', () => ({
  useLoginForm: () => ({
    form: {
      register: mockedRegister,
      formState: {
        isSubmitting: false,
        errors: {
          root: { message: 'Credenciais inválidas.' },
          email: { message: 'Informe um e-mail válido.' },
          password: undefined,
        },
      },
    },
    handleSubmit: mockedHandleSubmit,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('mostra o motivo do redirecionamento no login', () => {
    render(<LoginForm />);

    expect(screen.getByText('Sua sessão expirou. Entre novamente para continuar.')).toBeInTheDocument();
    expect(screen.getByText('Credenciais inválidas.')).toBeInTheDocument();
    expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
  });

  it('submete o formulario ao clicar em entrar', async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockedHandleSubmit).toHaveBeenCalledTimes(1);
    expect(mockedRegister).toHaveBeenCalledWith('email');
    expect(mockedRegister).toHaveBeenCalledWith('password');
  });
});
