import { useContext, useLayoutEffect } from 'react';
import { useOnResize } from '../../hooks';
import { createComponent } from '../Component';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { GridContexts } from './GridContexts';
import { GridColumn } from './GridModels';
import { GridTheme } from './GridTheme';

interface Props {
  column: GridColumn;
  columnIndex: number;
  // onChange(column: GridColumnType): void;
}

export const GridHeaderCell = createComponent({
  id: 'GridHeaderCell',

  styles: ({ useTheme }) => {
    const { headers: { backgroundColor, fontColor: color, fontSize } } = useTheme(GridTheme);

    return {
      styles: {
        gridHeaderCell: {
          display: 'flex',
          backgroundColor,
          padding: '4px 8px',
          position: 'sticky',
          top: 0,
          minHeight: 32,
          boxSizing: 'border-box',
          fontSize,
          userSelect: 'none',
          cursor: 'default',
          color,
          alignItems: 'center',
          zIndex: 1,
        },
      },
    };
  },

  render({
    column,
    columnIndex,
  }: Props, { css }) {
    const { target, height } = useOnResize({ observeHeightOnly: true });
    const setHeaderHeight = useContext(GridContexts.setHeaderHeight);

    useLayoutEffect(() => {

      if (height != null && columnIndex === 0) setHeaderHeight(height);
    }, [height, columnIndex]);

    return (
      <Tag ref={target} name="grid-header-cell" className={css.gridHeaderCell}>
        <Skeleton variant="text">{column.label}</Skeleton>
      </Tag>
    );
  },
});