import {
  createAuditLog as createAuditLogMutation,
  listAuditLogs,
  type CreateAuditLogVariables,
  type ListAuditLogsData,
} from '@rh-ponto/api-client/generated';
import { getAppDataConnect } from '@rh-ponto/api-client';
import { AppError } from '@rh-ponto/core';

import { createAuditLog, type AuditLog } from '../../../domain/entities/audit-log';
import type { AuditLogRepository, CreateAuditLogPayload } from '../../../domain/repositories/audit-log-repository';

const mapAuditLogRecord = (record: ListAuditLogsData['auditLogs'][number]): AuditLog =>
  createAuditLog({
    id: record.id,
    userId: record.user?.id ?? null,
    entityName: record.entityName,
    entityId: record.entityId ?? null,
    action: record.action,
    description: record.description ?? null,
    oldData: record.oldData ?? null,
    newData: record.newData ?? null,
    ipAddress: record.ipAddress ?? null,
    deviceInfo: record.deviceInfo ?? null,
    createdAt: record.createdAt,
  });

const buildCreateVariables = (payload: CreateAuditLogPayload): CreateAuditLogVariables => ({
  userId: payload.userId ?? null,
  entityName: payload.entityName,
  entityId: payload.entityId ?? null,
  action: payload.action,
  description: payload.description ?? null,
  oldData: payload.oldData ?? null,
  newData: payload.newData ?? null,
  ipAddress: payload.ipAddress ?? null,
  deviceInfo: payload.deviceInfo ?? null,
});

export class DataConnectAuditLogRepository implements AuditLogRepository {
  async list(): Promise<AuditLog[]> {
    const { data } = await listAuditLogs(getAppDataConnect());

    return data.auditLogs.map(mapAuditLogRecord);
  }

  async create(payload: CreateAuditLogPayload): Promise<AuditLog> {
    const { data } = await createAuditLogMutation(getAppDataConnect(), buildCreateVariables(payload));
    const items = await this.list();
    const auditLog = items.find((item) => item.id === data.auditLog_insert.id);

    if (!auditLog) {
      throw new AppError('AUDIT_LOG_NOT_FOUND_AFTER_CREATE', 'Log de auditoria não encontrado após criação.');
    }

    return auditLog;
  }
}
