import { z } from 'zod';

export const firebaseEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST: z.string().optional(),
  NEXT_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT: z.coerce.number().optional(),
  EXPO_PUBLIC_FIREBASE_API_KEY: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_DATA_CONNECT_URL: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_HOST: z.string().optional(),
  EXPO_PUBLIC_FIREBASE_DATA_CONNECT_EMULATOR_PORT: z.coerce.number().optional()
});

export type FirebaseEnv = z.infer<typeof firebaseEnvSchema>;

export const parseFirebaseEnv = (input: unknown): FirebaseEnv => firebaseEnvSchema.parse(input);
