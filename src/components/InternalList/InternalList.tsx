import { ReactNode, useMemo, useRef } from 'react';
import { useBound } from '../../hooks/useBound';
import { ReactListItem } from '../../models';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import { OnScrollEventData, Scroller } from '../Scroller';
import { UseActions, useOnUnmount } from '../../hooks';
import { UseDataResponse } from '../../extensions';
import { UseItemsActions, useItems } from '../../hooks/useItems';
import { ListItem, ListItemProps } from './ListItem';
import { DataPagination, Record } from '@anupheaus/common';
import { createStyles } from '../../theme';

const useStyles = createStyles((theme, tools) => {
  const { list, pseudoClasses } = theme;
  return {
    internalList: {
      backgroundColor: list.normal.backgroundColor,
      color: list.normal.textColor,
      fontSize: list.normal.textSize,

      [pseudoClasses.active]: {
        backgroundColor: list.active.backgroundColor,
        color: list.active.textColor,
        fontSize: list.active.textSize,
      },

      [pseudoClasses.readOnly]: {
        backgroundColor: list.readOnly.backgroundColor,
        color: list.readOnly.textColor,
        fontSize: list.readOnly.textSize,
      },
    },
    internalListContent: {
      gap: tools.gap(theme.list.normal.gap, 4),
    },
  };
});

export interface InternalListProps<T extends Record> {
  items?: T[];
  actions?: UseActions<UseItemsActions>;
  onRequest?(pagination: DataPagination): UseDataResponse<T>;
}

interface Props<T extends ReactListItem> extends InternalListProps<T> {
  tagName: string;
  className?: string;
  contentClassName?: string;
  disableShadowsOnScroller?: boolean;
  renderItem?(props: ListItemProps<T>): ReactNode;
  onScroll?(values: OnScrollEventData): void;
}

export const InternalList = createComponent('InternalList', <T extends ReactListItem>({
  tagName,
  className,
  contentClassName,
  disableShadowsOnScroller = false,
  items: providedItems,
  renderItem,
  actions,
  onScroll,
  onRequest,
}: Props<T>) => {
  const { css, tools, theme, join } = useStyles();
  const heightRef = useRef<number>(18);
  const containerRef = useRef<HTMLDivElement | null>();
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { items, total, request: makeRequest, offset, limit } = useItems({ initialLimit: 50, onRequest, actions, items: providedItems });

  const saveListItemHeight = useBound((element: HTMLDivElement | null) => {
    if (element == null || heightRef.current != null) return;
    heightRef.current = element.clientHeight + tools.gap(theme.list.normal.gap, 4);
  });

  const requestItems = () => {
    if (hasUnmounted()) return;
    const container = containerRef.current;
    if (container == null) return;
    const scrollAmount = container.scrollTop;
    const itemHeight = heightRef.current;
    const listHeight = container.getBoundingClientRect().height;
    const innerTotal = total ?? 500;
    if (listHeight === 0) return;
    let visibleOffset = itemHeight <= 0 ? 0 : Math.ceil((scrollAmount / itemHeight) - 1);
    if (visibleOffset < 0) visibleOffset = 0;
    let visibleCount = itemHeight <= 0 ? 10 : Math.ceil(listHeight / itemHeight) + 2;
    if (visibleCount < 0) visibleCount = 0;
    if (visibleOffset + visibleCount > innerTotal) {
      if (innerTotal < visibleCount) {
        visibleOffset = 0;
        visibleCount = innerTotal;
      } else {
        visibleOffset = innerTotal - visibleCount;
      }
    }
    makeRequest({ offset: visibleOffset, limit: visibleCount });
  };

  const content = useMemo(() => {
    const itemHeight = heightRef.current;
    const innerTotal = total ?? limit;
    if (innerTotal == null || itemHeight == null) return null;
    const headerStyle = { height: `${offset * itemHeight}px` };
    const footerStyle = { height: `${(innerTotal - offset - limit) * itemHeight}px` };

    return (<>
      <Flex tagName="lazy-load-header" style={headerStyle} disableGrow />
      {items
        .map((item, index) => {
          const itemIndex = offset + index;
          if (item == null) throw new Error(`Item at index ${itemIndex} is not a deferred promise or an item.`);
          return (
            <ListItem
              ref={saveListItemHeight}
              index={itemIndex}
              key={`${itemIndex}`}
              item={item}
              renderItem={renderItem}
            />
          );
        })}
      <Flex tagName="lazy-load-footer" style={footerStyle} disableGrow />
    </>);
  }, [items, total, offset, limit]);

  const handleOnScroll = useBound((values: OnScrollEventData) => {
    containerRef.current = values.element;
    if (lastScrollTopRef.current !== values.top) {
      lastScrollTopRef.current = values.top;
      requestItems();
    }
    onScroll?.(values);
  });

  return (
    <Flex tagName={tagName} className={join(css.internalList, className)} isVertical maxWidth>
      <Scroller onScroll={handleOnScroll} disableShadows={disableShadowsOnScroller} containerClassName={join(css.internalListContent, contentClassName)}>
        {content}
      </Scroller>
    </Flex>
  );
});
