import { AppError } from '@rh-ponto/core';

import type {
  AttendancePolicyRepository,
  EmployeeAttendancePolicyDetails,
  UpsertEmployeeAttendancePolicyPayload,
} from '../../../domain/repositories/attendance-policy-repository';
import type { AttendancePolicy, WorkLocation } from '../../../domain/entities/attendance-policy';

export class DataConnectAttendancePolicyRepository implements AttendancePolicyRepository {
  async listPolicies(): Promise<AttendancePolicy[]> {
    throw new AppError(
      'ATTENDANCE_POLICY_DATA_CONNECT_NOT_IMPLEMENTED',
      'O repositório Data Connect de políticas de marcação será conectado após a geração do SDK atualizado.',
    );
  }

  async listLocations(): Promise<WorkLocation[]> {
    throw new AppError(
      'WORK_LOCATION_DATA_CONNECT_NOT_IMPLEMENTED',
      'O repositório Data Connect de locais autorizados será conectado após a geração do SDK atualizado.',
    );
  }

  async getEmployeePolicy(_employeeId: string): Promise<EmployeeAttendancePolicyDetails> {
    throw new AppError(
      'EMPLOYEE_ATTENDANCE_POLICY_NOT_IMPLEMENTED',
      'A leitura da política do colaborador no Data Connect será conectada após a geração do SDK atualizado.',
    );
  }

  async upsertEmployeePolicy(_payload: UpsertEmployeeAttendancePolicyPayload): Promise<EmployeeAttendancePolicyDetails> {
    throw new AppError(
      'EMPLOYEE_ATTENDANCE_POLICY_UPSERT_NOT_IMPLEMENTED',
      'A gravação da política do colaborador no Data Connect será conectada após a geração do SDK atualizado.',
    );
  }
}
