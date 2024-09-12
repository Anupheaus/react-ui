import { DataPagination, DeferredPromise, Error, is } from '@anupheaus/common';
import { UseDataRequest, UseDataResponse } from '../../extensions';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { FullPagination } from './UseItemsModels';
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
  error?: Error;
}

interface Props<T extends ListItemType> {
  initialLimit?: number;
  items?: T[];
  actions?: UseActions<UseItemsActions>;
  onRequest?(request: UseDataRequest, response: (response: UseDataResponse<T>) => void): Promise<void>;
}

export function useItems<T extends ListItemType>({ initialLimit = 20, items, actions, onRequest }: Props<T>) {
  const refresh = async () => {
    stateRef.current.total = undefined;
    await makeRequest(lastPaginationRequestRef.current);
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

  const makeRequest = async (pagination: DataPagination, doUpdate = true) => {
    const fullPagination = lastPaginationRequestRef.current = { offset: 0, ...pagination } as FullPagination;
    let isLoading = false;
    const currentRequestId = currentRequestIdRef.current = Math.uniqueId();
    const requestId = Math.uniqueId();
    asyncRequests.add(requestId);
    isLoading = true;
    try {
      await request({ requestId, pagination: fullPagination }, ({ requestId: responseRequestId, items: responseItems, total }) => {
        asyncRequests.delete(responseRequestId);
        if (currentRequestId !== currentRequestIdRef.current) return; // a new request has been made
        stateRef.current = {
          items: responseItems,
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
        stateRef.current.total = 0;
        stateRef.current.items = [];
        if (is.errorLike(e)) stateRef.current.error = new Error(e);
        doDebouncedUpdate();
      }
    }
    stateRef.current = {
      ...stateRef.current,
      isLoading,
    };
    if (doUpdate) doDebouncedUpdate();
  };

  useMemo(() => {
    if (onRequest != null) return;
    makeRequest(lastPaginationRequestRef.current, false); // synchronous request and asynchronous prepare request
  }, []);

  useLayoutEffect(() => {
    if (onRequest != null) makeRequest(lastPaginationRequestRef.current, false); // asynchronous request
  }, []);

  return {
    ...stateRef.current,
    request: (pagination: DataPagination) => makeRequest(pagination, true),
  };
}