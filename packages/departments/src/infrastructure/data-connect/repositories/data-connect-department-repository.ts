import {
  createDepartment as createDepartmentMutation,
  deleteDepartment as deleteDepartmentMutation,
  getDepartmentById,
  listDepartments,
  listEmployees,
  updateDepartment as updateDepartmentMutation,
  updateEmployee,
  type CreateDepartmentVariables,
  type GetDepartmentByIdData,
  type ListDepartmentsData,
  type UpdateDepartmentVariables,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';

import { createDepartment, type Department } from '../../../domain/entities/department';
import type {
  CreateDepartmentPayload,
  DepartmentListFilters,
  DepartmentRepository,
  UpdateDepartmentPayload,
} from '../../../domain/repositories/department-repository';

const mapDepartmentRecord = (
  record: ListDepartmentsData['departments'][number] | NonNullable<GetDepartmentByIdData['department']>,
): Department =>
  createDepartment({
    id: record.id,
    code: record.code,
    name: record.name,
    managerEmployeeId: record.manager?.id ?? null,
    managerName: record.manager?.fullName ?? null,
    description: record.description ?? null,
    costCenter: record.costCenter ?? null,
    isActive: record.isActive,
    employeeCount: record.employees_on_department.length,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const applyFilters = (departments: Department[], filters?: DepartmentListFilters): Department[] => {
  if (!filters) {
    return departments;
  }

  return departments.filter((department) => {
    const matchesSearch = filters.search
      ? [department.name, department.code, department.costCenter ?? '', department.managerName ?? '']
          .join(' ')
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;
    const matchesActive = typeof filters.isActive === 'boolean' ? department.isActive === filters.isActive : true;

    return matchesSearch && matchesActive;
  });
};

const applyPagination = (departments: Department[], filters?: DepartmentListFilters): Department[] => {
  const pageSize = filters?.pageSize;
  const page = filters?.page ?? 1;

  if (!pageSize || pageSize <= 0) {
    return departments;
  }

  const offset = Math.max(page - 1, 0) * pageSize;

  return departments.slice(offset, offset + pageSize);
};

const buildCreateVariables = (payload: CreateDepartmentPayload): CreateDepartmentVariables => ({
  code: payload.code,
  name: payload.name,
  managerEmployeeId: payload.managerEmployeeId ?? null,
  description: payload.description ?? null,
  costCenter: payload.costCenter ?? null,
  isActive: payload.isActive,
});

const buildUpdateVariables = (payload: UpdateDepartmentPayload): UpdateDepartmentVariables => ({
  id: payload.id,
  code: payload.code,
  name: payload.name,
  managerEmployeeId: payload.managerEmployeeId,
  description: payload.description,
  costCenter: payload.costCenter,
  isActive: payload.isActive,
});

export class DataConnectDepartmentRepository implements DepartmentRepository {
  async list(filters?: DepartmentListFilters): Promise<Department[]> {
    const { data } = await listDepartments(getAppDataConnect());
    const departments = data.departments.map(mapDepartmentRecord);

    return applyPagination(applyFilters(departments, filters), filters);
  }

  async getById(id: string): Promise<Department | null> {
    const { data } = await getDepartmentById(getAppDataConnect(), { id });

    return data.department ? mapDepartmentRecord(data.department) : null;
  }

  async create(payload: CreateDepartmentPayload): Promise<Department> {
    const { data } = await createDepartmentMutation(getAppDataConnect(), buildCreateVariables(payload));
    const department = await this.getById(data.department_insert.id);

    if (!department) {
      throw new AppError('DEPARTMENT_NOT_FOUND_AFTER_CREATE', 'Departamento não encontrado após criação.');
    }

    return department;
  }

  async update(payload: UpdateDepartmentPayload): Promise<Department> {
    const { data } = await updateDepartmentMutation(getAppDataConnect(), buildUpdateVariables(payload));
    const departmentId = data.department_update?.id;

    if (!departmentId) {
      throw new AppError('DEPARTMENT_NOT_FOUND', 'Departamento não encontrado para atualização.');
    }

    const department = await this.getById(departmentId);

    if (!department) {
      throw new AppError('DEPARTMENT_NOT_FOUND_AFTER_UPDATE', 'Departamento não encontrado após atualização.');
    }

    return department;
  }

  async delete(id: string): Promise<void> {
    const dataConnect = getAppDataConnect();
    const { data } = await listEmployees(dataConnect);
    const linkedEmployees = data.employees.filter((employee) => employee.department?.id === id);

    await Promise.all(
      linkedEmployees.map((employee) =>
        updateEmployee(dataConnect, {
          id: employee.id,
          departmentId: null,
        }),
      ),
    );

    await deleteDepartmentMutation(dataConnect, { id });
  }
}
