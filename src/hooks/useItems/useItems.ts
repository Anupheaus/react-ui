import type { DataPagination } from '@anupheaus/common';
import { Error, is } from '@anupheaus/common';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import { useLayoutEffect, useMemo, useRef } from 'react';
import type { FullPagination } from './UseItemsModels';
import { useForceUpdate } from '../useForceUpdate';
import { useDebounce } from '../useDebounce';
import type { UseActions } from '../useActions';
import { makeOnRequest } from './makeOnRequest';
import type { ReactListItem } from '../../models';
import { clearResponse, ensureSelectedItemsPersist, updateStateWithSkeletons, updateWithResponse } from './useItemsUtils';

export interface UseItemsActions {
  refresh(): void;
}

export interface State<T> {
  items: ReactListItem<T>[];
  isLoading: boolean;
  total?: number;
  limit: number;
  offset: number;
  error?: Error;
}

interface Props<T = void> {
  initialLimit?: number;
  items?: ReactListItem<T>[];
  selectedItemIds?: string[];
  useSkeletons?: boolean;
  actions?: UseActions<UseItemsActions>;
  onRequest?(request: UseDataRequest, response: (response: UseDataResponse<ReactListItem<T>>) => void): Promise<void>;
  onItemsChange?(items: ReactListItem<T>[]): void;
}

export function useItems<T = void>({ initialLimit = 20, items, actions, onRequest, onItemsChange, selectedItemIds, useSkeletons = false }: Props<T>) {
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
  const doDebouncedItemsChange = useDebounce((updatedItems: ReactListItem<T>[]) => onItemsChange?.(updatedItems), 25, 150);

  const makeRequest = async (pagination: DataPagination, doUpdate = true) => {
    const fullPagination = lastPaginationRequestRef.current = { offset: 0, ...pagination } as FullPagination;
    let isLoading = false;
    const currentRequestId = currentRequestIdRef.current = Math.uniqueId();
    const requestId = Math.uniqueId();
    asyncRequests.add(requestId);
    isLoading = true;
    try {
      if (useSkeletons) {
        stateRef.current = updateStateWithSkeletons(stateRef.current, fullPagination);
        doDebouncedUpdate();
      }
      await request({ requestId, pagination: fullPagination }, ({ requestId: responseRequestId, items: responseItems, total }) => {
        asyncRequests.delete(responseRequestId);
        if (currentRequestId !== currentRequestIdRef.current) return; // a new request has been made        
        ensureSelectedItemsPersist(responseItems, selectedItemIds);
        stateRef.current = updateWithResponse(stateRef.current, fullPagination, responseItems, total, asyncRequests.size !== 0);
        doDebouncedItemsChange(responseItems);
        doDebouncedUpdate();
      });
    } catch (e) {
      asyncRequests.delete(requestId);
      if (asyncRequests.size === 0 && stateRef.current.isLoading === true) {
        stateRef.current = clearResponse(stateRef.current);
        doDebouncedItemsChange(stateRef.current.items);
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
    stateRef.current.items = stateRef.current.items.map(item => ({ ...item, isSelected: selectedItemIds?.includes(item.id) ?? false }));
  }, [selectedItemIds]);

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