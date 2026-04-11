import type { TimeRecordStatus } from '@rh-ponto/types';

export const getTimeRecordStatusVariant = (status: TimeRecordStatus) => {
  switch (status) {
    case 'valid':
      return 'success';
    case 'pending_review':
      return 'warning';
    case 'adjusted':
      return 'info';
    case 'rejected':
      return 'danger';
    default:
      return 'neutral';
  }
};

