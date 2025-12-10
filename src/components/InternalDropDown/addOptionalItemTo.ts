import { is } from '@anupheaus/common';
import type { ListItemType } from '../../models';

export function addOptionalItemTo<T extends ListItemType>(items: T[] | undefined, isOptional?: boolean): T[] {
  if (isOptional !== true) return items ?? Array.empty();
  if (items?.some(item => !is.plainObject(item) || !Reflect.has(item, 'id') || item.id === undefined)) return items;
  return [{ id: undefined as unknown as string, text: 'N/A' } as T, ...(items ?? [])];
}