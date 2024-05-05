import { ComponentProps, ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks/useBound';
import { ListItemType } from '../../models';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import { OnScrollEventData, Scroller, ScrollerActions } from '../Scroller';
import { UseActions, useActions, useBatchUpdates, useOnUnmount } from '../../hooks';
import { UseDataRequest, UseDataResponse } from '../../extensions';
import { UseItemsActions, useItems } from '../../hooks/useItems';
import { createStyles } from '../../theme';
import { ListItemContext } from './Context';

const useStyles = createStyles(({ list: { normal, active, readOnly }, pseudoClasses, text }) => ({
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
}));

export interface InternalListActions extends UseItemsActions {
  scrollTo(value: number | 'bottom'): void;
}

export interface InternalListProps<T extends ListItemType> {
  items?: T[];
  gap?: ComponentProps<typeof Flex>['gap'];
  actions?: UseActions<InternalListActions>;
  onRequest?(request: UseDataRequest, response: (data: UseDataResponse<T>) => void): void;
}

interface Props<T extends ListItemType> extends InternalListProps<T> {
  tagName: string;
  className?: string;
  contentClassName?: string;
  disableShadowsOnScroller?: boolean;
  delayRenderingItems?: boolean;
  preventContentFromDeterminingHeight?: boolean;
  children: ReactNode;
  onScroll?(values: OnScrollEventData): void;
  onItemsChange?(items: (T | Promise<T>)[]): void;
}

export const InternalList = createComponent('InternalList', <T extends ListItemType>({
  tagName,
  className,
  gap = 4,
  contentClassName,
  disableShadowsOnScroller = false,
  items: providedItems,
  delayRenderingItems = false,
  preventContentFromDeterminingHeight,
  children,
  actions,
  onScroll,
  onRequest,
}: Props<T>) => {
  const { css, join } = useStyles();
  const heightRef = useRef<number>();
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { setActions: useItemsActions, refresh } = useActions<UseItemsActions>();
  const { setActions: scrollerActions, scrollTo } = useActions<ScrollerActions>();
  const { items, total, request, offset, limit } = useItems({ initialLimit: 50, onRequest, actions: useItemsActions, items: providedItems });
  const [allowedToRenderItems, setAllowedToRenderItems] = useState(!delayRenderingItems);
  const batchUpdates = useBatchUpdates();

  actions?.({
    refresh,
    scrollTo,
  });

  const requestItems = () => {
    if (hasUnmounted()) return;
    if (containerElement == null) return;
    const scrollAmount = containerElement.scrollTop;
    const listHeight = containerElement.getBoundingClientRect().height;
    const itemHeight = heightRef.current ?? 1;
    const innerTotal = total ?? 500;
    if (listHeight === 0) return;
    let visibleOffset = itemHeight <= 0 ? 0 : Math.ceil((scrollAmount / itemHeight) - 1);
    if (visibleOffset < 0) visibleOffset = 0;
    let visibleCount = itemHeight <= 0 ? 10 : Math.ceil(listHeight / 18) + 2;
    if (visibleCount < 0) visibleCount = 0;
    if (visibleOffset + visibleCount > innerTotal) {
      if (innerTotal < visibleCount) {
        visibleOffset = 0;
        visibleCount = innerTotal;
      } else {
        visibleOffset = innerTotal - visibleCount;
      }
    }
    request({ offset: visibleOffset + 0, limit: visibleCount });
  };

  const [header, footer] = useMemo(() => {
    const itemHeight = heightRef.current ?? 0;
    const innerTotal = total ?? limit;
    if (innerTotal == null || itemHeight == null) return [null, null];
    const headerStyle = { height: `${offset * itemHeight}px` };
    const footerStyle = { height: `${(innerTotal - offset - limit) * itemHeight}px` };
    return [
      <Flex key="header" tagName="lazy-load-header" style={headerStyle} disableGrow />,
      <Flex key="footer" tagName="lazy-load-footer" style={footerStyle} disableGrow />
    ];
  }, [heightRef.current, total, offset, limit]);

  const content = useMemo(() => {
    return (allowedToRenderItems ? items : [])
      .map((item, index) => {
        const itemIndex = offset + index;
        if (item == null) throw new Error(`Item at index ${itemIndex} is not a deferred promise or an item.`);
        return (
          <ListItemContext.Provider key={itemIndex.toString()} value={{ item, index: itemIndex }}>
            {children}
          </ListItemContext.Provider>
        );
      });
  }, [allowedToRenderItems, items, offset]);

  const handleOnScroll = useBound((values: OnScrollEventData) => batchUpdates(() => {
    if (containerElement == null) setContainerElement(values.element);
    if (lastScrollTopRef.current !== values.top) {
      lastScrollTopRef.current = values.top;
      requestItems();
    }
    onScroll?.(values);
  }));

  useLayoutEffect(() => {
    if (containerElement == null || total == null) return;
    const scrollHeight = containerElement.scrollHeight;
    const itemHeight = Math.ceil(scrollHeight / total);
    heightRef.current = Math.max(18, itemHeight);
  }, [containerElement?.scrollHeight, total]);

  useEffect(() => {
    if (allowedToRenderItems) return;
    setTimeout(() => {
      if (hasUnmounted()) return;
      setAllowedToRenderItems(true);
    }, 100);
  }, []);

  return (
    <Flex tagName={tagName} className={join(css.internalList, className)} isVertical maxWidth gap={gap}>
      <Scroller
        onScroll={handleOnScroll}
        actions={scrollerActions}
        disableShadows={disableShadowsOnScroller}
        containerClassName={contentClassName}
        preventContentFromDeterminingHeight={preventContentFromDeterminingHeight}
      >
        {header}
        {content}
        {footer}
      </Scroller>
    </Flex>
  );
});
