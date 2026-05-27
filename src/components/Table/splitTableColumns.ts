import type { Record } from '@anupheaus/common';
import type { TableColumn } from './TableModels';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

export function splitTableColumns<RecordType extends Record>(columns: TableColumn<RecordType>[]) {
  const actionsColumnIndex = columns.findIndex(column => column.id === TABLE_ACTIONS_COLUMN_ID);

  return {
    dataColumns: columns.filter(column => column.id !== TABLE_ACTIONS_COLUMN_ID),
    actionsColumn: actionsColumnIndex === -1 ? undefined : columns[actionsColumnIndex],
    actionsColumnIndex,
  };
}
