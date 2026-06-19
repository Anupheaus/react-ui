import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks/useBound';
import type { ListItemClickEvent, ListItemEvent, ReactListItem } from '../../models';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import type { OnScrollEventData, ScrollerActions } from '../Scroller';
import { Scroller } from '../Scroller';
import type { UseActions } from '../../hooks';
import { useActions, useOnChange, useOnUnmount, useUpdatableState } from '../../hooks';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { UseItemsActions } from '../../hooks/useItems';
import type { CreateSkeletonItemContext } from '../../hooks/useItems';
import { useItems } from '../../hooks/useItems';
import { createStyles } from '../../theme';
import { InternalListContextProvider } from './InternalListContext';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { InternalListItem } from './InternalListItem';
import { StickyHideHeader } from '../StickyHideHeader';
import { measureVerticalScrollbarWidth } from '../Scroller/measureVerticalScrollbarWidth';

const VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK = 18;

function measureVirtualListItemHeight(scrollerContainer: HTMLDivElement): number | undefined {
  const scrollerContent = scrollerContainer.querySelector('scroller-content');
  if (scrollerContent == null) return undefined;
  const row = scrollerContent.querySelector('table-row, list-item, list-item-with-sub-items');
  if (row == null) return undefined;
  const height = Math.ceil(row.getBoundingClientRect().height);
  return height > 0 ? height : undefined;
}

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
  internalListScrollerContent: {
    minWidth: '100%', // Make sure the items in the list are at least as wide as the list
  },
  internalListStickyHeaderContent: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  internalListEmptyMessage: {
    minHeight: '100%',
  },
}));

export interface InternalListActions extends UseItemsActions {
  scrollTo(value: number | 'bottom'): void;
}

export interface InternalListProps<T = void> {
  items?: ReactListItem<T>[];
  gap?: FlexProps['gap'];
  minWidth?: FlexProps['minWidth'];
  minHeight?: FlexProps['minHeight'];
  maxSelectableItems?: number;
  fullHeight?: boolean;
  deleteTooltip?: ReactNode;
  onDelete?(event: ListItemEvent<T>): void;
  actions?: UseActions<InternalListActions>;
  onRequest?(request: UseDataRequest, response: (data: UseDataResponse<ReactListItem<T>>) => void): Promise<void>;
  onActive?(event: ListItemEvent<T>, isActive: boolean): void;
  onSelectedItemsChange?(ids: string[]): void;
  onError?(error: Error): void;
  onClick?(event: ListItemClickEvent<T>): PromiseMaybe<void>;
  /** Header that slides up with scroll. Renders above the scrollable content. Use useScroller() in children for scroll position. */
  stickyHeader?: ReactNode;
  /** Called when the measured vertical scrollbar width of the scroll container changes. */
  onVerticalScrollbarWidthChange?(width: number): void;
  /** Called when vertical scroll position changes (e.g. for virtualisation). */
  onScrollTopChange?(scrollTop: number): void;
  /** When true, Scroller consumes parent ScrollContext and reports scroll to it (e.g. Table with sticky headers). */
  useParentScrollContext?: boolean;
  /** When false, the body scroller omits left/right edge shadows (vertical shadows remain). */
  horizontalScrollShadows?: boolean;
  /** Custom skeleton item factory used while `showSkeletons` is active (e.g. table rows during initial load). */
  createSkeletonItem?(context: CreateSkeletonItemContext): ReactListItem<T>;
  /** Message rendered, centred, inside the scrollable area when the data source has confirmed there are no items. Pass `null` to suppress. */
  emptyMessage?: ReactNode;
}

interface Props<T = void> extends InternalListProps<T> {
  tagName: string;
  className?: string;
  contentClassName?: string;
  disableShadowsOnScroller?: boolean;
  horizontalScrollShadows?: boolean;
  delayRenderingItems?: boolean;
  selectedItemIds?: string[];
  showSkeletons?: boolean;
  createSkeletonItem?: InternalListProps<T>['createSkeletonItem'];
  deleteTooltip?: ReactNode;
  onScroll?(values: OnScrollEventData): void;
  onScrollHorizontal?(values: Pick<OnScrollEventData, 'left' | 'element'>): void;
  onItemsChange?(items: ReactListItem<T>[]): void;
  onMouseEnter?(event: MouseEvent): void;
}

