import type { EmployeeVacationItem } from '@/shared/lib/employee-self-service-api';

export const vacationStatusLabels: Record<string, string> = {
  pending: 'Em análise',
  approved: 'Aprovada',
  rejected: 'Reprovada',
  cancelled: 'Cancelada',
};

export const approvalStatusLabels: Record<string, string> = {
  pending: 'Pendente',
  completed: 'Concluído',
  approved: 'Aprovado',
  rejected: 'Reprovado',
};

export const formatVacationDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(value))
    : 'Não informado';

export const formatVacationWindow = (item: Pick<EmployeeVacationItem, 'startDate' | 'endDate'>) =>
  `${formatVacationDate(item.startDate)} até ${formatVacationDate(item.endDate)}`;

export const calculateDaysBetween = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const milliseconds = end.getTime() - start.getTime();

  return Math.max(Math.round(milliseconds / (1000 * 60 * 60 * 24)) + 1, 1);
};
