import { Record, Records } from '@anupheaus/common';
import { createContext } from 'react';

export interface GridRecordsContextProps {
  records: Records<Record>;
}

export const GridRecordsContext = createContext<GridRecordsContextProps>({
  records: undefined as unknown as Records<Record>,
});
