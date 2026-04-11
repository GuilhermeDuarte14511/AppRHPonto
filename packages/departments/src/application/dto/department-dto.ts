import type { DateValue, Nullable } from '@rh-ponto/types';

export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  managerEmployeeId: Nullable<string>;
  managerName: Nullable<string>;
  description: Nullable<string>;
  costCenter: Nullable<string>;
  isActive: boolean;
  employeeCount: number;
  createdAt: DateValue;
  updatedAt: DateValue;
}
