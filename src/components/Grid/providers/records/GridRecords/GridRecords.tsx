import { is, Record } from '@anupheaus/common';
import { useLayoutEffect, useMemo } from 'react';
import { useRecordsProvider } from '../../../../../providers';
import { createComponent } from '../../../../Component';
import { GridRefreshAction } from './GridRefreshAction';
import { useGridRecords } from './useGridRecords';

interface Props {
  recordsProviderId?: string;
  records?: Record[];
  onRefresh?(): void;
}

export const GridRecords = createComponent({
  id: 'GridRecords',

  render({
    records: propsRecords,
    recordsProviderId,
    onRefresh,
  }: Props) {
    const { upsert, remove } = useGridRecords();
    const { records: providedRecords } = is.string(recordsProviderId) ? useRecordsProvider(recordsProviderId) : useMemo(() => ({ records: new Map<string, Record>() }), []);
    const records = useMemo(() => is.array(propsRecords) ? propsRecords : providedRecords.toValuesArray(), [propsRecords, providedRecords.size]);

    useLayoutEffect(() => {
      upsert(records);
      return () => remove(records);
    }, [records]);

    return (<>
      {onRefresh && <GridRefreshAction onRefresh={onRefresh} />}
    </>);
  },

});
