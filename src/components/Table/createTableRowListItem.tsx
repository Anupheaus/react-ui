import type { Record } from '@anupheaus/common';
import type { ReactNode } from 'react';
import type { ListItemEvent, ReactListItem } from '../../models';
import { TableRow } from './TableRow';

// A single stable renderer shared by every table row. It takes the row's position from the list event and
// its columns from context (see TableRow), so it captures nothing and never changes identity — letting an
// unchanged row skip re-rendering instead of re-rendering on every data request, while a column change still
// reaches the row through TableColumnsContext.
const renderTableRow = (event: ListItemEvent<Record>): ReactNode => (
  <TableRow record={event.data} index={event.ordinal ?? 0} />
);

export function createTableRowListItem<RecordType extends Record>(record: RecordType): ReactListItem<RecordType> {
  return {
    id: record.id,
    text: record.id,
    data: record,
    renderItem: renderTableRow,
  };
}
