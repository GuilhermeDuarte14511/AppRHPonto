import type { AuditDetailViewModel, AuditListItemViewModel } from '../types/audit-view-model';

const downloadFile = (content: string, fileName: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
};

export const downloadAuditRecordsCsv = (records: AuditListItemViewModel[]) => {
  const header = ['ID', 'Data e hora', 'Usuário', 'Ação', 'Entidade', 'Registro', 'Severidade', 'Origem', 'IP', 'Resumo'];
  const rows = records.map((record) => [
    record.auditCode,
    record.occurredAtLabel,
    record.actorName,
    record.actionLabel,
    record.entityLabel,
    record.targetLabel,
    record.severityLabel,
    record.originLabel,
    record.ipAddress,
    record.summary,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';'))
    .join('\n');

  downloadFile(csv, 'auditoria-registros.csv', 'text/csv;charset=utf-8;');
};

export const downloadAuditDetailJson = (detail: AuditDetailViewModel) => {
  downloadFile(JSON.stringify(detail, null, 2), `${detail.id}.json`, 'application/json;charset=utf-8;');
};
