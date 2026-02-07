import type { AnyObject, DataPagination } from '@anupheaus/common';
import type { ReactListItem } from '../../models';
import type { State } from './useItems';

export function ensureSelectedItemsPersist<T = void>(items: ReactListItem<T>[], selectedItemIds?: string[]): void {
  if (selectedItemIds == null) return;
  for (const item of items) {
    if (selectedItemIds.includes(item.id) && item.isSelectable !== false) {
      item.isSelected = true;
    }
  }
}

type UpdateItemsDelegate<T = void> = (existingItem: ReactListItem<T> | undefined, index: number, paginatedIndex: number) => ReactListItem<T>;

function updateItems<T = void>(items: ReactListItem<T>[], pagination: DataPagination, total: number | undefined, delegate: UpdateItemsDelegate<T>): Partial<State<T>> {
  const { offset = 0, limit } = pagination;
  const newItems = items.slice();
  const maxLength = total == null ? offset + limit : Math.min(offset + limit, total);
  for (let index = Math.min(offset, newItems.length); index < maxLength; index++) {
    const existingItem = newItems[index];
    newItems[index] = delegate(existingItem, index, index - offset);
  }
  // When total is known, truncate so we don't leave skeleton placeholders beyond the actual count
  if (total != null && newItems.length > total) newItems.length = total;
  return { items: newItems, ...pagination };
}

const createSkeletonItem = <T = void>(index: number): ReactListItem<T> => ({ id: `${index}`, text: 'Loading...', data: Promise.createDeferred<T>(), _tempItem: true } as unknown as ReactListItem<T>);

export function updateWithResponse<T = void>(currentState: State<T>, pagination: DataPagination, response: ReactListItem<T>[], total?: number, isLoading = false) {
  const partialState = updateItems(currentState.items, pagination, total,
    (existingItem, index, paginatedIndex) => (existingItem == null || (existingItem as AnyObject)._tempItem === true) ? response[paginatedIndex] : (existingItem ?? createSkeletonItem(index)));
  return { ...currentState, ...partialState, total, isLoading };
}

export function updateStateWithSkeletons<T = void>(currentState: State<T>, pagination: DataPagination): State<T> {
  const partialState = updateItems(
    currentState.items,
    pagination,
    undefined,
    (existingItem, index) => existingItem != null ? existingItem : createSkeletonItem(index),
  );
  return { ...currentState, ...partialState, isLoading: true };
}

export function clearResponse<T = void>(currentState: State<T>): State<T> {
  return { ...currentState, items: [], total: 0, isLoading: false };
}
