import { ReactNode, useMemo } from 'react';
import { Records } from '@anupheaus/common';
import { createComponent } from '../../../..';
import { GridColumnsContext, GridColumnsContextProps } from './GridColumnsContext';
import { GridColumn } from '../../../GridModels';

interface Props {
  children: ReactNode;
}

export const GridColumnsProvider = createComponent({
  id: 'GridColumnsProvider',

  render({
    children,
  }: Props) {

    const context = useMemo<GridColumnsContextProps>(() => ({
      columns: new Records<GridColumn>(),
    }), []);

    return (
      <GridColumnsContext.Provider value={context}>
        {children}
      </GridColumnsContext.Provider>
    );
  },

});
