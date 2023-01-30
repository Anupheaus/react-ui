import { ReactNode, useMemo } from 'react';
import { ListItem } from '../../../../../models';
import { createComponent } from '../../../../Component';
import { Records } from '@anupheaus/common';
import { GridActionsContext, GridActionsContextProps } from './GridActionsContext';

interface Props {
  children: ReactNode;
}

export const GridActionsProvider = createComponent('GridActionsProvider', ({
  children,
}: Props) => {

  const context = useMemo<GridActionsContextProps>(() => ({
    actions: new Records<ListItem>(),
  }), []);

  return (
    <GridActionsContext.Provider value={context}>
      {children}
    </GridActionsContext.Provider>
  );
});
