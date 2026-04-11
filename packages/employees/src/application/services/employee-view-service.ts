import type { Employee } from '../../domain/entities/employee';
import type { EmployeeDto, EmployeeListItemDto } from '../dto/employee-dto';

export class EmployeeViewService {
  toListItem(employee: Employee): EmployeeListItemDto {
    return {
      id: employee.id,
      fullName: employee.fullName,
      registrationNumber: employee.registrationNumber,
      department: employee.department,
      position: employee.position,
      isActive: employee.isActive,
    };
  }

  toDto(employee: Employee): EmployeeDto {
    return {
      ...employee,
    };
  }
}
