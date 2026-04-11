import { Badge } from '@rh-ponto/ui';

import { getVacationStatusLabel, getVacationStatusVariant } from '../lib/vacation-helpers';
import type { VacationRequestStatus } from '../types/vacation-request';

export const VacationStatusBadge = ({ status }: { status: VacationRequestStatus }) => (
  <Badge variant={getVacationStatusVariant(status)}>{getVacationStatusLabel(status)}</Badge>
);
