import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBound } from '../../hooks/useBound';
import type { ListItemClickEvent, ReactListItem } from '../../models';
import type { FlexProps } from '../Flex';
import { Flex } from '../Flex';
import { createComponent } from '../Component';
import type { OnScrollEventData, ScrollerActions } from '../Scroller';
import { Scroller } from '../Scroller';
import type { UseActions } from '../../hooks';
import { useActions, useOnChange, useOnUnmount, useUpdatableState } from '../../hooks';
import type { UseDataRequest, UseDataResponse } from '../../extensions';
import type { UseItemsActions } from '../../hooks/useItems';
import { useItems } from '../../hooks/useItems';
import { createStyles } from '../../theme';
import { InternalListContextProvider } from './InternalListContext';
import type { PromiseMaybe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { InternalListItem } from './InternalListItem';
import { StickyHideHeader } from '../StickyHideHeader';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

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
  onDelete?(id: string, data: T, index: number): void;
  actions?: UseActions<InternalListActions>;
  onRequest?(request: UseDataRequest, response: (data: UseDataResponse<ReactListItem<T>>) => void): Promise<void>;
  onActive?(data: T | undefined): void;
  onSelectedItemsChange?(ids: string[]): void;
  onError?(error: Error): void;
  onClick?(event: ListItemClickEvent<T>): PromiseMaybe<void>;
  /** Header that slides up with scroll. Renders above the scrollable content. Use useScroller() in children for scroll position. */
  stickyHeader?: ReactNode;
  /** Called when vertical scroll position changes (e.g. for virtualisation). */
  onScrollTopChange?(scrollTop: number): void;
  /** When true, Scroller consumes parent ScrollContext and reports scroll to it (e.g. Table with sticky header). */
  useParentScrollContext?: boolean;
}

interface Props<T = void> extends InternalListProps<T> {
  tagName: string;
  className?: string;
  contentClassName?: string;
  disableShadowsOnScroller?: boolean;
  delayRenderingItems?: boolean;
  selectedItemIds?: string[];
  showSkeletons?: boolean;
  addTooltip?: ReactNode;
  onScroll?(values: OnScrollEventData): void;
  onItemsChange?(items: ReactListItem<T>[]): void;
  onMouseEnter?(event: MouseEvent): void;
  onAdd?(event: MouseEvent<HTMLElement>): PromiseMaybe<T | void>;
}

export const InternalList = createComponent('InternalList', function <T = void>({
  tagName,
  className,
  gap = 4,
  contentClassName,
  disableShadowsOnScroller = false,
  items: providedItems,
  delayRenderingItems = false,
  maxSelectableItems,
  selectedItemIds: providedSelectedItemIds,
  fullHeight,
  minWidth,
  minHeight,
  showSkeletons,
  addTooltip,
  actions,
  onScroll,
  onRequest,
  onError,
  onDelete,
  onActive,
  onSelectedItemsChange,
  onItemsChange,
  onClick,
  onAdd,
  stickyHeader,
  onScrollTopChange,
  useParentScrollContext = false,
}: Props<T>) {
  const { css, join } = useStyles();
  const heightRef = useRef<number>();
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number>(0);
  const hasUnmounted = useOnUnmount();
  const { setActions: useItemsActions, refresh } = useActions<UseItemsActions>();
  const { setActions: scrollerActions, scrollTo } = useActions<ScrollerActions>();
  const [selectedItemIds, updateSelectedItemIds] = useUpdatableState<string[]>(prevValues => (providedSelectedItemIds ?? prevValues ?? []).removeNull(), [providedSelectedItemIds]);
  const { items, total, request, offset, limit, error } = useItems({ initialLimit: 50, onRequest, actions: useItemsActions, selectedItemIds, items: providedItems, useSkeletons: showSkeletons, onItemsChange });
  const [allowedToRenderItems, setAllowedToRenderItems] = useState(!delayRenderingItems);
  const [activeItemId, setActiveItemId] = useState<string>();
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState<number>();

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

  const renderedItems = useMemo(() => {
    return (allowedToRenderItems ? items : []).slice(offset, offset + limit)
      .map((item, index) => <InternalListItem key={item.id} item={item} index={offset + index} isSelectable={(maxSelectableItems ?? 0) > 0} onClick={onClick} />);
  }, [allowedToRenderItems, items, offset, limit, maxSelectableItems, onClick]);

  const handleOnScroll = useBound((values: OnScrollEventData) => {
    if (containerElement == null) setContainerElement(values.element);
    if (lastScrollTopRef.current !== values.top) {
      lastScrollTopRef.current = values.top;
      requestItems();
    }
    onScrollTopChange?.(values.top);
    onScroll?.(values);
  });

  const handleAdd = useBound(async (event: MouseEvent<HTMLElement>) => { await onAdd?.(event); });

  const headerContent = useMemo(() => {
    if (stickyHeader == null && onAdd == null) return undefined;
    return (
      <StickyHideHeader onHeightChange={setStickyHeaderHeight} align="right" contentClassName={css.internalListStickyHeaderContent}>
        {stickyHeader}
        {onAdd != null && (
          <Tooltip content={addTooltip}>
            <Button size="small" variant="hover" onClick={handleAdd}>
              <Icon name="add" size="small" />
              Add
            </Button>
          </Tooltip>
        )}
      </StickyHideHeader>
    );
  }, [stickyHeader, onAdd, handleAdd, setStickyHeaderHeight]);

  const handleActiveChange = useBound((id: string, data: T, _index: number, isActive: boolean) => {
    if (isActive) {
      onActive?.(data);
      setActiveItemId(id);
    } else if (activeItemId === id) {
      onActive?.(undefined);
      setActiveItemId(undefined);
    }
  });

  const handleSelectChange = useBound((id: string, _data: T, _index: number, isSelected: boolean) => {
    let isSelectedItemsChanged = false;
    const newSelectedItemIds = selectedItemIds.slice();
    const indexOfSelectedItem = newSelectedItemIds.indexOf(id);
    if (isSelected && indexOfSelectedItem === -1) {
      newSelectedItemIds.push(id);
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
    <Flex
      tagName={tagName}
      className={join(css.internalList, className)}
      minWidth={minWidth}
      minHeight={minHeight}
      isVertical
      maxWidth
      gap={gap}
    >
      <Scroller
        onScroll={handleOnScroll}
        actions={scrollerActions}
        disableShadows={disableShadowsOnScroller}
        className={join(css.internalListScrollerContent, contentClassName)}
        fullHeight={fullHeight}
        useParentContext={useParentScrollContext}
        headerContent={headerContent}
        style={{ paddingTop: stickyHeaderHeight }}
      >
        {header}
        <InternalListContextProvider onDelete={onDelete} onActiveChange={handleActiveChange} onSelectChange={handleSelectChange}>
          {renderedItems}
        </InternalListContextProvider>
        {footer}
      </Scroller>
    </Flex>
  );
});
