import { Records } from '@anupheaus/common';
import { createContext } from 'react';
import { ReactListItem } from '../../../../../models';

export interface GridActionsContextProps {
  actions: Records<ReactListItem>;
}

export const GridActionsContext = createContext<GridActionsContextProps>({
  actions: new Records(),
});
