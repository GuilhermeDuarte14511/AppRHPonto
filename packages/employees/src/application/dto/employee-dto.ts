import type { DateValue, Nullable } from '@rh-ponto/types';

export interface EmployeeDto {
  id: string;
  userId: Nullable<string>;
  registrationNumber: string;
  fullName: string;
  cpf: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  birthDate: Nullable<DateValue>;
  hireDate: Nullable<DateValue>;
  departmentId: Nullable<string>;
  department: Nullable<string>;
  position: Nullable<string>;
  profilePhotoUrl: Nullable<string>;
  pinCode: Nullable<string>;
  isActive: boolean;
  createdAt: DateValue;
  updatedAt: DateValue;
}

export interface EmployeeListItemDto {
  id: string;
  fullName: string;
  registrationNumber: string;
  department: Nullable<string>;
  position: Nullable<string>;
  isActive: boolean;
}
