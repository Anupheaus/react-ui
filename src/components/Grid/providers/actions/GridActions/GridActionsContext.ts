import { Records } from '@anupheaus/common';
import { createContext } from 'react';
import { ListItem } from '../../../../../models';

export interface GridActionsContextProps {
  actions: Records<ListItem>;
}

export const GridActionsContext = createContext<GridActionsContextProps>({
  actions: new Records(),
});
