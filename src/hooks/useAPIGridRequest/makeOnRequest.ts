import { useOnChange } from '../useOnChange';
import { UseDataRequest, UseDataResponse } from '../../extensions';
import { ListItemType } from '../../models';

export function makeOnRequest<T extends ListItemType>(providedItems: T[] | undefined, refresh: () => void) {
  const items = providedItems ?? Array.empty();

  useOnChange(refresh, [providedItems]);

  return async ({ requestId, pagination: { limit, offset = 0 } }: UseDataRequest, response: (response: UseDataResponse<T>) => void): Promise<void> => {
    if (limit > items.length) limit = items.length;
    if ((offset + limit) > items.length) offset = items.length - limit;
    if (offset < 0) offset = 0;
    response({
      requestId,
      items: items.slice(offset, offset + limit),
      total: items.length,
    });
  };
}
