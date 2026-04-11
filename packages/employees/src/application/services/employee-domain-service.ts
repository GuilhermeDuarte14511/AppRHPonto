import type { Employee } from '../../domain/entities/employee';

export class EmployeeDomainService {
  deactivate(employee: Employee): Employee {
    return {
      ...employee,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };
  }
}

