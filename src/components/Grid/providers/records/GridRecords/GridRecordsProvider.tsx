import { ReactNode, useMemo } from 'react';
import { Record, Records } from '@anupheaus/common';
import { createComponent } from '../../../..';
import { GridRecordsContext, GridRecordsContextProps } from './GridRecordsContext';

interface Props {
  children: ReactNode;
}

export const GridRecordsProvider = createComponent({
  id: 'GridRecordsProvider',

  render({
    children,
  }: Props) {
    const context = useMemo<GridRecordsContextProps>(() => ({
      records: new Records<Record>(),
    }), []);

    return (
      <GridRecordsContext.Provider value={context}>
        {children}
      </GridRecordsContext.Provider>
    );
  },

});
