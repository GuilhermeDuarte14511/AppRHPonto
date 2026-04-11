import type { Employee } from '../../domain/entities/employee';

export interface EmployeeViewModel {
  id: string;
  label: string;
  registrationNumber: string;
  department: string;
  position: string;
  statusLabel: string;
}

export const toEmployeeViewModel = (employee: Employee): EmployeeViewModel => ({
  id: employee.id,
  label: employee.fullName,
  registrationNumber: employee.registrationNumber,
  department: employee.department ?? '-',
  position: employee.position ?? '-',
  statusLabel: employee.isActive ? 'Ativo' : 'Inativo',
});

