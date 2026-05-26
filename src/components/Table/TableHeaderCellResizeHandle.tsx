import type { DOMAttributes } from 'react';
import Color from 'color';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { createStyles } from '../../theme';
import { useTableHover } from './TableHoverContext';

export const MIN_TABLE_COLUMN_WIDTH = 40;

const useStyles = createStyles(({ text: { color: textColor } }, { applyTransition }) => ({
  resizeHandle: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 8,
    cursor: 'ew-resize',
    zIndex: 2,

    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      width: 1,
      height: '45%',
      minHeight: 14,
      maxHeight: 22,
      transform: 'translateY(-50%)',
      backgroundColor: Color(textColor).alpha(0.3).string(),
      pointerEvents: 'none',
      opacity: 0,
      ...applyTransition('opacity'),
    },

    '&::before': {
      right: 4,
    },

    '&::after': {
      right: 2,
    },

    '&.is-visible::before, &.is-visible::after': {
      opacity: 1,
    },
  },
}));

interface Props {
  draggableProps: Partial<DOMAttributes<HTMLElement>>;
}

export const TableHeaderCellResizeHandle = createComponent('TableHeaderCellResizeHandle', ({
  draggableProps,
}: Props) => {
  const { css, join } = useStyles();
  const isTableHovered = useTableHover();

  return (
    <Tag
      name="table-header-cell-resize-handle"
      className={join(css.resizeHandle, isTableHovered && 'is-visible')}
      {...draggableProps}
    />
  );
});