export const InternalList = createComponent('InternalList', function <T = void>({
  tagName,
  className,
  gap = 4,
  contentClassName,
  disableShadowsOnScroller = false,
  horizontalScrollShadows = true,
  items: providedItems,
  delayRenderingItems = false,
  maxSelectableItems,
  selectedItemIds: providedSelectedItemIds,
  fullHeight,
  minWidth,
  minHeight,
  showSkeletons,
  createSkeletonItem,
  emptyMessage = 'No items to display',
  deleteTooltip,
  actions,
  onScroll,
  onScrollHorizontal,
  onRequest,
  onError,
  onDelete,
  onActive,
  onSelectedItemsChange,
  onItemsChange,
  onClick,
  stickyHeader,
  onVerticalScrollbarWidthChange,
  onScrollTopChange,
  useParentScrollContext = false,
}: Props<T>) {
  const { css, join } = useStyles();
  const [itemHeight, setItemHeight] = useState(VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK);
  const itemHeightLockedRef = useRef(false);
  const lastScrollLeftRef = useRef<number>(0);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { setActions: useItemsActions, refresh } = useActions<UseItemsActions>();
  const { setActions: scrollerActions, scrollTo, refreshShadowVisibility } = useActions<ScrollerActions>();
  const [selectedItemIds, updateSelectedItemIds] = useUpdatableState<string[]>(prevValues => (providedSelectedItemIds ?? prevValues ?? []).removeNull(), [providedSelectedItemIds]);
  const { items, total, request, offset, limit, error } = useItems({
    initialLimit: 50,
    onRequest,
    actions: useItemsActions,
    selectedItemIds,
    items: providedItems,
    useSkeletons: showSkeletons,
    createSkeletonItem,
    onItemsChange,
  });
  const [allowedToRenderItems, setAllowedToRenderItems] = useState(!delayRenderingItems);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>();

  actions?.({
    refresh,
    scrollTo,
  });

  const showEmptyMessage = total === 0 && error == null && emptyMessage != null;

  const requestItems = useBound(() => {
    if (hasUnmounted()) return;
    if (containerElement == null) return;
    if (!itemHeightLockedRef.current) return;
    const scrollAmount = containerElement.scrollTop;
    const listHeight = containerElement.getBoundingClientRect().height;
    const rowHeight = itemHeight;
    const innerTotal = total ?? 500;
    if (listHeight === 0 || rowHeight <= 0) return;
    let visibleCount = Math.ceil(listHeight / rowHeight) + 2;
    if (visibleCount < 0) visibleCount = 0;
    let requestOffset = Math.ceil((scrollAmount / rowHeight) - 1) - visibleCount;
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
  });

  const [header, footer] = useMemo(() => {
    const innerTotal = total ?? limit;
    if (innerTotal === 0 || itemHeight === 0) return [null, null];
    const headerStyle = { height: `${offset * itemHeight}px` };
    const footerStyle = { height: `${Math.max(0, innerTotal - offset - limit) * itemHeight}px` };
    return [
      <Flex key="header" tagName="lazy-load-header" style={headerStyle} disableGrow />,
      <Flex key="footer" tagName="lazy-load-footer" style={footerStyle} disableGrow />
    ];
  }, [itemHeight, total, offset, limit]);

  const renderedItems = useMemo(() => {
    return (allowedToRenderItems ? items : []).slice(offset, offset + limit)
      .map((item, index) => (
        <InternalListItem
          key={item.id}
          item={item}
          index={offset + index}
          isSelectable={(maxSelectableItems ?? 0) > 0}
          onClick={onClick}
          InternalListComponent={InternalList}
          maxSelectableItems={maxSelectableItems}
          selectedItemIds={providedSelectedItemIds}
          onSelectedItemsChange={onSelectedItemsChange}
        />
      ));
  }, [allowedToRenderItems, items, offset, limit, maxSelectableItems, onClick, providedSelectedItemIds, onSelectedItemsChange]);

  const handleOnScroll = useBound((values: OnScrollEventData) => {
    const isNewContainer = containerElement == null;
    if (isNewContainer) setContainerElement(values.element);
    if (isNewContainer || lastScrollTopRef.current !== values.top) {
      lastScrollTopRef.current = values.top;
      requestItems();
    }
    if (lastScrollLeftRef.current !== values.left) {
      lastScrollLeftRef.current = values.left;
      onScrollHorizontal?.({ left: values.left, element: values.element });
    }
    onScrollTopChange?.(values.top);
    onScroll?.(values);
  });

  const headerContent = useMemo(() => {
    if (stickyHeader == null) return undefined;
    return (
      <StickyHideHeader onHeightChange={setStickyHeaderHeight} align="right" contentClassName={css.internalListStickyHeaderContent}>
        {stickyHeader}
      </StickyHideHeader>
    );
  }, [stickyHeader, setStickyHeaderHeight, css.internalListStickyHeaderContent]);

  const handleActiveChange = useBound((event: ListItemEvent<T>, isActive: boolean) => {
    onActive?.(event, isActive);
  });

  const handleSelectChange = useBound((event: ListItemEvent<T>, isSelected: boolean) => {
    let isSelectedItemsChanged = false;
    const newSelectedItemIds = selectedItemIds.slice();
    const indexOfSelectedItem = newSelectedItemIds.indexOf(event.id);
    if (isSelected && indexOfSelectedItem === -1) {
      newSelectedItemIds.push(event.id);
      isSelectedItemsChanged = true;
    } else if (!isSelected && indexOfSelectedItem !== -1) {
      newSelectedItemIds.splice(indexOfSelectedItem, 1);
      isSelectedItemsChanged = true;
    }
    if (maxSelectableItems != null && maxSelectableItems >= 1 && newSelectedItemIds.length > maxSelectableItems) {
      newSelectedItemIds.splice(0, newSelectedItemIds.length - maxSelectableItems);
      isSelectedItemsChanged = true;
    }
    if (isSelectedItemsChanged) {
      updateSelectedItemIds(newSelectedItemIds);
      onSelectedItemsChange?.(newSelectedItemIds);
    }
  });

  useLayoutEffect(() => {
    if (containerElement == null || itemHeightLockedRef.current || items.length === 0) return;
    const measuredRowHeight = measureVirtualListItemHeight(containerElement);
    if (measuredRowHeight == null) return;

    const normalizedItemHeight = Math.max(VIRTUAL_LIST_ITEM_HEIGHT_FALLBACK, measuredRowHeight);
    itemHeightLockedRef.current = true;

    if (normalizedItemHeight !== itemHeight && containerElement.scrollTop > 0 && itemHeight > 0) {
      const adjustedScrollTop = Math.round(containerElement.scrollTop * (normalizedItemHeight / itemHeight));
      lastScrollTopRef.current = adjustedScrollTop;
      containerElement.scrollTop = adjustedScrollTop;
    }

    if (normalizedItemHeight !== itemHeight) {
      setItemHeight(normalizedItemHeight);
    }
  }, [containerElement, itemHeight, items.length]);

  useLayoutEffect(() => {
    if (!itemHeightLockedRef.current || containerElement == null) return;
    requestItems();
  }, [itemHeight, containerElement, requestItems]);

  useLayoutEffect(() => {
    refreshShadowVisibility?.();
  }, [renderedItems, refreshShadowVisibility]);

  useLayoutEffect(() => {
    if (onVerticalScrollbarWidthChange == null) return;
    if (containerElement == null) {
      onVerticalScrollbarWidthChange(0);
      return;
    }

    const report = () => {
      onVerticalScrollbarWidthChange(measureVerticalScrollbarWidth(containerElement));
    };

    report();
    const resizeObserver = new ResizeObserver(report);
    resizeObserver.observe(containerElement);
    const contentElement = containerElement.querySelector('scroller-content');
    if (contentElement != null) resizeObserver.observe(contentElement);

    return () => resizeObserver.disconnect();
  }, [containerElement, onVerticalScrollbarWidthChange, renderedItems, items.length, total]);

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
    <Flex
      tagName={tagName}
      className={join(css.internalList, className)}
      minWidth={minWidth ?? 0}
      minHeight={minHeight}
      isVertical
      maxWidth
      gap={gap}
    >
      <Scroller
        onScroll={handleOnScroll}
        actions={scrollerActions}
        disableShadows={disableShadowsOnScroller}
        horizontalShadows={horizontalScrollShadows}
        className={join(css.internalListScrollerContent, contentClassName)}
        fullHeight={fullHeight || showEmptyMessage}
        useParentContext={useParentScrollContext}
        headerContent={headerContent}
        style={{ paddingTop: stickyHeaderHeight }}
      >
        {header}
        {showEmptyMessage
          ? (
            <Flex tagName="list-empty-message" className={css.internalListEmptyMessage} alignCentrally>
              {emptyMessage}
            </Flex>
          )
          : (
            <InternalListContextProvider deleteTooltip={deleteTooltip} onDelete={onDelete} onActiveChange={handleActiveChange} onSelectChange={handleSelectChange}>
              {renderedItems}
            </InternalListContextProvider>
          )}
        {footer}
      </Scroller>
    </Flex>
  );
});
