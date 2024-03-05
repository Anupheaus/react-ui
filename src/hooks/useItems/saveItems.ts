import { DeferredPromise, Record } from '@anupheaus/common';
import { FullPagination } from './UseItemsModels';

export function saveItems<T extends Record>(cachedItems: (DeferredPromise<T> | T)[], items: T[], pagination: FullPagination): void {
  for (let index = pagination.offset; index < pagination.offset + pagination.limit; index++) {
    const itemIndex = index - pagination.offset;
    if (itemIndex >= items.length) break;
    const newItem = items[itemIndex];
    const existingItem = cachedItems[index];
    if (existingItem instanceof DeferredPromise) existingItem.resolve(newItem);
    cachedItems[index] = newItem;
  }
}