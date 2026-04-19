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
  dedupeKey: string;
  notificationId?: string | null;
}

export interface ActionCenterGroups {
  requiresAction: ActionCenterItem[];
  inReview: ActionCenterItem[];
  recent: ActionCenterItem[];
}

const compareNewestFirst = (left: ActionCenterItem, right: ActionCenterItem) =>
  new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime();

const RECENT_WINDOW_DAYS = 14;
const MAX_RECENT_ITEMS = 6;

const isInsideRecentWindow = (item: ActionCenterItem, now: Date, recentWindowDays: number) => {
  const occurredAt = new Date(item.occurredAt).getTime();
  const windowStart = now.getTime() - recentWindowDays * 24 * 60 * 60 * 1000;

  return occurredAt >= windowStart && occurredAt <= now.getTime();
};

const dedupeActionCenterItems = (items: ActionCenterItem[]) => {
  const orderedItems = items.slice().sort(compareNewestFirst);
  const uniqueItems = new Map<string, ActionCenterItem>();

  for (const item of orderedItems) {
    const existingItem = uniqueItems.get(item.dedupeKey);

    if (!existingItem) {
      uniqueItems.set(item.dedupeKey, item);
      continue;
    }

    const preferredItem =
      existingItem.source === 'notification' && item.source !== 'notification'
        ? item
        : item.source === 'notification' && existingItem.source !== 'notification'
          ? existingItem
          : existingItem;

    uniqueItems.set(item.dedupeKey, {
      ...preferredItem,
      notificationId: existingItem.notificationId ?? item.notificationId ?? null,
    });
  }

  return Array.from(uniqueItems.values()).sort(compareNewestFirst);
};

export const groupActionCenterItems = (
  items: ActionCenterItem[],
  options?: {
    now?: Date;
    recentWindowDays?: number;
    maxRecentItems?: number;
  },
): ActionCenterGroups => {
  const now = options?.now ?? new Date();
  const recentWindowDays = options?.recentWindowDays ?? RECENT_WINDOW_DAYS;
  const maxRecentItems = options?.maxRecentItems ?? MAX_RECENT_ITEMS;
  const orderedItems = dedupeActionCenterItems(items);

  return {
    requiresAction: orderedItems.filter((item) => item.statusBucket === 'requires-action'),
    inReview: orderedItems.filter((item) => item.statusBucket === 'in-review'),
    recent: orderedItems
      .filter((item) => item.statusBucket === 'recent' && isInsideRecentWindow(item, now, recentWindowDays))
      .slice(0, maxRecentItems),
  };
};
