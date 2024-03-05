import { DeferredPromise, Record } from '@anupheaus/common';
import { FullPagination } from './UseItemsModels';

export function prepareItems<T extends Record>(items: (DeferredPromise<T> | T)[], request: FullPagination): void {
  for (let index = request.offset; index < request.offset + request.limit; index++) {
    if (items[index] == null) items[index] = Promise.createDeferred();
  }
}