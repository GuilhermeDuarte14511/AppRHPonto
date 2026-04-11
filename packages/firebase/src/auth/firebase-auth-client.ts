import { type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';

export interface FirebaseAuthenticatedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface FirebaseAuthClient {
  waitForAuthState(): Promise<FirebaseAuthenticatedUser | null>;
  signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseAuthenticatedUser>;
  getCurrentUser(): Promise<FirebaseAuthenticatedUser | null>;
  signOut(): Promise<void>;
}

const mapFirebaseUser = async (user: User | null): Promise<FirebaseAuthenticatedUser | null> => {
  if (!user) {
    return null;
  }

  const idTokenResult = await user.getIdTokenResult();

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    accessToken: idTokenResult.token,
    refreshToken: user.refreshToken ?? null,
    expiresAt: idTokenResult.expirationTime ?? null,
  };
};

export class BrowserFirebaseAuthClient implements FirebaseAuthClient {
  constructor(private readonly firebaseApp: FirebaseApp) {}

  async waitForAuthState(): Promise<FirebaseAuthenticatedUser | null> {
    const auth = getAuth(this.firebaseApp);

    if (typeof auth.authStateReady === 'function') {
      await auth.authStateReady();
      return mapFirebaseUser(auth.currentUser);
    }

    return new Promise<FirebaseAuthenticatedUser | null>((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          unsubscribe();
          resolve(await mapFirebaseUser(user));
        },
        (error) => {
          unsubscribe();
          reject(error);
        },
      );
    });
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<FirebaseAuthenticatedUser> {
    const auth = getAuth(this.firebaseApp);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await this.waitForAuthState();
    const currentUser = await mapFirebaseUser(credential.user);

    if (!currentUser) {
      throw new Error('Usuário autenticado não disponível após o login.');
    }

    return currentUser;
  }

  async getCurrentUser(): Promise<FirebaseAuthenticatedUser | null> {
    const auth = getAuth(this.firebaseApp);

    return mapFirebaseUser(auth.currentUser);
  }

  async signOut(): Promise<void> {
    const auth = getAuth(this.firebaseApp);

    await signOut(auth);
  }
}
