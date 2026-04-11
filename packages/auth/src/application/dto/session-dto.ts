import type { DateValue, Nullable } from '@rh-ponto/types';

export interface SessionDto {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt?: Nullable<DateValue>;
  user: {
    id: string;
    firebaseUid: string;
    name: string;
    email: string;
    role: 'admin' | 'employee' | 'kiosk';
    isActive: boolean;
    lastLoginAt: Nullable<DateValue>;
    createdAt: DateValue;
    updatedAt: DateValue;
  };
}

