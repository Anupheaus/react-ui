import type { DOMAttributes } from 'react';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';

export const MIN_TABLE_COLUMN_WIDTH = 40;

const useStyles = createStyles({
  resizeHandle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    cursor: 'ew-resize',
    zIndex: 2,
  },
});

interface Props {
  draggableProps: Partial<DOMAttributes<HTMLElement>>;
}

export const TableHeaderCellResizeHandle = createComponent('TableHeaderCellResizeHandle', ({
  draggableProps,
}: Props) => {
  const { css } = useStyles();

  return (
    <Tag
      name="table-header-cell-resize-handle"
      className={css.resizeHandle}
      {...draggableProps}
    />
  );
});
