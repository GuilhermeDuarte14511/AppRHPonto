import type { AuditLogRepository } from '../repositories/audit-log-repository';

export class ListAuditLogsUseCase {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  execute() {
    return this.auditLogRepository.list();
  }
}
