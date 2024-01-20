import { createLegacyStyles } from '../../theme/createStyles';
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
}

const useStyles = createLegacyStyles(({ useTheme }) => {
  const { headers: { backgroundColor, textColor: color, fontSize } } = useTheme(GridTheme);

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
});

export const GridHeaderCell = createComponent('GridHeaderCell', ({
  column,
  columnIndex,
}: Props) => {
  const { css } = useStyles();
  const { target, height } = useOnResize({ observeHeightOnly: true });
  const setHeaderHeight = useContext(GridContexts.setHeaderHeight);

  useLayoutEffect(() => {

    if (height != null && columnIndex === 0) setHeaderHeight(height);
  }, [height, columnIndex]);

  return (
    <Tag ref={target} name="grid-header-cell" className={css.gridHeaderCell}>
      <Skeleton type="text">{column.label}</Skeleton>
    </Tag>
  );
});
