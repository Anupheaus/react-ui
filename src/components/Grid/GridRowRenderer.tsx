import { Record, is } from '@anupheaus/common';
import { createComponent } from '../Component';
import { UIState } from '../../providers';
import { useGridRow } from './useGridRow';
import { GridRow } from './GridRow';
import { GridUseRecordHook } from './GridModels';

interface Props<RecordType extends Record> {
  useRecordHook?: GridUseRecordHook<RecordType>;
}

export const GridRowRenderer = createComponent('GridRowRenderer', <RecordType extends Record>({
  useRecordHook,
}: Props<RecordType>) => {
  const { record, index, isLoading: isLoadingData, columns } = useGridRow<RecordType | string>();
  const { record: loadedRecord, isLoading: isLoadingRecord } = useRecordHook?.(is.string(record) ? record : undefined) ?? {};
  const isLoading = isLoadingData || isLoadingRecord;

  return (
    <UIState isLoading={isLoading}>
      <GridRow<RecordType> record={loadedRecord ?? (is.plainObject(record) ? record : undefined)} index={index} columns={columns} />
    </UIState>
  );
});