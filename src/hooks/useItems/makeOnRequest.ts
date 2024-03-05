import { DataPagination, Record } from '@anupheaus/common';
import { useOnChange } from '../useOnChange';

export function makeOnRequest<T extends Record>(providedItems: T[] | undefined, refresh: () => void) {
  const items = providedItems ?? Array.empty();

  useOnChange(refresh, [providedItems]);

  return ({ offset = 0, limit }: DataPagination) => {
    if (limit > items.length) limit = items.length;
    if ((offset + limit) > items.length) offset = items.length - limit;
    if (offset < 0) offset = 0;

    return {
      items: items.slice(offset, offset + limit),
      offset,
      limit,
      total: items.length,
    };
  };
}
