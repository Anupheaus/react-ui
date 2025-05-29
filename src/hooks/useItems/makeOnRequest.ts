import { useOnChange } from '../useOnChange';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { ListItemType } from '../../models';

function useOrdinalToSort(item: ListItemType) {
  if (typeof (item) === 'string') return item;
  if ('ordinal' in item) return item.ordinal;
  if ('index' in item) return item.index;
}

export function makeOnRequest<T extends ListItemType>(providedItems: T[] | undefined, refresh: () => void) {
  const items = providedItems ?? Array.empty();

  useOnChange(refresh, [providedItems]);

  return async ({ requestId, pagination: { limit, offset = 0 } }: UseDataRequest, response: (response: UseDataResponse<T>) => void): Promise<void> => {
    if (limit > items.length) limit = items.length;
    if ((offset + limit) > items.length) offset = items.length - limit;
    if (offset < 0) offset = 0;
    response({
      requestId,
      items: items.orderBy(useOrdinalToSort).slice(offset, offset + limit),
      total: items.length,
    });
  };
}
