import { formatDateTime } from '@rh-ponto/core';
import type { AuditLog } from '@rh-ponto/audit';

import { formatAuditActionLabel, formatAuditEntityLabel } from '@/shared/lib/admin-formatters';

import type {
  AuditChangeViewModel,
  AuditDetailViewModel,
  AuditListItemViewModel,
  AuditMetadataItem,
  AuditOverviewViewModel,
  AuditSeverity,
  AuditTimelineItemViewModel,
} from '../types/audit-view-model';

interface AuditActorDirectoryItem {
  name: string;
  role: string;
}

const severityByAction: Partial<Record<AuditLog['action'], AuditSeverity>> = {
  'auth.login': 'baixa',
  'document.attached': 'baixa',
  'employee.updated': 'média',
  'justification.approved': 'média',
  'justification.rejected': 'média',
  'payroll.closed': 'alta',
  'schedule.assigned': 'baixa',
  'settings.updated': 'alta',
  'time-record.adjusted': 'alta',
  'time-record.created': 'baixa',
  'time-record.flagged': 'média',
  'vacation.approved': 'baixa',
  'vacation.rejected': 'média',
};

const fieldLabels: Record<string, string> = {
  approvedByUserId: 'Aprovado por',
  contentType: 'Tipo do arquivo',
  department: 'Departamento',
  fileName: 'Nome do arquivo',
  notes: 'Observação',
  position: 'Cargo',
  radiusMeters: 'Raio da geofence',
  recordedAt: 'Horário registrado',
  reviewNotes: 'Observação da revisão',
  reviewedByUserId: 'Revisado por',
  role: 'Perfil',
  sessionStatus: 'Status da sessão',
  status: 'Status',
  workScheduleId: 'Escala vinculada',
};

const severityLabels: Record<AuditSeverity, string> = {
  baixa: 'Baixa',
  média: 'Média',
  alta: 'Alta',
};

const getActorInfo = (userId: string | null): AuditActorDirectoryItem => {
  if (!userId) {
    return {
      name: 'Sistema',
      role: 'Evento automático',
    };
  }

  return {
    name: `Usuário ${userId.slice(0, 8)}`,
    role: 'Operação autenticada',
  };
};

const getAuditSeverity = (log: AuditLog): AuditSeverity => severityByAction[log.action] ?? 'média';

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    const looksLikeDate = /^\d{4}-\d{2}-\d{2}T/.test(value);

    return looksLikeDate ? formatDateTime(value) : value;
  }

  return JSON.stringify(value);
};

const buildChanges = (log: AuditLog): AuditChangeViewModel[] => {
  const previousData = (log.oldData as Record<string, unknown> | null) ?? {};
  const nextData = (log.newData as Record<string, unknown> | null) ?? {};
  const keys = Array.from(new Set([...Object.keys(previousData), ...Object.keys(nextData)]));

  return keys
    .filter((key) => formatValue(previousData[key]) !== formatValue(nextData[key]))
    .map((key) => ({
      fieldLabel: fieldLabels[key] ?? key,
      previousValue: formatValue(previousData[key]),
      nextValue: formatValue(nextData[key]),
    }));
};

const buildOriginLabel = (log: AuditLog): string => {
  const [browser = 'Navegador', platform = 'Dispositivo'] = (log.deviceInfo ?? '')
    .split('·')
    .map((item) => item.trim());

  return `${browser} · ${platform}`;
};

const buildSubjectName = (log: AuditLog): string => {
  if (log.entityId) {
    return `${formatAuditEntityLabel(log.entityName)} ${log.entityId}`;
  }

  return formatAuditEntityLabel(log.entityName);
};

const buildSubjectRole = (log: AuditLog): string => {
  if (log.entityName === 'payroll') {
    return 'Fechamento operacional';
  }

  if (log.entityName === 'settings') {
    return 'Configuração do ambiente';
  }

  return 'Registro administrativo';
};

const buildSubjectLocation = (log: AuditLog): string => {
  if (log.deviceInfo) {
    return log.deviceInfo;
  }

  if (log.ipAddress) {
    return `Origem ${log.ipAddress}`;
  }

  return 'Origem não informada';
};

