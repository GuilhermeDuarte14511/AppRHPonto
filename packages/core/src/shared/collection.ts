export const sortByDateDesc = <TItem extends { createdAt: string }>(items: TItem[]): TItem[] =>
  [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

