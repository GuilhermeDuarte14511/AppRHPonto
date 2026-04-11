import { readFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const readLocalEnv = async () => {
  const envPath = path.join(rootDir, '.env.local');
  const content = await readFile(envPath, 'utf8');

  return Object.fromEntries(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        const key = line.slice(0, separatorIndex).trim();
        const rawValue = line.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, '');

        return [key, value];
      }),
  );
};

const accounts = [
  { email: 'admin@empresa.com', password: 'admin123', displayName: 'Marina Costa' },
  { email: 'rh@empresa.com', password: 'rh123456', displayName: 'Ricardo Mello' },
  { email: 'employee@empresa.com', password: 'employee123', displayName: 'João Pereira' },
  { email: 'kiosk@empresa.com', password: 'kiosk123', displayName: 'Tablet Portaria' },
];

const signUpUser = async (apiKey, account) => {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: account.email,
      password: account.password,
      displayName: account.displayName,
      returnSecureToken: true,
    }),
  });

  const payload = await response.json();

  if (response.ok) {
    console.log(`Criado: ${account.email}`);
    return;
  }

  if (payload?.error?.message === 'EMAIL_EXISTS') {
    console.log(`Já existe: ${account.email}`);
    return;
  }

  throw new Error(payload?.error?.message ?? `Falha ao criar ${account.email}.`);
};

const main = async () => {
  const env = await readLocalEnv();
  const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY não foi encontrada em .env.local.');
  }

  for (const account of accounts) {
    await signUpUser(apiKey, account);
  }

  console.log('Seed do Firebase Auth concluído.');
};

main().catch((error) => {
  console.error('Falha ao provisionar usuários no Firebase Auth.');
  console.error(error);
  process.exitCode = 1;
});
