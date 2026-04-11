import { formatDate } from '@rh-ponto/core';
import type { BadgeProps } from '@rh-ponto/ui';

import type { VacationRequestStatus } from '../types/vacation-request';

export const getVacationStatusLabel = (status: VacationRequestStatus): string => {
  switch (status) {
    case 'approved':
      return 'Aprovada';
    case 'rejected':
      return 'Reprovada';
    case 'pending':
    default:
      return 'Pendente';
  }
};

export const getVacationStatusVariant = (status: VacationRequestStatus): NonNullable<BadgeProps['variant']> => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'pending':
    default:
      return 'warning';
  }
};

export const formatVacationPeriod = (startDate: string, endDate: string): string =>
  `${formatDate(startDate)} - ${formatDate(endDate)}`;
