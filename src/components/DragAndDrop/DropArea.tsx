import { Record } from '@anupheaus/common';
import { ReactNode, useRef, useState } from 'react';
import { useBinder } from '../../hooks';
import { createStyles, TransitionTheme } from '../../theme';
import { ComponentStylesConfig, createComponent } from '../Component';
import { Tag } from '../Tag';
import { DragAndDropData } from './DragAndDropData';
import { DraggedItem } from './DragAndDropModels';
import { DragAndDropTheme } from './DragAndDropTheme';
import { InteractionProvider, MouseLeaveEvent, MouseMoveEvent, useInteractionEvents } from './InteractionEvents';

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
const useStyles = createStyles(({ useTheme }) => {
  const { validOverlayColor, invalidOverlayColor } = useTheme(DragAndDropTheme);
  const transitionSettings = useTheme(TransitionTheme);
  return {
    styles: {
      dropArea: {
        display: 'flex',
        flex: 'auto',
        position: 'relative',
      },
      dropAreaOverlay: {
        display: 'flex',
        pointerEvents: 'none',
        position: 'absolute',
        transitionProperty: 'background-color, opacity',
        ...transitionSettings,
        inset: 0,
        opacity: 0,
      },
      draggedItemsAreValid: {
        backgroundColor: validOverlayColor,
        opacity: 1,
      },
      draggedItemsAreInvalid: {
        backgroundColor: invalidOverlayColor,
        opacity: 1,
      },
    },
  } satisfies ComponentStylesConfig;
});

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
