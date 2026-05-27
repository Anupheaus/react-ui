import type { AnyObject, DataFilterValueTypes, Record } from '@anupheaus/common';
import type { TableColumn } from './TableModels';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

function createSeededRandom(rowIndex: number, columnIndex: number): () => number {
  let seed = ((rowIndex + 1) * 997) + ((columnIndex + 1) * 7919);
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function placeholderValue(type: DataFilterValueTypes | undefined, rowIndex: number, columnIndex: number): unknown {
  const random = createSeededRandom(rowIndex, columnIndex);
  switch (type) {
    case 'number':
      return Math.floor(random() * 9000 + 1000);
    case 'currency':
      return Math.round((random() * 9000 + 100) * 100) / 100;
    case 'boolean':
      return random() > 0.5;
    case 'date': {
      const year = 2020 + Math.floor(random() * 6);
      const month = Math.floor(random() * 12) + 1;
      const day = Math.floor(random() * 28) + 1;
      return new Date(year, month - 1, day).toISOString();
    }
    default: {
      let value = '';
      const length = 8 + Math.floor(random() * 6);
      for (let index = 0; index < length; index++) {
        value += String.fromCharCode(97 + Math.floor(random() * 26));
      }
      return value;
    }
  }
}

/** Fake row data for initial-load placeholders; fields match column definitions. */
export function createPlaceholderRecord<RecordType extends Record>(
  columns: TableColumn<RecordType>[],
  rowIndex: number,
): RecordType {
  const record: AnyObject = { id: `table-placeholder-${rowIndex}` };
  columns.forEach((column, columnIndex) => {
    if (column.id === TABLE_ACTIONS_COLUMN_ID || column.field === '__actions') return;
    record[column.field] = placeholderValue(column.type, rowIndex, columnIndex);
  });
  return record as RecordType;
}
