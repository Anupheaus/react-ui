import { ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks/useBound';
import { ReactListItem } from '../../models';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import { OnScrollEventData, Scroller, ScrollerActions } from '../Scroller';
import { UseActions, useActions, useOnUnmount } from '../../hooks';
import { UseDataResponse } from '../../extensions';
import { UseItemsActions, useItems } from '../../hooks/useItems';
import { ListItem, ListItemProps } from './ListItem';
import { DataPagination, Record } from '@anupheaus/common';
import { createStyles } from '../../theme';

const useStyles = createStyles(({ list: { normal, active, readOnly }, pseudoClasses, text }, tools) => ({
  internalList: {
    backgroundColor: normal.backgroundColor,
    color: normal.textColor,
    fontSize: normal.textSize ?? text.size,

    [pseudoClasses.active]: {
      backgroundColor: active.backgroundColor ?? normal.backgroundColor,
      color: active.textColor ?? normal.textColor,
      fontSize: active.textSize ?? normal.textSize,
    },

    [pseudoClasses.readOnly]: {
      backgroundColor: readOnly.backgroundColor ?? normal.backgroundColor,
      color: readOnly.textColor ?? normal.textColor,
      fontSize: readOnly.textSize ?? normal.textSize,
    },
  },
  internalListContent: {
    gap: tools.gap(normal.gap, 4),
  },
}));

export interface InternalListActions extends UseItemsActions {
  scrollTo(value: number | 'bottom'): void;
}

export interface InternalListProps<T extends Record> {
  items?: T[];
  preventContentFromDeterminingHeight?: boolean;
  actions?: UseActions<InternalListActions>;
  onRequest?(pagination: DataPagination): UseDataResponse<T>;
}

interface Props<T extends ReactListItem> extends InternalListProps<T> {
  tagName: string;
  className?: string;
  contentClassName?: string;
  disableShadowsOnScroller?: boolean;
  delayRenderingItems?: boolean;
  renderItem?(props: ListItemProps<T>): ReactNode;
  onScroll?(values: OnScrollEventData): void;
  onItemsChange?(items: (T | Promise<T>)[]): void;
}

export const InternalList = createComponent('InternalList', <T extends ReactListItem>({
  tagName,
  className,
  contentClassName,
  disableShadowsOnScroller = false,
  items: providedItems,
  delayRenderingItems = false,
  preventContentFromDeterminingHeight,
  renderItem,
  actions,
  onScroll,
  onRequest,
  onItemsChange,
}: Props<T>) => {
  const { css, tools, theme, join } = useStyles();
  const heightRef = useRef<number>(18);
  const containerRef = useRef<HTMLDivElement | null>();
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { setActions: useItemsActions, refresh } = useActions<UseItemsActions>();
  const { setActions: scrollerActions, scrollTo } = useActions<ScrollerActions>();
  const { items, total, request: makeRequest, offset, limit } = useItems({ initialLimit: 50, onRequest, actions: useItemsActions, items: providedItems });
  const [allowedToRenderItems, setAllowedToRenderItems] = useState(!delayRenderingItems);

  actions?.({
    refresh,
    scrollTo,
  });

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
      {(allowedToRenderItems ? items : [])
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
  }, [allowedToRenderItems, items, total, offset, limit]);

  const handleOnScroll = useBound((values: OnScrollEventData) => {
    containerRef.current = values.element;
    if (lastScrollTopRef.current !== values.top) {
      lastScrollTopRef.current = values.top;
      requestItems();
    }
    onScroll?.(values);
  });

  useLayoutEffect(() => {
    onItemsChange?.(items);
  }, [items]);

  useEffect(() => {
    if (allowedToRenderItems) return;
    setTimeout(() => {
      if (hasUnmounted()) return;
      setAllowedToRenderItems(true);
    }, 100);
  }, []);

  return (
    <Flex tagName={tagName} className={join(css.internalList, className)} isVertical maxWidth>
      <Scroller
        onScroll={handleOnScroll}
        actions={scrollerActions}
        disableShadows={disableShadowsOnScroller}
        containerClassName={join(css.internalListContent, contentClassName)}
        preventContentFromDeterminingHeight={preventContentFromDeterminingHeight}
      >
        {content}
      </Scroller>
    </Flex>
  );
});
