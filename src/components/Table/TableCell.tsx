import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import type { TableColumn } from './TableModels';
import { createStyles } from '../../theme';
import type { AnyObject, Record } from '@anupheaus/common';
import { TableCellValue } from './TableCellValue';
import { useGetTableColumnWidth } from './TableColumnWidths';
import { useTableActionsColumnWidth } from './TableActionsColumnWidthContext';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';

interface Props {
  column: TableColumn;
  columnIndex: number;
  rowIndex: number;
  record?: Record;
}
const useStyles = createStyles({
  tableCell: {
    display: 'inline-block', // needed for ellipsis to work
    borderWidth: 0,
    padding: '4px 8px',
    cursor: 'default',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    height: 'fit-content',
  },
});

export const TableCell = createComponent('TableCell', ({
  column,
  columnIndex,
  rowIndex,
  record,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const columnWidth = useGetTableColumnWidth(columnIndex);
  const actionsColumnWidth = useTableActionsColumnWidth();
  const isActionsColumn = column.id === TABLE_ACTIONS_COLUMN_ID;
  const width = isActionsColumn ? actionsColumnWidth : columnWidth ?? column.width;

  const content = useMemo(() => {
    if (column.renderValue) {
      return column.renderValue({
        ...column,
        rowIndex,
        columnIndex,
        record,
        CellValue: ((props: ComponentProps<typeof TableCellValue>) => (
          <TableCellValue {...column} record={record} rowIndex={rowIndex} columnIndex={columnIndex} {...props} />)
        ) as unknown as typeof TableCellValue,
      });
    } else {
      return (
        <TableCellValue
          {...column}
          record={record}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          value={record == null ? undefined : (record as AnyObject)[column.field]}
        />
      );
    }
  }, [column, columnIndex, rowIndex, record]);

  const style = useInlineStyle(() => ({
    width,
    maxWidth: width,
    minWidth: width,
    textAlign: isActionsColumn ? 'left' : column.alignment,
    justifyContent: isActionsColumn
      ? 'flex-start'
      : column.alignment === 'right'
        ? 'flex-end'
        : column.alignment === 'center'
          ? 'center'
          : 'flex-start',
  }), [width, column.alignment, isActionsColumn]);

  return (
    <Tag name="table-cell" className={join(css.tableCell, column.className)} style={style}>
      {content}
    </Tag>
  );
});
