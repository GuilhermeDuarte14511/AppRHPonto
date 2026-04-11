import type { JustificationStatus, JustificationType } from '@rh-ponto/types';

export interface JustificationListItemViewModel {
  id: string;
  employeeId: string;
  type: JustificationType;
  status: JustificationStatus;
  reason: string;
  createdAtLabel: string;
}

