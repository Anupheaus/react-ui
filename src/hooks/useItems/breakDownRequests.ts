import { DeferredPromise, Record, is } from '@anupheaus/common';
import { FullPagination } from './UseItemsModels';

interface Props<T extends Record> extends FullPagination {
  total?: number;
  cachedItems: (DeferredPromise<T> | T)[];
}

function findRequestsWithin<T extends Record>({ offset, limit, cachedItems }: Props<T>) {
  let currentRequest: FullPagination = { offset, limit: 0 };
  const requests: FullPagination[] = [];
  for (let index = offset; index < offset + limit; index++) {
    if (cachedItems[index] == null) {
      currentRequest.limit += 1;
    } else {
      if (currentRequest.limit > 0) {
        requests.push(currentRequest);
        currentRequest = { offset: index + 1, limit: 0 };
      }
      currentRequest.offset = index + 1;
    }
  }
  if (currentRequest.limit > 0) requests.push(currentRequest);
  return requests;
}

export function breakDownRequests<T extends Record>(props: Props<T>) {
  const { offset, limit, total } = props;
  let isFinished = false;
  let requests: FullPagination[] = [];
  let increment = 20;

  do {
    let reachedTheEnd = false;
    const earliestIndex = Math.max(0, offset - increment);
    let latestIndex = offset + limit + increment;
    if (is.number(total) && latestIndex > total) {
      latestIndex = total;
      reachedTheEnd = true;
    }
    requests = findRequestsWithin({ ...props, offset: earliestIndex, limit: latestIndex - earliestIndex });
    if (requests.length > 0) {
      if (requests[requests.length - 1].limit >= 20) isFinished = true;
      if (requests[0].limit >= 20) isFinished = true;
    }
    if (!isFinished && earliestIndex === 0 && reachedTheEnd) isFinished = true;
    increment += 20;
  } while (!isFinished);
  return requests;
}