import type { AuditLogDto } from '../../application/dto/audit-log-dto';
import { createAuditLog, type AuditLog } from '../../domain/entities/audit-log';

export const mapAuditLog = (auditLog: AuditLogDto): AuditLog => createAuditLog(auditLog);

export const mapAuditLogToDto = (auditLog: AuditLog): AuditLogDto => ({
  ...auditLog,
});
