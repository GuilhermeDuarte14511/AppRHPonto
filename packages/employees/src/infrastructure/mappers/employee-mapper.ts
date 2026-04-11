import type { CreateEmployeeDto } from '../../application/dto/create-employee-dto';
import type { EmployeeDto } from '../../application/dto/employee-dto';
import { createEmployee, type Employee } from '../../domain/entities/employee';

export const mapEmployee = (input: EmployeeDto): Employee => createEmployee(input);

export const mapEmployeeToDto = (input: Employee): EmployeeDto => ({
  ...input,
});

export const mapCreateEmployeeDtoToPayload = (input: CreateEmployeeDto): CreateEmployeeDto => ({
  ...input,
});
