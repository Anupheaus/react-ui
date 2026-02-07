// import { useContext } from 'react';
// import type { ReactListItem } from '../../models';
// import type { ListItemContextProps } from './InternalListContext';
// import { ListItemContext } from './InternalListContext';
// import { useAsync } from '../../hooks';

// export function useListItem<T extends ReactListItem = ReactListItem>(overridingItem?: T) {
//   const { item: providedItem, index, total, onDelete } = useContext(ListItemContext) as ListItemContextProps<T>;
//   const { response: item, isLoading } = useAsync(() => overridingItem ?? providedItem, [providedItem, overridingItem]);
//   return {
//     item: item as T | undefined,
//     index,
//     total,
//     isLoading,
//     onDelete,
//   };
// }
