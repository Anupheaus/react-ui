import type { Record } from '@anupheaus/common';
import type { ReactListItem } from '../../models';
import type { TableColumn } from './TableModels';
import { TableRow } from './TableRow';

interface CreateTableRowListItemOptions<RecordType extends Record> {
  record: RecordType;
  ordinal: number;
  columns: TableColumn<RecordType>[];
}

export function createTableRowListItem<RecordType extends Record>({
  record,
  ordinal,
  columns,
}: CreateTableRowListItemOptions<RecordType>): ReactListItem<RecordType> {
  return {
    id: record.id,
    text: record.id,
    data: record,
    renderItem: event => (
      <TableRow<RecordType>
        record={event.data as RecordType}
        index={event.ordinal ?? ordinal}
        columns={columns}
      />
    ),
  };
}
