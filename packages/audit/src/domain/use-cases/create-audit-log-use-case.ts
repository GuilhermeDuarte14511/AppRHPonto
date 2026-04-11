import type { CreateAuditLogPayload, AuditLogRepository } from '../repositories/audit-log-repository';

export class CreateAuditLogUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  execute(payload: CreateAuditLogPayload) {
    return this.auditLogRepository.create(payload);
  }
}
