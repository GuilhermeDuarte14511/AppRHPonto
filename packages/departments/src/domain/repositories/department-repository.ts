import type { Nullable, PáginationParams } from '@rh-ponto/types';

import type { Department } from '../entities/department';

export interface DepartmentListFilters extends PáginationParams {
  isActive?: boolean;
}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  managerEmployeeId?: Nullable<string>;
  description?: Nullable<string>;
  costCenter?: Nullable<string>;
  isActive: boolean;
}

export interface UpdateDepartmentPayload extends Partial<CreateDepartmentPayload> {
  id: string;
}

export interface DepartmentRepository {
  list(filters?: DepartmentListFilters): Promise<Department[]>;
  getById(id: string): Promise<Department | null>;
  create(payload: CreateDepartmentPayload): Promise<Department>;
  update(payload: UpdateDepartmentPayload): Promise<Department>;
  delete(id: string): Promise<void>;
}
