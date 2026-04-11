import type {
  JustificationStatus,
  JustificationType,
  TimeRecordSource,
  TimeRecordStatus,
  TimeRecordType,
  UserRole,
} from '@rh-ponto/types';

const onlyDigits = (value: string): string => value.replace(/\D+/g, '');

const bytesFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  employee: 'Colaborador',
  kiosk: 'Kiosk',
};

const timeRecordTypeLabels: Record<TimeRecordType, string> = {
  entry: 'Entrada',
  break_start: 'Início do intervalo',
  break_end: 'Fim do intervalo',
  exit: 'Saída',
};

const timeRecordSourceLabels: Record<TimeRecordSource, string> = {
  kiosk: 'Kiosk da empresa',
  employee_app: 'Aplicativo do colaborador',
  admin_adjustment: 'Ajuste administrativo',
};

const timeRecordStatusLabels: Record<TimeRecordStatus, string> = {
  valid: 'Válido',
  pending_review: 'Em revisão',
  adjusted: 'Ajustado',
  rejected: 'Rejeitado',
};

const justificationTypeLabels: Record<JustificationType, string> = {
  missing_record: 'Falta de registro',
  late: 'Atraso',
  absence: 'Ausência',
  adjustment_request: 'Solicitação de ajuste',
};

const justificationStatusLabels: Record<JustificationStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
};

const auditEntityLabels: Record<string, string> = {
  auth: 'Sessão',
  document: 'Documento',
  employee: 'Funcionário',
  justification: 'Justificativa',
  payroll: 'Folha',
  schedule: 'Escala',
  settings: 'Configuração',
  timerecord: 'Marcação',
  'time-record': 'Marcação',
  vacation: 'Férias',
};

const auditActionLabels: Record<string, string> = {
  approve: 'Aprovação registrada',
  approved: 'Aprovado',
  attached: 'Anexo registrado',
  assign: 'Vínculo realizado',
  assigned: 'Vinculado',
  close: 'Fechamento realizado',
  closed: 'Fechado',
  create: 'Criação realizada',
  created: 'Criado',
  flag: 'Sinalização registrada',
  flagged: 'Sinalizado',
  login: 'Login realizado',
  reject: 'Rejeição registrada',
  rejected: 'Rejeitado',
  update: 'Atualização realizada',
  updated: 'Atualizado',
  'auth.login': 'Login realizado',
  'document.attached': 'Documento anexado',
  'employee.updated': 'Cadastro atualizado',
  'justification.approved': 'Justificativa aprovada',
  'justification.rejected': 'Justificativa rejeitada',
  'onboarding.journey.created': 'Jornada de onboarding criada',
  'onboarding.task.created': 'Etapa de onboarding criada',
  'onboarding.task.updated': 'Etapa de onboarding atualizada',
  'payroll.closed': 'Folha encerrada',
  'schedule.assigned': 'Escala atribuída',
  'settings.updated': 'Configuração alterada',
  'time-record.adjusted': 'Marcação ajustada',
  'time-record.created': 'Marcação registrada',
  'time-record.flagged': 'Marcação sinalizada',
  'vacation.approved': 'Férias aprovadas',
  'vacation.rejected': 'Férias reprovadas',
};

const normalizeAuditToken = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');

