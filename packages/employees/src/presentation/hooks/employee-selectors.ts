import type { Employee } from '../../domain/entities/employee';

export const toEmployeeOption = (employee: Employee) => ({
  label: employee.fullName,
  value: employee.id,
});

