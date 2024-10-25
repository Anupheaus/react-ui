import type { Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { createComponent } from '../Component';
import { UIState } from '../../providers';
import { useTableRow } from './useTableRow';
import { TableRow } from './TableRow';
import type { TableUseRecordHook } from './TableModels';

interface Props<RecordType extends Record> {
  useRecordHook?: TableUseRecordHook<RecordType>;
}

export const TableRowRenderer = createComponent('TableRowRenderer', <RecordType extends Record>({
  useRecordHook,
}: Props<RecordType>) => {
  const { record, index, isLoading: isLoadingData, columns } = useTableRow<RecordType | string>();
  const { record: loadedRecord, isLoading: isLoadingRecord } = useRecordHook?.(is.string(record) ? record : undefined) ?? {};
  const isLoading = isLoadingData || isLoadingRecord;

  return (
    <UIState isLoading={isLoading}>
      <TableRow<RecordType> record={loadedRecord ?? (is.plainObject(record) ? record : undefined)} index={index} columns={columns} />
    </UIState>
  );
});