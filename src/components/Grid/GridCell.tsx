import { ComponentProps, useMemo } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridColumn } from './GridModels';
import { createStyles } from '../../theme';
import { AnyObject, Record } from '@anupheaus/common';
import { GridCellValue } from './GridCellValue';
import { useGetGridColumnWidth } from './GridColumnWidths';

interface Props {
  column: GridColumn;
  columnIndex: number;
  rowIndex: number;
  record?: Record;
}
const useStyles = createStyles({
  gridCell: {
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

export const GridCell = createComponent('GridCell', ({
  column,
  columnIndex,
  rowIndex,
  record,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const width = useGetGridColumnWidth(columnIndex);

  const content = useMemo(() => {
    if (column.renderValue) {
      return column.renderValue({
        ...column,
        rowIndex,
        columnIndex,
        record,
        CellValue: ((props: ComponentProps<typeof GridCellValue>) => (
          <GridCellValue {...column} record={record} rowIndex={rowIndex} columnIndex={columnIndex} {...props} />)
        ) as unknown as typeof GridCellValue,
      });
    } else {
      return (
        <GridCellValue
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
    textAlign: column.alignment,
    justifyContent: column.alignment === 'right' ? 'flex-end' : column.alignment === 'center' ? 'center' : 'flex-start',
  }), [width, column.alignment]);

  return (
    <Tag name="grid-cell" className={join(css.gridCell, column.className)} style={style}>
      {content}
    </Tag>
  );
});
