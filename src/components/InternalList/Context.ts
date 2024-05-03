import { createContext } from 'react';
import { ListItemType } from '../../models';

export interface ListItemContextProps<T extends ListItemType> {
  item: T | Promise<T>;
  index: number;
}

export const ListItemContext = createContext<ListItemContextProps<any>>({
  item: undefined,
  index: -1,
});
