import { Record } from '@anupheaus/common';
import { ReactNode } from 'react';
import { TransitionTheme } from '../../../theme';
import { createComponent } from '../../Component';
import { Draggable } from '../../DragAndDrop/Draggable';
import { DraggableListItemTheme } from './DraggableListItemTheme';

interface Props {
  data: Record;
  children: ReactNode;
}

export const DraggableListItem = createComponent({
  id: 'DraggableListItem',

  styles: ({ useTheme }) => {
    const { borderColor, backgroundColor, borderRadius, padding } = useTheme(DraggableListItemTheme);
    const transitionSettings = useTheme(TransitionTheme);

    return {
      styles: {
        draggableListItem: {
          display: 'flex',
          flex: 'auto',
          backgroundColor,
          boxShadow: `0 0 0 1px ${borderColor}`,
          borderRadius,
          padding,
          cursor: 'grab',
          userSelect: 'none',
          opacity: 1,
          maxHeight: 'fit-content',
          marginBottom: 0,
          transitionProperty: 'max-height,margin-bottom',
          ...transitionSettings,
        },
        onDragging: {
          transitionProperty: 'max-height,margin-bottom,padding',
          maxHeight: 0,
          padding: 0,
          opacity: 0,
          marginBottom: -8,
        },
        clonedDraggableListItem: {
          boxShadow: `0 0 0 1px ${borderColor}, 0 0 4px 2px ${borderColor}`,
        },
      },
    };
  },

  render({
    data,
    children,
  }: Props, { css }) {
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
  },
});
