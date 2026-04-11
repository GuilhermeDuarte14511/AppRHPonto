'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@rh-ponto/api-client';

import { useAdminQueryGate } from '@/shared/hooks/use-admin-query-gate';
import { services } from '@/shared/lib/service-registry';

import { toAuditDetailViewModel } from '../lib/audit-view-models';

export const useAuditDetail = (auditId: string) => {
  const { enabled } = useAdminQueryGate();

  return useQuery({
    queryKey: queryKeys.auditDetail(auditId),
    queryFn: async () => {
      const logs = await services.audit.listAuditLogsUseCase.execute();
      const selectedLog = logs.find((log) => log.id === auditId) ?? null;

      if (!selectedLog) {
        return null;
      }

      const relatedLogs = logs.filter(
        (log) =>
          log.userId === selectedLog.userId ||
          log.entityId === selectedLog.entityId ||
          log.entityName === selectedLog.entityName,
      );

      return toAuditDetailViewModel(selectedLog, relatedLogs);
    },
    enabled: enabled && Boolean(auditId),
  });
};
