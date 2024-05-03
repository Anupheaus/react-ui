import { DeferredPromise } from '@anupheaus/common';
import { FullPagination } from './UseItemsModels';
import { ListItemType } from '../../models';

export function prepareItems<T extends ListItemType>(items: (DeferredPromise<T> | T)[], request: FullPagination): void {
  for (let index = request.offset; index < request.offset + request.limit; index++) {
    if (items[index] == null) items[index] = Promise.createDeferred();
  }
}