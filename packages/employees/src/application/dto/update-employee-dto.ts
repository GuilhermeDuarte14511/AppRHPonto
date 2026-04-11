import type { CreateEmployeeDto } from './create-employee-dto';

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: string;
}

