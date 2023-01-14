import { Fragment, ReactNode, useMemo, useState } from 'react';
import { useBound } from '../../hooks';
import { ListItem } from '../../models';
import { ComponentRenderStyles, ComponentStylesConfig, ComponentStylesUtils, createComponent } from '../Component';
import { DraggedItem, DropArea, MouseMoveEvent } from '../DragAndDrop';
import { Label } from '../Label';
import { Scroller } from '../Scroller';
import { Skeleton } from '../Skeleton';
import { Tag } from '../Tag';
import { ListTheme } from './ListTheme';

interface Props<T extends ListItem = ListItem> {
  borderless?: boolean;
  gap?: number;
  items: T[];
  label?: ReactNode;
  help?: ReactNode;
  disableOverlay?: boolean;
  onChange?(items: T[]): void;
}

function styles({ useTheme }: ComponentStylesUtils, { borderless = false, gap = 0 }: Props) {
  const { borderColor, borderRadius, padding, backgroundColor } = useTheme(ListTheme);
  return {
    styles: {
      list: {
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        position: 'relative',
        gap: 8,
        overflow: 'hidden',
      },
      listContainer: {
        display: 'flex',
        flex: 'auto',
        position: 'relative',
        borderRadius: borderless ? 0 : borderRadius,
        borderColor,
        borderWidth: 1,
        boxShadow: borderless ? 'none' : `inset 0 0 0 1px ${borderColor}`,
        overflow: 'hidden',
        backgroundColor,
      },
      skeleton: {
        borderRadius,
        overflow: 'hidden',
      },
      scroller: {
        display: 'flex',
        zIndex: 1,
      },
      listItems: {
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
        gap,
        padding,
      },
      dropAreaOverlay: {
        zIndex: 0,
      },
      dropPlaceholder: {
        display: 'flex',
        flex: 'none',
        height: 0,
        boxShadow: '0 0 2px 1px rgba(0 0 0 / 20%)',
      },
    },
  } satisfies ComponentStylesConfig;
}

export const List = createComponent({
  id: 'List',

  styles,

  render<T extends ListItem = ListItem>({
    items,
    label,
    help,
    disableOverlay = false,
    onChange,
  }: Props<T>, { css }: ComponentRenderStyles<ReturnType<typeof styles>>) {
    const [dropPlaceholderIndex, setDropPlaceholderIndex] = useState(-1);

    const dropPlaceholder = (<Tag name="list-items-drop-placeholder" className={css.dropPlaceholder} />);

    const renderedItems = useMemo(() => items.map((item, index) => (
      <Fragment key={item.id}>
        {dropPlaceholderIndex === index ? dropPlaceholder : null}
        <>{item.label ?? item.text}</>
        {dropPlaceholderIndex === items.length && index === items.length - 1 ? dropPlaceholder : null}
      </Fragment>
    )), [items, dropPlaceholderIndex]);

    const handleDroppedItems = useBound((droppedItems: DraggedItem[]) => {
      const droppedItemIds = droppedItems.ids();
      const movedItems = items.filter(({ id }) => droppedItemIds.includes(id));
      const idAtIndex = items[dropPlaceholderIndex]?.id;
      const newItems = items.except(movedItems);
      let newIndexOfId = newItems.findIndex(({ id }) => id === idAtIndex);
      if (newIndexOfId === -1) newIndexOfId = dropPlaceholderIndex;
      newItems.splice(newIndexOfId, 0, ...movedItems);
      setDropPlaceholderIndex(-1);
      onChange?.(newItems);
    });

    const handleValidateDraggedItems = useBound((draggedItems: DraggedItem<T>[]) => {
      const itemIds = items.ids();
      const draggedIds = draggedItems.ids();
      return draggedIds.every(draggedId => itemIds.includes(draggedId));
    });

    const handleDraggedOverItem = useBound((item: DraggedItem<T>, draggedItems: DraggedItem<T>[], event: MouseMoveEvent) => {
      const indexOfItem = items.findIndex(({ id }) => id === item.id);
      setDropPlaceholderIndex(indexOfItem + (event.elementPctY > 50 && indexOfItem !== -1 ? 1 : 0));
    });

    const handleDraggedOut = useBound(() => {
      setDropPlaceholderIndex(-1);
    });

    return (
      <Tag name="list" className={css.list}>
        <Label help={help}>{label}</Label>
        <Skeleton variant={'full'} className={css.skeleton}>
          <Tag name="list-container" className={css.listContainer}>
            <DropArea
              overlayClassName={css.dropAreaOverlay}
              disableOverlay={disableOverlay}
              onDroppedItems={handleDroppedItems}
              onValidateDraggedItems={handleValidateDraggedItems}
              onDraggingOverItem={handleDraggedOverItem}
              onDraggedOut={handleDraggedOut}
            >
              <Scroller className={css.scroller}>
                <Tag name="list-items" className={css.listItems}>
                  {renderedItems}
                </Tag>
              </Scroller>
            </DropArea>
          </Tag>
        </Skeleton>
      </Tag>
    );
  },
});
