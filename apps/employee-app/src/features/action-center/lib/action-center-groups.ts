export type ActionCenterStatusBucket = 'requires-action' | 'in-review' | 'recent';

export type ActionCenterSource = 'notification' | 'document' | 'vacation' | 'justification';

export interface ActionCenterItem {
  id: string;
  source: ActionCenterSource;
  statusBucket: ActionCenterStatusBucket;
  title: string;
  description: string;
  href: string;
  occurredAt: string;
  statusLabel: string;
}

export interface ActionCenterGroups {
  requiresAction: ActionCenterItem[];
  inReview: ActionCenterItem[];
  recent: ActionCenterItem[];
}

const compareNewestFirst = (left: ActionCenterItem, right: ActionCenterItem) =>
  new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();

export const groupActionCenterItems = (items: ActionCenterItem[]): ActionCenterGroups => {
  const orderedItems = items.slice().sort(compareNewestFirst);

  return {
    requiresAction: orderedItems.filter((item) => item.statusBucket === 'requires-action'),
    inReview: orderedItems.filter((item) => item.statusBucket === 'in-review'),
    recent: orderedItems.filter((item) => item.statusBucket === 'recent'),
  };
};
