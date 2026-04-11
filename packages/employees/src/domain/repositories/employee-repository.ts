import type { DateValue, Nullable, PáginationParams } from '@rh-ponto/types';

import type { Employee } from '../entities/employee';

export interface EmployeeListFilters extends PáginationParams {
  department?: string;
  isActive?: boolean;
}

export interface CreateEmployeePayload {
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

export interface UpdateEmployeePayload extends Partial<CreateEmployeePayload> {
  id: string;
}

export interface EmployeeRepository {
  list(filters?: EmployeeListFilters): Promise<Employee[]>;
  getById(id: string): Promise<Employee | null>;
  create(payload: CreateEmployeePayload): Promise<Employee>;
  update(payload: UpdateEmployeePayload): Promise<Employee>;
  deactivate(id: string): Promise<void>;
}

export type EmployeesRepository = EmployeeRepository;
