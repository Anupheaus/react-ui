import { useOnChange } from '../useOnChange';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { ReactListItem } from '../../models';
import { useRef } from 'react';

function useOrdinalToSort<T>(item: ReactListItem<T>) {
  if ('ordinal' in item) return item.ordinal;
  if ('index' in item) return item.index;
  if ('text' in item) return item.text;
}

export function makeOnRequest<T>(providedItems: ReactListItem<T>[] | undefined, refresh: () => void) {
  const items = providedItems ?? Array.empty();
  const lastRequestHashRef = useRef<string>('');
  const lastResponseRef = useRef<UseDataResponse<ReactListItem<T>>>();

  useOnChange(() => {
    lastRequestHashRef.current = '';
    lastResponseRef.current = undefined;
    refresh();
  }, [providedItems]);

  return async ({ requestId, pagination: { limit, offset = 0 } }: UseDataRequest, response: (response: UseDataResponse<ReactListItem<T>>) => void): Promise<void> => {
    if (limit > items.length) limit = items.length;
    if ((offset + limit) > items.length) offset = items.length - limit;
    if (offset < 0) offset = 0;

    const requestHash = `${limit}-${offset}`;
    if (requestHash === lastRequestHashRef.current && lastResponseRef.current != null) { response(lastResponseRef.current); return; }

    lastRequestHashRef.current = requestHash;
    lastResponseRef.current = {
      requestId,
      items: items.orderBy(useOrdinalToSort).slice(offset, offset + limit),
      total: items.length,
    };
    response(lastResponseRef.current);
  };
}
