export type AuditSeverity = 'baixa' | 'média' | 'alta';

export type AuditTimelineTone = 'primary' | 'warning' | 'secondary';

export interface AuditListItemViewModel {
  id: string;
  auditCode: string;
  actorName: string;
  actorRole: string;
  occurredAtLabel: string;
  actionLabel: string;
  entityLabel: string;
  targetLabel: string;
  summary: string;
  originLabel: string;
  ipAddress: string;
  severity: AuditSeverity;
  severityLabel: string;
}

export interface AuditChangeViewModel {
  fieldLabel: string;
  previousValue: string;
  nextValue: string;
}

export interface AuditMetadataItem {
  label: string;
  value: string;
}

export interface AuditTimelineItemViewModel {
  id: string;
  title: string;
  timestampLabel: string;
  badgeLabel: string;
  tone: AuditTimelineTone;
  description: string;
}

export interface AuditDetailViewModel extends AuditListItemViewModel {
  subjectName: string;
  subjectRole: string;
  subjectLocation: string;
  eventTypeLabel: string;
  confidenceScoreLabel: string;
  integrityLabel: string;
  note: string;
  changes: AuditChangeViewModel[];
  metadata: AuditMetadataItem[];
  timeline: AuditTimelineItemViewModel[];
  relatedRecords: AuditListItemViewModel[];
}

export interface AuditMetricsViewModel {
  total: number;
  approvals: number;
  manualAdjustments: number;
  criticalEvents: number;
}

export interface AuditOverviewViewModel {
  actors: Array<{ id: string; label: string }>;
  entities: string[];
  metrics: AuditMetricsViewModel;
  records: AuditListItemViewModel[];
}
