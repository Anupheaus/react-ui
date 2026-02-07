import { useLayoutEffect, useMemo, useState } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { SelectorItem } from './selector-models';
import { SelectorSectionItem } from './SelectorSectionItem';
import { useBound, useUpdatableState } from '../../hooks';
import type { ReactListItem } from '../../models';
import { Skeleton } from '../Skeleton';
import { useUIState } from '../../providers';

const useStyles = createStyles(({ fields: { content: { normal: { borderColor } } } }) => ({
  section: {
    padding: '0 4px',

    '&.no-header': {
      padding: '4px 4px 0',
    },

    '&:last-child': {
      paddingBottom: 4,
    },
  },
  headerLine: {
    margin: 'auto 0',
    borderBottom: `1px solid ${borderColor}`,
    height: 0,

    '&.is-loading': {
      margin: 'unset',
      borderBottom: 0,
      height: 'min-content',
    },
  },
  headerLineSkeleton: {
    margin: 'auto 0',
    height: 1,

    '&.short': {
      width: 16,
    },
  },
  headerLineSkeletonText: {
    width: 100,
  },
  items: {
    alignContent: 'flex-start',
  },
}));

interface Props {
  hideHeader?: boolean;
  item: SelectorItem;
  selectedIds: string[];
  onSelect?(addId: string | undefined, removeIds: string[]): void;
}

export const SelectorSection = createComponent('SelectorSection', ({
  hideHeader = false,
  item,
  selectedIds,
  onSelect,
}: Props) => {
  const { css, join } = useStyles();
  const { isLoading } = useUIState();
  const [maxWidth, setMaxWidth] = useUpdatableState(() => 0, [item]);
  const [width, setWidth] = useState(() => 0);

  const updateWidth = useBound((newWidth: number) => setMaxWidth(currentWidth => Math.max(currentWidth, newWidth)));

  const handleOnSelect = useBound((selectedItem: ReactListItem) => {
    if (selectedIds.includes(selectedItem.id)) {
      onSelect?.(undefined, [selectedItem.id]);
    } else {
      const newIds = selectedIds.concat(selectedItem.id);
      const idsToRemove = item.maxSelectableItems != null && newIds.length > item.maxSelectableItems ? newIds.slice(0, newIds.length - item.maxSelectableItems) : [];
      onSelect?.(selectedItem.id, idsToRemove);
    }
  });

  const subItems = useMemo(() => item.subItems.map(subItem => (
    <SelectorSectionItem key={subItem.id} item={subItem} isSelected={selectedIds.includes(subItem.id)} width={width} onUpdateWidth={updateWidth} onSelect={handleOnSelect} />
  )), [item.subItems, width, selectedIds]);

  useLayoutEffect(() => {
    if (maxWidth === 0) return;
    setWidth(maxWidth);
  }, [maxWidth]);

  return (
    <Flex tagName="selector-section" gap={4} isVertical disableGrow className={join(css.section, hideHeader && 'no-header')}>
      {!hideHeader && (
        <Flex tagName="selector-section-header" gap={4} valign="center">
          <Flex tagName="selector-section-header-line" className={join(css.headerLine, isLoading && 'is-loading')} width={16} disableGrow>
            <Skeleton type="text" className={join(css.headerLineSkeleton, 'short')} />
          </Flex>
          <Flex tagName="selector-section-header-text" disableGrow>
            {isLoading ? <Skeleton type="text">Loading...</Skeleton> : (item.label ?? item.text)}
          </Flex>
          <Flex tagName="selector-section-header-line" className={join(css.headerLine, isLoading && 'is-loading')}>
            <Skeleton type="text" className={css.headerLineSkeleton} />
          </Flex>
        </Flex>
      )}
      <Flex tagName="selector-section-items" gap={4} enableWrap className={css.items}>
        {subItems}
      </Flex>
    </Flex>
  );
});