const buildMetadata = (log: AuditLog): AuditMetadataItem[] => [
  { label: 'IP de origem', value: log.ipAddress ?? '-' },
  { label: 'Dispositivo', value: log.deviceInfo ?? '-' },
  { label: 'Entidade', value: formatAuditEntityLabel(log.entityName) },
  { label: 'Registro', value: log.entityId ?? '-' },
  { label: 'Ação', value: formatAuditActionLabel(log.action) },
];

const buildTimeline = (log: AuditLog, listItem: AuditListItemViewModel): AuditTimelineItemViewModel[] => {
  const baseDescription = log.description ?? 'Evento consolidado na trilha de auditoria.';
  const changes = buildChanges(log);
  const timeline: AuditTimelineItemViewModel[] = [
    {
      id: `${log.id}-captured`,
      title: 'Evento registrado',
      timestampLabel: listItem.occurredAtLabel,
      badgeLabel: 'Capturado',
      tone: 'secondary',
      description: baseDescription,
    },
  ];

  if (changes.length > 0) {
    timeline.push({
      id: `${log.id}-changed`,
      title: 'Alterações identificadas',
      timestampLabel: listItem.occurredAtLabel,
      badgeLabel: 'Comparado',
      tone: 'warning',
      description: `${changes.length} campo(s) mudaram entre o estado anterior e o novo estado.`,
    });
  }

  timeline.push({
    id: `${log.id}-available`,
    title: 'Registro disponível para consulta',
    timestampLabel: listItem.occurredAtLabel,
    badgeLabel: 'Concluído',
    tone: 'primary',
    description: 'O evento foi persistido e ficou disponível para rastreabilidade no painel administrativo.',
  });

  return timeline;
};

export const toAuditListItemViewModel = (log: AuditLog): AuditListItemViewModel => {
  const actor = getActorInfo(log.userId);
  const severity = getAuditSeverity(log);

  return {
    id: log.id,
    auditCode: `#${log.id.toUpperCase()}`,
    actorName: actor.name,
    actorRole: actor.role,
    occurredAtLabel: formatDateTime(log.createdAt),
    actionLabel: formatAuditActionLabel(log.action),
    entityLabel: formatAuditEntityLabel(log.entityName),
    targetLabel: log.entityId ?? '-',
    summary: log.description ?? 'Evento registrado sem descrição detalhada.',
    originLabel: buildOriginLabel(log),
    ipAddress: log.ipAddress ?? '-',
    severity,
    severityLabel: severityLabels[severity],
  };
};

export const toAuditDetailViewModel = (log: AuditLog, relatedLogs: AuditLog[]): AuditDetailViewModel => {
  const listItem = toAuditListItemViewModel(log);
  const changes = buildChanges(log);

  return {
    ...listItem,
    subjectName: buildSubjectName(log),
    subjectRole: buildSubjectRole(log),
    subjectLocation: buildSubjectLocation(log),
    eventTypeLabel: listItem.actionLabel,
    confidenceScoreLabel: changes.length > 0 ? 'Com alterações' : 'Sem alterações comparáveis',
    integrityLabel: 'Registro preservado',
    note:
      log.description ??
      'O registro foi consolidado na trilha de auditoria para garantir rastreabilidade e conferência operacional.',
    changes,
    metadata: buildMetadata(log),
    timeline: buildTimeline(log, listItem),
    relatedRecords: relatedLogs
      .filter((item) => item.id !== log.id)
      .slice(0, 3)
      .map((item) => toAuditListItemViewModel(item)),
  };
};

export const toAuditOverviewViewModel = (logs: AuditLog[]): AuditOverviewViewModel => {
  const records = logs.map((log) => toAuditListItemViewModel(log));

  return {
    actors: Array.from(new Set(logs.map((log) => log.userId).filter(Boolean))).map((userId) => {
      const actor = getActorInfo(userId);

      return {
        id: userId as string,
        label: actor.name,
      };
    }),
    entities: Array.from(new Set(logs.map((log) => log.entityName))).sort(),
    metrics: {
      total: logs.length,
      approvals: logs.filter((log) => log.action.includes('approved') || log.action === 'payroll.closed').length,
      manualAdjustments: logs.filter((log) => log.action.includes('adjusted') || log.action.includes('flagged')).length,
      criticalEvents: logs.filter((log) => getAuditSeverity(log) === 'alta').length,
    },
    records,
  };
};
