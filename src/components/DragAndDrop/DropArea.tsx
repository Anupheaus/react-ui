import type { Record } from '@anupheaus/common';
import type { ReactNode} from 'react';
import { useRef, useState } from 'react';
import { useBinder } from '../../hooks';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Tag } from '../Tag';
import { DragAndDropData } from './DragAndDropData';
import type { DraggedItem } from './DragAndDropModels';
import type { MouseLeaveEvent, MouseMoveEvent} from './InteractionEvents';
import { InteractionProvider, useInteractionEvents } from './InteractionEvents';

interface Props<T extends Record = Record> {
  overlayClassName?: string;
  disableOverlay?: boolean;
  children: ReactNode;
  onDroppedItems?(items: DraggedItem<T>[]): void;
  onDraggingOverItem?(item: DraggedItem<T>, draggedItems: DraggedItem<T>[], event: MouseMoveEvent): void;
  onValidateDraggedItems?(items: DraggedItem[]): boolean;
  onDraggedOut?(draggedItems: DraggedItem<T>[], event: MouseLeaveEvent): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = createStyles(({ dragAndDrop }, { applyTransition }) => ({
  dropArea: {
    display: 'flex',
    flex: 'auto',
    position: 'relative',
  },
  dropAreaOverlay: {
    display: 'flex',
    pointerEvents: 'none',
    position: 'absolute',
    inset: 0,
    opacity: 0,
    ...applyTransition('background-color, opacity'),
  },
  draggedItemsAreValid: {
    backgroundColor: dragAndDrop.validOverlayColor,
    opacity: 1,
  },
  draggedItemsAreInvalid: {
    backgroundColor: dragAndDrop.invalidOverlayColor,
    opacity: 1,
  },
}));

export const DropArea = createComponent('DropArea', function <T extends Record>({
  overlayClassName,
  disableOverlay = false,
  children,
  onDroppedItems,
  onValidateDraggedItems,
  onDraggingOverItem,
  onDraggedOut,
}: Props<T>) {
  const { css, join } = useStyles();
  const [draggedItemsAreValid, setDraggedItemsAreValid] = useState<boolean>();
  const lastItemIdsRef = useRef<string[]>();
  const bind = useBinder();

  const validateDraggedItems = () => {
    if (DragAndDropData.isEmpty) {
      setDraggedItemsAreValid(undefined);
    } else {
      if (onValidateDraggedItems != null) {
        const itemIds = DragAndDropData.ids();
        if (Reflect.areDeepEqual(itemIds, lastItemIdsRef.current)) return;
        lastItemIdsRef.current = itemIds;
        setDraggedItemsAreValid(onValidateDraggedItems(DragAndDropData.toArray()) ?? true);
      } else {
        setDraggedItemsAreValid(true);
      }
    }
  };

  const target = useInteractionEvents({
    onMouseMove: bind(() => {
      validateDraggedItems();
    }),
    onMouseLeave: bind(event => {
      lastItemIdsRef.current = undefined;
      setDraggedItemsAreValid(undefined);
      onDraggedOut?.(DragAndDropData.toArray() as T[], event);
    }),
    onMouseUp: bind(() => {
      if (draggedItemsAreValid) onDroppedItems?.(DragAndDropData.toArray() as DraggedItem<T>[]);
      lastItemIdsRef.current = undefined;
      setDraggedItemsAreValid(undefined);
    }),
  });

  const handleMouseMoveInteraction = bind((event: MouseMoveEvent<DraggedItem<T>>) => {
    if (draggedItemsAreValid !== true || event.data == null) return;
    onDraggingOverItem?.(event.data, DragAndDropData.toArray() as T[], event);
  });

  return (
    <InteractionProvider onMouseMove={handleMouseMoveInteraction}>
      <Tag name="drop-area" ref={target} className={css.dropArea}>
        {children}
        {!disableOverlay && (
          <Tag
            name="drop-area-overlay"
            className={join(
              css.dropAreaOverlay,
              draggedItemsAreValid === true && css.draggedItemsAreValid,
              draggedItemsAreValid === false && css.draggedItemsAreInvalid,
              overlayClassName,
            )}
          />
        )}
      </Tag>
    </InteractionProvider>
  );
});
