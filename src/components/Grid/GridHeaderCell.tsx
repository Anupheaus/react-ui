import { useEffect } from 'react';
import { useOnResize } from '../../hooks';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { GridColumn } from './GridModels';
import { createStyles } from '../../theme';
import { useGetGridColumnWidth, useSetGridColumnWidth } from './GridColumnWidths';

interface Props {
  column: GridColumn;
  columnIndex: number;
}

const useStyles = createStyles({
  gridHeaderCell: {
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

export const GridHeaderCell = createComponent('GridHeaderCell', ({
  column,
  columnIndex,
}: Props) => {
  const { css, useInlineStyle } = useStyles();
  const { target, width: actualWidth } = useOnResize({ observeWidthOnly: true });
  const columnWidth = useGetGridColumnWidth(columnIndex);
  const setColumnWidth = useSetGridColumnWidth(columnIndex);
  const isGridActionsColumn = column.id === 'grid-actions';
  const width = isGridActionsColumn ? columnWidth : column.width;

  const style = useInlineStyle(() => ({
    width,
    maxWidth: width,
    minWidth: width,
    textAlign: column.alignment,
    justifyContent: column.alignment === 'right' ? 'flex-end' : column.alignment === 'center' ? 'center' : 'flex-start',
  }), [width, column.alignment]);

  useEffect(() => {
    if (actualWidth == null || isGridActionsColumn) return;
    setColumnWidth(actualWidth);
  }, [actualWidth, width, isGridActionsColumn]);

  return (
    <Tag ref={target} name="grid-header-cell" className={css.gridHeaderCell} style={style}>
      <Skeleton type="text">{column.label}</Skeleton>
    </Tag>
  );
});
