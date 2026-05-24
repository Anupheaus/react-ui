import { useEffect } from 'react';
import { useBound, useDOMRef, useDrag, useOnResize } from '../../hooks';
import type { UseDragEvent } from '../../hooks';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { TableColumn } from './TableModels';
import { createStyles } from '../../theme';
import { useGetTableColumnWidth, useIsManualTableColumnWidth, useSetTableColumnWidth } from './TableColumnWidths';
import { MIN_TABLE_COLUMN_WIDTH, TableHeaderCellResizeHandle } from './TableHeaderCellResizeHandle';

interface Props {
  column: TableColumn;
  columnIndex: number;
  onColumnWidthPersist?(width: number): void;
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
    position: 'relative',
  },
});

export const TableHeaderCell = createComponent('TableHeaderCell', ({
  column,
  columnIndex,
  onColumnWidthPersist,
}: Props) => {
  const { css, useInlineStyle } = useStyles();
  const { target: resizeTarget, width: actualWidth } = useOnResize({ observeWidthOnly: true });
  const columnWidth = useGetTableColumnWidth(columnIndex);
  const setColumnWidth = useSetTableColumnWidth(columnIndex);
  const isManualWidth = useIsManualTableColumnWidth(columnIndex);
  const isTableActionsColumn = column.id === 'table-actions';
  const isResizable = column.isResizable === true && !isTableActionsColumn;
  const width = isTableActionsColumn ? columnWidth : columnWidth ?? column.width;

  const style = useInlineStyle(() => ({
    width,
    maxWidth: width,
    minWidth: width,
    textAlign: column.alignment,
    justifyContent: column.alignment === 'right' ? 'flex-end' : column.alignment === 'center' ? 'center' : 'flex-start',
  }), [width, column.alignment]);

  useEffect(() => {
    if (actualWidth == null || isTableActionsColumn || isManualWidth) return;
    setColumnWidth(actualWidth);
  }, [actualWidth, isTableActionsColumn, isManualWidth]);

  const applyResizeWidth = useBound(({ originalWidth, diffX }: UseDragEvent) => {
    const newWidth = Math.max(MIN_TABLE_COLUMN_WIDTH, originalWidth + diffX);
    setColumnWidth(newWidth, { manual: true });
    return newWidth;
  });

  const onDragging = useBound((event: UseDragEvent) => {
    applyResizeWidth(event);
  });

  const onDragEnd = useBound((event: UseDragEvent) => {
    const newWidth = applyResizeWidth(event);
    onColumnWidthPersist?.(newWidth);
  });

  const { draggableProps, dragMovable } = useDrag({
    isEnabled: isResizable,
    onDragging,
    onDragEnd,
  });

  const cellRef = useDOMRef([resizeTarget, dragMovable]);

  const resizeHandle = isResizable ? (
    <TableHeaderCellResizeHandle draggableProps={draggableProps} />
  ) : null;

  return (
    <Tag ref={cellRef} name="table-header-cell" className={css.tableHeaderCell} style={style}>
      <Skeleton type="text">{column.label}</Skeleton>
      {resizeHandle}
    </Tag>
  );
});
