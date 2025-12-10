import { createContext } from 'react';
import type { ListItemType } from '../../models';

export interface ListItemContextProps<T extends ListItemType> {
  item: T | Promise<T>;
  index: number;
  total: number;
  onDelete?(item: T): void;
}

export const ListItemContext = createContext<ListItemContextProps<any>>({
  item: undefined,
  index: -1,
  total: 0,
  onDelete: () => void 0,
});
