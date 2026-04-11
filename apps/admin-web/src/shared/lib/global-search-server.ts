import { formatDateTime } from '@rh-ponto/core';

import { executeAdminGraphql } from './admin-server-data-connect';
import type { GlobalSearchCategory, GlobalSearchResponse, GlobalSearchResultItem } from './global-search-contracts';
import { formatJustificationTypeLabel, formatTimeRecordTypeLabel } from './admin-formatters';

interface SearchQueryData {
  employees: Array<{
    id: string;
    fullName: string;
    registrationNumber: string;
    email?: string | null;
    position?: string | null;
    isActive: boolean;
    department?: { name: string } | null;
  }>;
  departments: Array<{
    id: string;
    code: string;
    name: string;
    costCenter?: string | null;
    isActive: boolean;
  }>;
  timeRecords: Array<{
    id: string;
    recordType: string;
    status: string;
    recordedAt: string;
    employee: { fullName: string };
  }>;
  justifications: Array<{
    id: string;
    type: string;
    status: string;
    reason: string;
    createdAt: string;
    employee: { fullName: string };
  }>;
  justificationAttachments: Array<{
    id: string;
    fileName: string;
    createdAt: string;
    justification: {
      id: string;
      employee: { fullName: string };
    };
  }>;
  vacationRequests: Array<{
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    attachmentFileName?: string | null;
    employee: { fullName: string };
  }>;
  onboardingJourneys: Array<{
    id: string;
    status: string;
    currentStageLabel?: string | null;
    progressPercent: number;
    employee: { fullName: string };
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    entityName: string;
    description?: string | null;
    createdAt: string;
  }>;
  workSchedules: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>;
  devices: Array<{
    id: string;
    name: string;
    identifier: string;
    locationName?: string | null;
    type: string;
    isActive: boolean;
  }>;
}

const searchSnapshotQuery = `
  query GetAdminGlobalSearchSnapshot {
    employees(limit: 200, orderBy: [{ fullName: ASC }]) {
      id
      fullName
      registrationNumber
      email
      position
      isActive
      department {
        name
      }
    }
    departments(limit: 100, orderBy: [{ name: ASC }]) {
      id
      code
      name
      costCenter
      isActive
    }
    timeRecords(limit: 200, orderBy: [{ recordedAt: DESC }]) {
      id
      recordType
      status
      recordedAt
      employee {
        fullName
      }
    }
    justifications(limit: 200, orderBy: [{ createdAt: DESC }]) {
      id
      type
      status
      reason
      createdAt
      employee {
        fullName
      }
    }
    justificationAttachments(limit: 200, orderBy: [{ createdAt: DESC }]) {
      id
      fileName
      createdAt
      justification {
        id
        employee {
          fullName
        }
      }
    }
    vacationRequests(limit: 100, orderBy: [{ requestedAt: DESC }]) {
      id
      status
      startDate
      endDate
      attachmentFileName
      employee {
        fullName
      }
    }
    onboardingJourneys(limit: 100, orderBy: [{ createdAt: DESC }]) {
      id
      status
      currentStageLabel
      progressPercent
      employee {
        fullName
      }
    }
    auditLogs(limit: 150, orderBy: [{ createdAt: DESC }]) {
      id
      action
      entityName
      description
      createdAt
    }
    workSchedules(limit: 80, orderBy: [{ name: ASC }]) {
      id
      name
      startTime
      endTime
      isActive
    }
    devices(limit: 80, orderBy: [{ name: ASC }]) {
      id
      name
      identifier
      locationName
      type
      isActive
    }
  }
`;

