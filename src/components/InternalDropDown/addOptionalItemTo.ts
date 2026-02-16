import { is } from '@anupheaus/common';
import type { ReactListItem } from '../../models';
import type { ReactNode } from 'react';

export const optionalItemKey = `optional-item-key-${Math.uniqueId()}`;

export function addOptionalItemTo<T = void>(items: ReactListItem<T>[] | undefined, isOptional?: boolean, optionalItemLabel?: ReactNode): ReactListItem<T>[] {
  if (isOptional !== true) return items ?? Array.empty();
  if (items?.some(item => !is.plainObject(item) || !Reflect.has(item, 'id') || item.id === undefined)) return items;
  return [{ id: optionalItemKey, text: 'N/A', label: optionalItemLabel }, ...(items ?? [])];
}