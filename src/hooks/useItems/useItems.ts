import { DataPagination, DeferredPromise } from '@anupheaus/common';
import { UseDataRequest, UseDataResponse } from '../../extensions';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { breakDownRequests } from './breakDownRequests';
import { prepareItems } from './prepareItems';
import { FullPagination } from './UseItemsModels';
import { saveItems } from './saveItems';
import { useForceUpdate } from '../useForceUpdate';
import { useDebounce } from '../useDebounce';
import { UseActions } from '../useActions';
import { makeOnRequest } from './makeOnRequest';
import { ListItemType } from '../../models';

export interface UseItemsActions {
  refresh(): void;
}

interface State<T extends ListItemType> {
  items: (T | DeferredPromise<T>)[];
  isLoading: boolean;
  total?: number;
  limit: number;
  offset: number;
}

interface Props<T extends ListItemType> {
  initialLimit?: number;
  items?: T[];
  actions?: UseActions<UseItemsActions>;
  onRequest?(request: UseDataRequest, response: (response: UseDataResponse<T>) => void): void;
}

export function useItems<T extends ListItemType>({ initialLimit = 20, items, actions, onRequest }: Props<T>) {
  const cachedItems = useRef<(DeferredPromise<T> | T)[]>([]).current;
  const refresh = () => {
    cachedItems.clear();
    stateRef.current.total = undefined;
    makeRequest(lastPaginationRequestRef.current);
  };
  const request = (onRequest ?? makeOnRequest(items, refresh));
  const asyncRequests = useRef(new Set<string>()).current;
  const currentRequestIdRef = useRef<string>('');
  const lastPaginationRequestRef = useRef<FullPagination>({ offset: 0, limit: initialLimit });
  actions?.({
    refresh,
  });
  const stateRef = useRef<State<T>>({ items: [], isLoading: true, total: initialLimit, ...lastPaginationRequestRef.current });
  const doDebouncedUpdate = useDebounce(useForceUpdate(), 25, 150);

  const makeRequest = (pagination: DataPagination, doUpdate = true) => {
    const fullPagination = lastPaginationRequestRef.current = { offset: 0, ...pagination } as FullPagination;
    let isLoading = false;
    const currentRequestId = currentRequestIdRef.current = Math.uniqueId();
    breakDownRequests({ offset: 0, ...pagination, total: stateRef.current.total, cachedItems }).map(requestedPagination => {
      prepareItems(cachedItems, requestedPagination);
      const requestId = Math.uniqueId();
      asyncRequests.add(requestId);
      isLoading = true;
      try {
        request({ requestId, pagination: requestedPagination }, ({ requestId: responseRequestId, items: responseItems, total }) => {
          asyncRequests.delete(responseRequestId);
          cachedItems.length = total;
          saveItems(cachedItems, responseItems, requestedPagination);
          if (currentRequestId !== currentRequestIdRef.current) return; // a new request has been made
          stateRef.current = {
            items: cachedItems?.slice(fullPagination.offset, fullPagination.offset + fullPagination.limit) ?? [],
            isLoading: asyncRequests.size !== 0,
            total,
            ...fullPagination,
          };
          doDebouncedUpdate();
        });
      } catch (e) {
        asyncRequests.delete(requestId);
        if (asyncRequests.size === 0 && stateRef.current.isLoading === true) {
          stateRef.current.isLoading = false;
          doDebouncedUpdate();
        }
        throw e;
      }
    });
    stateRef.current = {
      ...stateRef.current,
      items: cachedItems.slice(fullPagination.offset, fullPagination.offset + fullPagination.limit) ?? [],
      isLoading,
      ...fullPagination,
    };
    if (doUpdate) doDebouncedUpdate();
  };


  useMemo(() => {
    if (onRequest != null) return;
    makeRequest(lastPaginationRequestRef.current, false); // synchronous request and asynchronous prepare request
  }, []);

  useLayoutEffect(() => {
    if (onRequest != null) {
      cachedItems.clear(); // clear out any synchronous preparations
      makeRequest(lastPaginationRequestRef.current, false); // asynchronous request
    }
  }, []);

  return {
    ...stateRef.current,
    request: (pagination: DataPagination) => makeRequest(pagination, true),
  };
}