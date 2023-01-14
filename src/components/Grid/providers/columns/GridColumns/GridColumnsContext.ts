import { Records } from '@anupheaus/common';
import { createContext } from 'react';
import { GridColumn } from '../../../GridModels';

export interface GridColumnsContextProps {
  columns: Records<GridColumn>;
}

export const GridColumnsContext = createContext<GridColumnsContextProps>({
  columns: undefined as unknown as Records<GridColumn>,
});
