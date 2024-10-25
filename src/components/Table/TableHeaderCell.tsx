import { useEffect } from 'react';
import { useOnResize } from '../../hooks';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { TableColumn } from './TableModels';
import { createStyles } from '../../theme';
import { useGetTableColumnWidth, useSetTableColumnWidth } from './TableColumnWidths';

interface Props {
  column: TableColumn;
  columnIndex: number;
}

const useStyles = createStyles({
  tableHeaderCell: {
    display: 'inline-block',
    flexShrink: 0,
    flexGrow: 1,
    padding: '4px 8px',
    boxSizing: 'border-box',
    userSelect: 'none',
    cursor: 'default',
    alignItems: 'center',
    zIndex: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
});

export const TableHeaderCell = createComponent('TableHeaderCell', ({
  column,
  columnIndex,
}: Props) => {
  const { css, useInlineStyle } = useStyles();
  const { target, width: actualWidth } = useOnResize({ observeWidthOnly: true });
  const columnWidth = useGetTableColumnWidth(columnIndex);
  const setColumnWidth = useSetTableColumnWidth(columnIndex);
  const isTableActionsColumn = column.id === 'table-actions';
  const width = isTableActionsColumn ? columnWidth : column.width;

  const style = useInlineStyle(() => ({
    width,
    maxWidth: width,
    minWidth: width,
    textAlign: column.alignment,
    justifyContent: column.alignment === 'right' ? 'flex-end' : column.alignment === 'center' ? 'center' : 'flex-start',
  }), [width, column.alignment]);

  useEffect(() => {
    if (actualWidth == null || isTableActionsColumn) return;
    setColumnWidth(actualWidth);
  }, [actualWidth, width, isTableActionsColumn]);

  return (
    <Tag ref={target} name="table-header-cell" className={css.tableHeaderCell} style={style}>
      <Skeleton type="text">{column.label}</Skeleton>
    </Tag>
  );
});
