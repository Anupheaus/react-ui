import { DataPagination, DeferredPromise, Record, is } from '@anupheaus/common';
import { UseDataResponse } from '../../extensions';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { breakDownRequests } from './breakDownRequests';
import { prepareItems } from './prepareItems';
import { FullPagination } from './UseItemsModels';
import { saveItems } from './saveItems';
import { useForceUpdate } from '../useForceUpdate';
import { useDebounce } from '../useDebounce';
import { UseActions } from '../useActions';
import { makeOnRequest } from './makeOnRequest';

export interface UseItemsActions {
  refresh(): void;
}

interface State<T extends Record> {
  items: (T | DeferredPromise<T>)[];
  isLoading: boolean;
  total?: number;
  limit: number;
  offset: number;
}

interface Props<T extends Record> {
  initialLimit?: number;
  items?: T[];
  actions?: UseActions<UseItemsActions>;
  onRequest?(pagination: DataPagination): UseDataResponse<T>;
}

export function useItems<T extends Record>({ initialLimit = 10, items, actions, onRequest }: Props<T>) {
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
  const stateRef = useRef<State<T>>({ items: [], isLoading: true, ...lastPaginationRequestRef.current });
  const doDebouncedUpdate = useDebounce(useForceUpdate(), 25, 150);

  const makeRequest = (pagination: DataPagination, doUpdate = true, isAsyncFirstRequest = false) => {
    const fullPagination = lastPaginationRequestRef.current = { offset: 0, ...pagination } as FullPagination;
    let isLoading = false;
    let total = stateRef.current.total;
    const currentRequestId = currentRequestIdRef.current = Math.uniqueId();
    breakDownRequests({ offset: 0, ...pagination, total: stateRef.current.total, cachedItems }).map(requestParams => {
      prepareItems(cachedItems, requestParams);
      if (isAsyncFirstRequest) { isLoading = true; return; }
      const result = request(requestParams);
      if (is.promise(result)) {
        const requestId = Math.uniqueId();
        asyncRequests.add(requestId);
        isLoading = true;
        result
          .then(response => {
            asyncRequests.delete(requestId);
            cachedItems.length = response.total;
            saveItems(cachedItems, response.items, requestParams);
            if (currentRequestId !== currentRequestIdRef.current) return; // a new request has been made
            stateRef.current = {
              items: cachedItems?.slice(fullPagination.offset, fullPagination.offset + fullPagination.limit) ?? [],
              isLoading: asyncRequests.size !== 0,
              total: response.total,
              ...fullPagination,
            };
            doDebouncedUpdate();
          }, () => {
            asyncRequests.delete(requestId);
            if (asyncRequests.size === 0 && stateRef.current.isLoading === true) { stateRef.current.isLoading = false; doDebouncedUpdate(); }
          });
      } else {
        total = result.total;
        cachedItems.length = total;
        saveItems(cachedItems, result.items, requestParams);
      }
    });
    stateRef.current = {
      items: cachedItems.slice(fullPagination.offset, fullPagination.offset + fullPagination.limit) ?? [],
      isLoading,
      total,
      ...fullPagination,
    };
    if (doUpdate) doDebouncedUpdate();
  };


  useMemo(() => {
    makeRequest(lastPaginationRequestRef.current, false, onRequest != null); // synchronous request and asynchronous prepare request
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