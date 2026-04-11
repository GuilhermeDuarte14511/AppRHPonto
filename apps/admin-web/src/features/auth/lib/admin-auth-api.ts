import { BrowserFirebaseAuthClient, getFirebaseApp } from '@rh-ponto/firebase';
import type { SessionDto } from '@rh-ponto/auth';

interface SignInResponse {
  session: SessionDto;
}

const firebaseAuthClient = new BrowserFirebaseAuthClient(getFirebaseApp(process.env));

const handleJsonResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(payload?.message ?? 'Não foi possível concluir a operação de autenticação.');
  }

  return (await response.json()) as T;
};

export const fetchAdminSession = async (): Promise<SessionDto | null> => {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Não foi possível restaurar a sessão atual.');
  }

  const payload = (await response.json()) as { session: SessionDto | null };

  return payload.session;
};

export const waitForFirebaseClientAuth = async () => firebaseAuthClient.waitForAuthState();

export const getCurrentFirebaseClientUser = async () => firebaseAuthClient.getCurrentUser();

export const confirmAdminPassword = async (password: string): Promise<void> => {
  const currentUser = await firebaseAuthClient.getCurrentUser();

  if (!currentUser?.email) {
    throw new Error('Nenhum usuário autenticado foi encontrado para confirmar a assinatura.');
  }

  await firebaseAuthClient.signInWithEmailAndPassword(currentUser.email, password);
};

export const signInWithAdminSession = async (payload: {
  email: string;
  password: string;
}): Promise<SessionDto> => {
  const response = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const result = await handleJsonResponse<SignInResponse>(response);

  try {
    await firebaseAuthClient.signInWithEmailAndPassword(payload.email, payload.password);
    const currentUser = await firebaseAuthClient.waitForAuthState();

    if (!currentUser || currentUser.email !== payload.email) {
      throw new Error('Não foi possível sincronizar a sessão autenticada do navegador.');
    }
  } catch (error) {
    const browserErrorMessage =
      error instanceof Error ? error.message : 'Falha ao sincronizar a sessão do Firebase no navegador.';

    console.error('Falha ao sincronizar o Firebase Auth no cliente.', error);

    throw new Error(browserErrorMessage);
  }

  return result.session;
};

export const signOutWithAdminSession = async (): Promise<void> => {
  const response = await fetch('/api/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Não foi possível encerrar a sessão atual.');
  }

  await firebaseAuthClient.signOut().catch(() => undefined);
};
