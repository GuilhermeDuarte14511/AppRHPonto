import type { EmployeeNotificationItem, EmployeeNotificationSeverity } from '@/shared/lib/employee-self-service-api';
import { mobileTheme } from '@/shared/theme/tokens';

export const notificationCategoryLabels: Record<string, string> = {
  justification: 'Justificativas',
  vacation: 'Férias',
  document: 'Documentos',
  payroll: 'Holerites',
  time_record: 'Marcações',
  communication: 'Comunicados',
  system: 'Sistema',
};

export const notificationSeverityPalette: Record<
  EmployeeNotificationSeverity,
  { accent: string; soft: string; icon: string }
> = {
  info: {
    accent: mobileTheme.primary,
    soft: mobileTheme.primarySoft,
    icon: 'notifications-outline',
  },
  success: {
    accent: mobileTheme.success,
    soft: mobileTheme.successSoft,
    icon: 'checkmark-circle-outline',
  },
  warning: {
    accent: mobileTheme.warning,
    soft: mobileTheme.warningSoft,
    icon: 'alert-circle-outline',
  },
  danger: {
    accent: mobileTheme.danger,
    soft: mobileTheme.dangerSoft,
    icon: 'warning-outline',
  },
};

export const formatNotificationTime = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export const groupNotificationsByDay = (items: EmployeeNotificationItem[]) => {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

  return items.reduce<{ key: string; title: string; items: EmployeeNotificationItem[] }[]>((groups, item) => {
    const key = new Date(item.triggeredAt).toISOString().slice(0, 10);
    const existing = groups.find((group) => group.key === key);

    if (existing) {
      existing.items.push(item);
      return groups;
    }

    groups.push({
      key,
      title: formatter.format(new Date(item.triggeredAt)),
      items: [item],
    });

    return groups;
  }, []);
};
