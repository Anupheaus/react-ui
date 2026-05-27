import { useEffect } from 'react';
import { useBound, useDOMRef, useDrag, useOnResize } from '../../hooks';
import type { UseDragEvent } from '../../hooks';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import type { TableColumn } from './TableModels';
import { createStyles } from '../../theme';
import { useGetTableColumnWidth, useIsManualTableColumnWidth, useSetTableColumnWidth } from './TableColumnWidths';
import { useTableActionsColumnWidth } from './TableActionsColumnWidthContext';
import { MIN_TABLE_COLUMN_WIDTH, TableHeaderCellResizeHandle } from './TableHeaderCellResizeHandle';
import { TABLE_ACTIONS_COLUMN_ID } from './tableConstants';
import { useTableActionsColumnShadowStyles } from './tableActionsColumnStyles';
import { Flex } from '../Flex';
import { useUIState } from '../../providers';

const useStyles = createStyles(() => ({
  tableHeaderCell: {
    display: 'inline-block',
    flexShrink: 0,
    flexGrow: 0,
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
  tableActionsHeaderCell: {
    display: 'inline-flex',
    flexShrink: 0,
    flexGrow: 0,
    zIndex: 2,
    overflow: 'unset',
    padding: 0,
    textAlign: 'left',
    alignItems: 'center',
    alignSelf: 'stretch',
    position: 'relative',
  },
}));

interface Props {
  column: TableColumn;
  columnIndex: number;
  onColumnWidthPersist?(width: number): void;
}

export const TableHeaderCell = createComponent('TableHeaderCell', ({
  column,
  columnIndex,
  onColumnWidthPersist,
}: Props) => {
  const { css, join, useInlineStyle } = useStyles();
  const { css: shadowCss } = useTableActionsColumnShadowStyles();
  const { isLoading } = useUIState();
  const { target: resizeTarget, width: actualWidth } = useOnResize({ observeWidthOnly: true });
  const columnWidth = useGetTableColumnWidth(columnIndex);
  const actionsColumnWidth = useTableActionsColumnWidth();
  const setColumnWidth = useSetTableColumnWidth(columnIndex);
  const isManualWidth = useIsManualTableColumnWidth(columnIndex);
  const isTableActionsColumn = column.id === TABLE_ACTIONS_COLUMN_ID;
  const isResizable = column.isResizable === true && !isTableActionsColumn;
  const width = isTableActionsColumn ? actionsColumnWidth : columnWidth ?? column.width;

  const style = useInlineStyle(() => ({
    width,
    maxWidth: width,
    minWidth: width,
    padding: isTableActionsColumn ? 0 : undefined,
    textAlign: isTableActionsColumn ? 'left' : column.alignment,
    justifyContent: isTableActionsColumn
      ? 'flex-start'
      : column.alignment === 'right'
        ? 'flex-end'
        : column.alignment === 'center'
          ? 'center'
          : 'flex-start',
  }), [width, column.alignment, isTableActionsColumn]);

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
    <Tag ref={cellRef} name="table-header-cell" className={join(css.tableHeaderCell, isTableActionsColumn && css.tableActionsHeaderCell)} style={style}>
      {!isTableActionsColumn && (isLoading
        ? <Skeleton type="text" useRandomWidth />
        : column.label)}
      {isTableActionsColumn && <Flex tagName="table-header-actions-shadow" className={shadowCss.tableActionsShadow} />}
      {resizeHandle}
    </Tag>
  );
});
