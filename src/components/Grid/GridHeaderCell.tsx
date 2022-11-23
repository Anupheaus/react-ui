import { useContext, useLayoutEffect } from 'react';
import { useOnResize } from '../../hooks';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { GridContexts } from './GridContexts';
import { GridColumnType } from './GridModels';
import { GridTheme } from './GridTheme';

interface Props {
  column: GridColumnType;
  columnIndex: number;
  // onChange(column: GridColumnType): void;
}

export const GridHeaderCell = createComponent({
  id: 'GridHeaderCell',

  styles: ({ useTheme }) => {
    const { definition: { headers: { backgroundColor, fontSize, fontColor } } } = useTheme(GridTheme);
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
          color: fontColor,
          alignItems: 'center',
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
        {column.label}
      </Tag>
    );
  },
});