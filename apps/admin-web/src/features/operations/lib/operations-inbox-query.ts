import { fetchOnboardingJourneyDetail, fetchOnboardingOverview } from '@/features/onboarding/lib/onboarding-client';

import { fetchAdminLiveDataSnapshot } from '@/shared/lib/admin-live-data';

import { buildOperationsInbox, type OperationsInboxData } from './operations-inbox-service';

const toIsoString = (value: string | Date | null | undefined) => {
  if (!value) {
    return null;
  }

  return typeof value === 'string' ? value : value.toISOString();
};

const isDueSoonItem = (
  item: OperationsInboxData['items'][number],
  now = new Date(),
) => {
  if (item.category !== 'vacation' && item.category !== 'onboarding') {
    return false;
  }

  const triggeredAt = new Date(item.notification.triggeredAt).getTime();
  const nowTime = now.getTime();
  const sevenDaysFromNow = nowTime + 7 * 24 * 60 * 60 * 1000;

  return triggeredAt >= nowTime && triggeredAt <= sevenDaysFromNow;
};

const isOverdueOnboardingTask = (
  task: {
    dueDate: string | null;
    status: 'pending' | 'in_progress' | 'blocked' | 'completed';
  },
  now = new Date(),
) => {
  if (task.status === 'completed' || !task.dueDate) {
    return false;
  }

  return new Date(`${task.dueDate}T23:59:59.999Z`).getTime() < now.getTime();
};

export const getOperationsInboxAt = async (now: Date): Promise<OperationsInboxData> => {
  const snapshot = await fetchAdminLiveDataSnapshot();

  const employeeDirectory = new Map(snapshot.employees.map((employee) => [employee.id, employee.fullName]));
  let blockedOnboardingTasks: Array<{
    id: string;
    title: string;
    status: 'blocked' | 'pending' | 'in_progress' | 'completed';
    dueDate?: string | null;
    employeeName: string;
    journeyId: string;
    updatedAt: string;
  }> = [];

  try {
    const onboardingOverview = await fetchOnboardingOverview();
    const journeysNeedingAttention = onboardingOverview.items.filter(
      (journey) => journey.status === 'blocked' || journey.overdueTasksCount > 0,
    );

    const detailResults = await Promise.allSettled(
      journeysNeedingAttention.map((journey) => fetchOnboardingJourneyDetail(journey.id)),
    );

    blockedOnboardingTasks = detailResults.flatMap((result) => {
      if (result.status !== 'fulfilled') {
        return [];
      }

      return result.value.sections.flatMap((section) =>
        section.tasks
          .filter((task) => task.status === 'blocked' || isOverdueOnboardingTask(task, now))
          .map((task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            dueDate: task.dueDate,
            employeeName: result.value.employeeName,
            journeyId: result.value.id,
            updatedAt: task.dueDate ? `${task.dueDate}T09:00:00.000Z` : now.toISOString(),
          })),
      );
    });
  } catch {
    blockedOnboardingTasks = [];
  }

  const inbox = buildOperationsInbox({
    pendingTimeRecords: snapshot.timeRecords
      .filter((record) => record.status === 'pending_review')
      .map((record) => ({
        id: record.id,
        employeeName: employeeDirectory.get(record.employeeId) ?? 'Colaborador não identificado',
        recordedAt: toIsoString(record.recordedAt) ?? new Date(0).toISOString(),
        status: 'pending_review' as const,
        recordType: record.recordType,
      })),
    pendingJustifications: snapshot.justifications
      .filter((justification) => justification.status === 'pending')
      .map((justification) => ({
        id: justification.id,
        employeeName: employeeDirectory.get(justification.employeeId) ?? 'Colaborador não identificado',
        createdAt: toIsoString(justification.createdAt) ?? new Date(0).toISOString(),
        type: justification.type,
      })),
    pendingVacations: snapshot.vacationRequests
      .filter((vacation) => vacation.status === 'pending')
      .map((vacation) => ({
        id: vacation.id,
        employeeName: employeeDirectory.get(vacation.employeeId) ?? 'Colaborador não identificado',
        requestedAt: vacation.requestedAt,
        startDate: vacation.startDate,
        endDate: vacation.endDate,
      })),
    blockedOnboardingTasks,
    inactiveDevices: snapshot.devices
      .filter((device) => device.isActive === false)
      .map((device) => ({
        id: device.id,
        name: device.name,
        locationName: device.locationName ?? null,
        lastSyncAt: toIsoString(device.lastSyncAt) ?? null,
      })),
  });

  return {
    summary: {
      total: inbox.summary.total,
      highPriority: inbox.items.filter((item) => item.priority === 'high').length,
      dueSoon: inbox.items.filter((item) => isDueSoonItem(item, now)).length,
    },
    items: inbox.items,
    groups: inbox.groups,
  };
};

export const getOperationsInbox = async (): Promise<OperationsInboxData> => getOperationsInboxAt(new Date());
