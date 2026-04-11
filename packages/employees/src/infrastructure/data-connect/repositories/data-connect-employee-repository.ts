import {
  createEmployee as createEmployeeMutation,
  deactivateEmployee,
  getEmployeeById,
  listEmployees,
  updateEmployee,
  type CreateEmployeeVariables,
  type GetEmployeeByIdData,
  type ListEmployeesData,
  type UpdateEmployeeVariables,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';

import { createEmployee, type Employee } from '../../../domain/entities/employee';
import type {
  CreateEmployeePayload,
  EmployeeListFilters,
  EmployeeRepository,
  UpdateEmployeePayload,
} from '../../../domain/repositories/employee-repository';

const mapEmployeeRecord = (
  record: ListEmployeesData['employees'][number] | NonNullable<GetEmployeeByIdData['employee']>,
): Employee =>
  createEmployee({
    id: record.id,
    userId: record.user?.id ?? null,
    registrationNumber: record.registrationNumber,
    fullName: record.fullName,
    cpf: record.cpf ?? null,
    email: record.email ?? null,
    phone: record.phone ?? null,
    birthDate: record.birthDate ?? null,
    hireDate: record.hireDate ?? null,
    departmentId: record.departmentId ?? null,
    department: record.department?.name ?? null,
    position: record.position ?? null,
    profilePhotoUrl: record.profilePhotoUrl ?? null,
    pinCode: record.pinCode ?? null,
    isActive: record.isActive,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });

const applyFilters = (employees: Employee[], filters?: EmployeeListFilters): Employee[] => {
  if (!filters) {
    return employees;
  }

  return employees.filter((employee) => {
    const matchesSearch = filters.search
      ? [employee.fullName, employee.registrationNumber, employee.department ?? '', employee.position ?? '']
          .join(' ')
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      : true;
    const matchesDepartment = filters.department ? employee.department === filters.department : true;
    const matchesActive = typeof filters.isActive === 'boolean' ? employee.isActive === filters.isActive : true;

    return matchesSearch && matchesDepartment && matchesActive;
  });
};

const applyPagination = (employees: Employee[], filters?: EmployeeListFilters): Employee[] => {
  const pageSize = filters?.pageSize;
  const page = filters?.page ?? 1;

  if (!pageSize || pageSize <= 0) {
    return employees;
  }

  const offset = Math.max(page - 1, 0) * pageSize;

  return employees.slice(offset, offset + pageSize);
};

const toDate = (value: string | Date | null | undefined): string | null => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString().slice(0, 10);
};

const buildCreateVariables = (payload: CreateEmployeePayload): CreateEmployeeVariables => ({
  registrationNumber: payload.registrationNumber,
  fullName: payload.fullName,
  cpf: payload.cpf ?? null,
  email: payload.email ?? null,
  phone: payload.phone ?? null,
  birthDate: toDate(payload.birthDate),
  hireDate: toDate(payload.hireDate),
  departmentId: payload.departmentId ?? null,
  position: payload.position ?? null,
  profilePhotoUrl: payload.profilePhotoUrl ?? null,
  pinCode: payload.pinCode ?? null,
  isActive: payload.isActive,
});

const buildUpdateVariables = (payload: UpdateEmployeePayload): UpdateEmployeeVariables => ({
  id: payload.id,
  registrationNumber: payload.registrationNumber,
  fullName: payload.fullName,
  cpf: payload.cpf,
  email: payload.email,
  phone: payload.phone,
  birthDate: toDate(payload.birthDate),
  hireDate: toDate(payload.hireDate),
  departmentId: payload.departmentId,
  position: payload.position,
  profilePhotoUrl: payload.profilePhotoUrl,
  pinCode: payload.pinCode,
  isActive: payload.isActive,
});

export class DataConnectEmployeeRepository implements EmployeeRepository {
  async list(filters?: EmployeeListFilters): Promise<Employee[]> {
    const { data } = await listEmployees(getAppDataConnect());
    const employees = data.employees.map(mapEmployeeRecord);

    return applyPagination(applyFilters(employees, filters), filters);
  }

  async getById(id: string): Promise<Employee | null> {
    const { data } = await getEmployeeById(getAppDataConnect(), { id });

    return data.employee ? mapEmployeeRecord(data.employee) : null;
  }

  async create(payload: CreateEmployeePayload): Promise<Employee> {
    const { data } = await createEmployeeMutation(getAppDataConnect(), buildCreateVariables(payload));
    const employee = await this.getById(data.employee_insert.id);

    if (!employee) {
      throw new AppError('EMPLOYEE_NOT_FOUND_AFTER_CREATE', 'Funcionário não encontrado após criação via Data Connect.');
    }

    return employee;
  }

  async update(payload: UpdateEmployeePayload): Promise<Employee> {
    const { data } = await updateEmployee(getAppDataConnect(), buildUpdateVariables(payload));
    const employeeId = data.employee_update?.id;

    if (!employeeId) {
      throw new AppError('EMPLOYEE_NOT_FOUND', 'Funcionário não encontrado para atualização.');
    }

    const employee = await this.getById(employeeId);

    if (!employee) {
      throw new AppError(
        'EMPLOYEE_NOT_FOUND_AFTER_UPDATE',
        'Funcionário não encontrado após atualização via Data Connect.',
      );
    }

    return employee;
  }

  async deactivate(id: string): Promise<void> {
    await deactivateEmployee(getAppDataConnect(), { id });
  }
}
