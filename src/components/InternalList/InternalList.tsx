import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks/useBound';
import type { ListItemType } from '../../models';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import type { OnScrollEventData, ScrollerActions } from '../Scroller';
import { Scroller } from '../Scroller';
import type { UseActions } from '../../hooks';
import { useActions, useBatchUpdates, useOnChange, useOnUnmount } from '../../hooks';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { UseItemsActions } from '../../hooks/useItems';
import { useItems } from '../../hooks/useItems';
import { createStyles } from '../../theme';
import { ListItemContext } from './Context';
import { is } from '@anupheaus/common';

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
  createNewItem?: ReactNode;
  gap?: FlexProps['gap'];
  minWidth?: FlexProps['minWidth'];
  actions?: UseActions<InternalListActions>;
  onRequest?(request: UseDataRequest, response: (data: UseDataResponse<T>) => void): Promise<void>;
  onError?(error: Error): void;
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
  createNewItem,
  contentClassName,
  disableShadowsOnScroller = false,
  items: providedItems,
  delayRenderingItems = false,
  preventContentFromDeterminingHeight,
  minWidth,
  children,
  actions,
  onScroll,
  onRequest,
  onError,
}: Props<T>) => {
  const { css, join } = useStyles();
  const heightRef = useRef<number>();
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { setActions: useItemsActions, refresh } = useActions<UseItemsActions>();
  const { setActions: scrollerActions, scrollTo } = useActions<ScrollerActions>();
  const { items, total, request, offset, limit, error } = useItems({ initialLimit: 50, onRequest, actions: useItemsActions, items: providedItems });
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
    let visibleCount = itemHeight <= 0 ? 10 : Math.ceil(listHeight / 18) + 2;
    if (visibleCount < 0) visibleCount = 0;
    let requestOffset = itemHeight <= 0 ? 0 : (Math.ceil((scrollAmount / itemHeight) - 1) - visibleCount);
    if (requestOffset < 0) requestOffset = 0;
    let requestLimit = visibleCount * 2;
    if (requestOffset + requestLimit > innerTotal) {
      if (innerTotal < visibleCount) {
        requestOffset = 0;
        requestLimit = innerTotal;
      } else {
        requestLimit = innerTotal - requestOffset;
      }
    }
    if (requestOffset < 0) requestOffset = 0;
    request({ offset: requestOffset + 0, limit: requestLimit });
  };

  const [header, footer] = useMemo(() => {
    const itemHeight = heightRef.current ?? 0;
    const innerTotal = total ?? limit;
    if (innerTotal === 0 || itemHeight === 0) return [null, null];
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

  useOnChange(() => {
    if (error == null || !is.function(onError)) return;
    onError(error);
  }, [error]);

  return (
    <Flex tagName={tagName} className={join(css.internalList, className)} minWidth={minWidth} isVertical maxWidth gap={gap}>
      <Scroller
        onScroll={handleOnScroll}
        actions={scrollerActions}
        disableShadows={disableShadowsOnScroller}
        className={contentClassName}
        preventContentFromDeterminingHeight={preventContentFromDeterminingHeight}
      >
        {header}
        {content}
        {createNewItem}
        {footer}
      </Scroller>
    </Flex>
  );
});
