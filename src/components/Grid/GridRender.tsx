import { is } from '@anupheaus/common';
import { useMemo } from 'react';
import { useRecordsProvider } from '../../providers';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridCell } from './GridCell';
import { GridHeaderCell } from './GridHeaderCell';
import { GridColumnType } from './GridModels';

interface Props<T = unknown> {
  columns: GridColumnType[];
  records?: T[];
}

export const GridRender = createComponent({
  id: 'GridRender',

  styles: (_, { columns }: Props) => {

    return {
      styles: {
        gridRender: {
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
        },
      },
    };
  },

  render: ({
    columns,
    records: propsRecords,
  }: Props, { css }) => {
    const { records: providedRecords } = useRecordsProvider('grid');
    const records = useMemo(() => is.array(propsRecords) ? propsRecords : providedRecords.toValuesArray(), [propsRecords, providedRecords.size]);

    const headerCells = useMemo(() => columns.map((column, index) => (<GridHeaderCell key={column.id} column={column} columnIndex={index} />)), [columns]);
    const rowCells = useMemo(() => records
      .map((record, rowIndex, recordsArray) => columns
        .map((column, columnIndex) => (
          <GridCell key={`${column.id}-${rowIndex}`} column={column} isLastRow={rowIndex === recordsArray.length - 1}>
            {column.renderValue?.({ ...column, rowIndex, columnIndex, record }) ?? null}
          </GridCell>
        ))).flatten(), [columns, records]);

    return (
      <Tag name="grid-render" className={css.gridRender}>
        {headerCells}
        {rowCells}
      </Tag>
    );
  },
});
