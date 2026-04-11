import type { JustificationStatus } from '@rh-ponto/types';

export const getJustificationStatusVariant = (status: JustificationStatus) => {
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

