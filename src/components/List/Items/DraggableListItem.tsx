import { Record } from '@anupheaus/common';
import { ReactNode } from 'react';
import { createStyles } from '../../../theme';
import { createComponent } from '../../Component';
import { Draggable } from '../../DragAndDrop/Draggable';

interface Props {
  data: Record;
  children: ReactNode;
}

const useStyles = createStyles(({ list: { draggableItem: { normal } } }, { applyTransition }) => ({
  draggableListItem: {
    display: 'flex',
    flex: 'auto',
    backgroundColor: normal.backgroundColor,
    boxShadow: `0 0 0 1px ${normal.borderColor}`,
    borderRadius: normal.borderRadius,
    padding: normal.padding,
    cursor: 'grab',
    userSelect: 'none',
    opacity: 1,
    maxHeight: 'fit-content',
    marginBottom: 0,
    ...applyTransition('max-height,margin-bottom'),
  },
  onDragging: {
    transitionProperty: 'max-height,margin-bottom,padding',
    maxHeight: 0,
    padding: 0,
    opacity: 0,
    marginBottom: -8,
  },
  clonedDraggableListItem: {
    boxShadow: `0 0 0 1px ${normal.borderColor}, 0 0 4px 2px ${normal.borderColor}`,
  },
}));

export const DraggableListItem = createComponent('DraggableListItem', ({
  data,
  children,
}: Props) => {
  const { css } = useStyles();
  return (
    <Draggable
      data={data}
      tagName="draggable-list-item"
      className={css.draggableListItem}
      onDraggingClassName={css.onDragging}
      clonedClassName={css.clonedDraggableListItem}
    >
      {children}
    </Draggable>
  );
});
