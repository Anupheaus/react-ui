import { useContext } from 'react';
import { ListItemType } from '../../models';
import { ListItemContext, ListItemContextProps } from './Context';
import { useAsync } from '../../hooks';

export function useListItem<T extends ListItemType>() {
  const { item: providedItem, index } = useContext(ListItemContext) as ListItemContextProps<T>;
  const { response: item, isLoading } = useAsync(() => providedItem, [providedItem]);
  return {
    item: item as T | undefined,
    index,
    isLoading,
  };
}