const formatFallbackLabel = (value: string): string =>
  value
    .split(/[._-]/)
    .filter(Boolean)
    .map((part, index) => {
      const normalized = normalizeAuditToken(part);
      const translated = auditActionLabels[normalized] ?? auditEntityLabels[normalized];

      if (translated) {
        return index === 0 ? translated : translated.toLowerCase();
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');

export const formatRoleLabel = (role: UserRole): string => roleLabels[role];

export const formatTimeRecordTypeLabel = (value: TimeRecordType): string => timeRecordTypeLabels[value];

export const formatTimeRecordSourceLabel = (value: TimeRecordSource): string => timeRecordSourceLabels[value];

export const formatTimeRecordStatusLabel = (value: TimeRecordStatus): string => timeRecordStatusLabels[value];

export const formatJustificationTypeLabel = (value: JustificationType): string => justificationTypeLabels[value];

export const formatJustificationStatusLabel = (value: JustificationStatus): string => justificationStatusLabels[value];

export const formatAuditEntityLabel = (value: string): string => {
  const normalized = normalizeAuditToken(value);

  return auditEntityLabels[normalized] ?? formatFallbackLabel(value);
};

export const formatAuditActionLabel = (value: string): string => {
  const normalized = normalizeAuditToken(value);

  return auditActionLabels[normalized] ?? formatFallbackLabel(value);
};

export const normalizeCpf = (value: string | null | undefined): string => onlyDigits(value ?? '').slice(0, 11);

export const normalizePinCode = (value: string | null | undefined): string => onlyDigits(value ?? '').slice(0, 8);

export const normalizePostalCode = (value: string | null | undefined): string => onlyDigits(value ?? '').slice(0, 8);

export const formatCpfInput = (value: string | null | undefined): string => {
  const digits = normalizeCpf(value);

  if (!digits) {
    return '';
  }

  if (digits.length !== 11) {
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const normalizePhone = (value: string | null | undefined): string => onlyDigits(value ?? '').slice(0, 11);

export const formatCpf = (value: string | null | undefined): string => formatCpfInput(value) || '-';

export const formatPhoneInput = (value: string | null | undefined): string => {
  const digits = normalizePhone(value);

  if (!digits) {
    return '';
  }

  if (digits.length <= 10) {
    return digits.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_match, area, prefix, suffix) => {
      const areaPart = area ? `(${area}` : '';
      const closedAreaPart = area.length === 2 ? `${areaPart})` : areaPart;
      const prefixPart = prefix ? ` ${prefix}` : '';
      const suffixPart = suffix ? `-${suffix}` : '';

      return `${closedAreaPart}${prefixPart}${suffixPart}`.trim();
    });
  }

  return digits.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, (_match, area, prefix, suffix) => {
    const areaPart = area ? `(${area}` : '';
    const closedAreaPart = area.length === 2 ? `${areaPart})` : areaPart;
    const prefixPart = prefix ? ` ${prefix}` : '';
    const suffixPart = suffix ? `-${suffix}` : '';

    return `${closedAreaPart}${prefixPart}${suffixPart}`.trim();
  });
};

export const formatPhone = (value: string | null | undefined): string => formatPhoneInput(value) || '-';

export const formatPhoneCompact = (value: string | null | undefined): string => {
  const digits = normalizePhone(value);

  if (!digits) {
    return '-';
  }

  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, (_match, area, prefix, suffix) =>
    suffix ? `(${area}) ${prefix}-${suffix}` : `(${area}) ${prefix}`,
  );
};

export const formatPinInput = (value: string | null | undefined): string => normalizePinCode(value);

export const formatPin = (value: string | null | undefined): string => {
  const digits = normalizePinCode(value);

  return digits || '-';
};

export const formatRegistrationNumber = (value: string | null | undefined): string => {
  const normalized = (value ?? '').trim();

  if (!normalized) {
    return '-';
  }

  if (/^\d+$/.test(normalized)) {
    return normalized.padStart(4, '0');
  }

  return normalized.toUpperCase();
};

export const formatPostalCodeInput = (value: string | null | undefined): string => {
  const digits = normalizePostalCode(value);

  if (!digits) {
    return '';
  }

  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
};

export const formatPostalCode = (value: string | null | undefined): string => formatPostalCodeInput(value) || '-';

export const formatFileSize = (value: number | null | undefined): string => {
  if (value == null || value <= 0) {
    return 'Tamanho não informado';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${bytesFormatter.format(value / 1024)} KB`;
  }

  return `${bytesFormatter.format(value / (1024 * 1024))} MB`;
};

export const formatDocumentTypeLabel = (value: string | null | undefined): string => {
  const normalized = (value ?? '').trim().replace(/^\./, '').toUpperCase();

  return normalized || 'ARQUIVO';
};

export const formatFileNameLabel = (value: string | null | undefined): string => {
  if (!value) {
    return 'Documento sem nome';
  }

  const parts = value.split('.');
  const extension = parts.length > 1 ? parts.pop() : null;
  const name = parts.join('.');

  const normalizedName = name
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const title = normalizedName
    .split(' ')
    .filter(Boolean)
    .map((part) => {
      if (/^\d+$/.test(part)) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(' ');

  if (!extension) {
    return title || value;
  }

  return `${title || name}.${extension.toLowerCase()}`;
};