const categoryPriority: Record<GlobalSearchCategory, number> = {
  employee: 1,
  document: 2,
  justification: 3,
  vacation: 4,
  onboarding: 5,
  'time-record': 6,
  department: 7,
  audit: 8,
  schedule: 9,
  device: 10,
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();

const createScore = (term: string, text: string) => {
  const normalizedTerm = normalize(term);
  const normalizedText = normalize(text);

  if (!normalizedText.includes(normalizedTerm)) {
    return -1;
  }

  if (normalizedText.startsWith(normalizedTerm)) {
    return 120;
  }

  return 60 - normalizedText.indexOf(normalizedTerm);
};

const toSearchItem = (
  category: GlobalSearchCategory,
  id: string,
  title: string,
  subtitle: string,
  meta: string,
  href: string,
): GlobalSearchResultItem & { score: number } => ({
  id,
  category,
  title,
  subtitle,
  meta,
  href,
  score: 0,
});

export const searchAcrossAdminData = async (term: string): Promise<GlobalSearchResponse> => {
  const trimmedTerm = term.trim();

  if (trimmedTerm.length < 2) {
    return {
      term: trimmedTerm,
      total: 0,
      items: [],
    };
  }

  const data = await executeAdminGraphql<SearchQueryData>(searchSnapshotQuery);
  const results: Array<GlobalSearchResultItem & { score: number }> = [];

  for (const employee of data.employees) {
    const haystack = [employee.fullName, employee.registrationNumber, employee.email ?? '', employee.position ?? '', employee.department?.name ?? ''].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'employee',
          employee.id,
          employee.fullName,
          `${employee.registrationNumber} • ${employee.department?.name ?? 'Sem departamento'}`,
          `${employee.position ?? 'Cargo não informado'}${employee.isActive ? '' : ' • Inativo'}`,
          `/employees/${employee.id}`,
        ),
        score,
      });
    }
  }

  for (const attachment of data.justificationAttachments) {
    const haystack = [attachment.fileName, attachment.justification.employee.fullName].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'document',
          attachment.id,
          attachment.fileName,
          attachment.justification.employee.fullName,
          `Documento vinculado em ${formatDateTime(attachment.createdAt)}`,
          '/documents',
        ),
        score,
      });
    }
  }

  for (const justification of data.justifications) {
    const haystack = [justification.reason, justification.employee.fullName, justification.type, justification.status].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'justification',
          justification.id,
          justification.employee.fullName,
          formatJustificationTypeLabel(justification.type as never),
          justification.reason,
          '/justifications',
        ),
        score,
      });
    }
  }

  for (const vacation of data.vacationRequests) {
    const haystack = [vacation.employee.fullName, vacation.status, vacation.attachmentFileName ?? '', vacation.startDate, vacation.endDate].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'vacation',
          vacation.id,
          vacation.employee.fullName,
          `Férias • ${vacation.startDate} até ${vacation.endDate}`,
          `Status ${vacation.status}`,
          `/vacations/${vacation.id}`,
        ),
        score,
      });
    }
  }

  for (const timeRecord of data.timeRecords) {
    const haystack = [timeRecord.employee.fullName, timeRecord.recordType, timeRecord.status, timeRecord.recordedAt].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'time-record',
          timeRecord.id,
          timeRecord.employee.fullName,
          formatTimeRecordTypeLabel(timeRecord.recordType as never),
          formatDateTime(timeRecord.recordedAt),
          '/time-records',
        ),
        score,
      });
    }
  }

  for (const onboarding of data.onboardingJourneys) {
    const haystack = [
      onboarding.employee.fullName,
      onboarding.status,
      onboarding.currentStageLabel ?? '',
      String(onboarding.progressPercent),
    ].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'onboarding',
          onboarding.id,
          onboarding.employee.fullName,
          `Onboarding • ${onboarding.currentStageLabel ?? 'Fluxo inicial'}`,
          `Status ${onboarding.status} • ${onboarding.progressPercent}% concluído`,
          `/onboarding/${onboarding.id}`,
        ),
        score,
      });
    }
  }

  for (const department of data.departments) {
    const haystack = [department.name, department.code, department.costCenter ?? ''].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'department',
          department.id,
          department.name,
          department.code,
          department.costCenter ? `Centro de custo ${department.costCenter}` : 'Sem centro de custo',
          '/departments',
        ),
        score,
      });
    }
  }

  for (const audit of data.auditLogs) {
    const haystack = [audit.action, audit.entityName, audit.description ?? ''].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'audit',
          audit.id,
          audit.description ?? audit.action,
          `Auditoria • ${audit.entityName}`,
          formatDateTime(audit.createdAt),
          `/audit/${audit.id}`,
        ),
        score,
      });
    }
  }

  for (const schedule of data.workSchedules) {
    const haystack = [schedule.name, schedule.startTime, schedule.endTime].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'schedule',
          schedule.id,
          schedule.name,
          `${schedule.startTime} às ${schedule.endTime}`,
          schedule.isActive ? 'Escala ativa' : 'Escala inativa',
          '/schedules',
        ),
        score,
      });
    }
  }

  for (const device of data.devices) {
    const haystack = [device.name, device.identifier, device.locationName ?? '', device.type].join(' ');
    const score = createScore(trimmedTerm, haystack);
    if (score >= 0) {
      results.push({
        ...toSearchItem(
          'device',
          device.id,
          device.name,
          device.locationName ?? 'Sem localidade',
          `${device.type}${device.isActive ? '' : ' • Inativo'}`,
          '/settings',
        ),
        score,
      });
    }
  }

  const orderedResults = results
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return categoryPriority[left.category] - categoryPriority[right.category];
    })
    .slice(0, 12)
    .map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      subtitle: item.subtitle,
      meta: item.meta,
      href: item.href,
    }));

  return {
    term: trimmedTerm,
    total: orderedResults.length,
    items: orderedResults,
  };
};
