import { z } from 'zod';

export const appBackendModeSchema = z.enum(['mock', 'firebase']);

export type AppBackendMode = z.infer<typeof appBackendModeSchema>;

const runtimeEnvSchema = z.object({
  NEXT_PUBLIC_APP_BACKEND_MODE: appBackendModeSchema.optional(),
  EXPO_PUBLIC_APP_BACKEND_MODE: appBackendModeSchema.optional(),
});

export const parseRuntimeEnv = (input: unknown) => runtimeEnvSchema.parse(input);

export const resolveAppBackendMode = (input: unknown): AppBackendMode => {
  const env = parseRuntimeEnv(input);

  return env.NEXT_PUBLIC_APP_BACKEND_MODE ?? env.EXPO_PUBLIC_APP_BACKEND_MODE ?? 'firebase';
};
