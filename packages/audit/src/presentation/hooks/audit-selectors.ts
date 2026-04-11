import type { AuditLog } from '../../domain/entities/audit-log';

export const summarizeAuditLog = (auditLog: AuditLog): string =>
  `${auditLog.action} em ${auditLog.entityName} (${auditLog.entityId})`;

