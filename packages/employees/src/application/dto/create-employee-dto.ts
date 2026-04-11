import type { DateValue, Nullable } from '@rh-ponto/types';

export interface CreateEmployeeDto {
  userId?: Nullable<string>;
  registrationNumber: string;
  fullName: string;
  cpf?: Nullable<string>;
  email?: Nullable<string>;
  phone?: Nullable<string>;
  birthDate?: Nullable<DateValue>;
  hireDate?: Nullable<DateValue>;
  departmentId?: Nullable<string>;
  position?: Nullable<string>;
  profilePhotoUrl?: Nullable<string>;
  pinCode?: Nullable<string>;
  isActive: boolean;
}
