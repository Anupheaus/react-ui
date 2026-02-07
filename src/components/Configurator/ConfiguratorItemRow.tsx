import { createComponent } from '../Component';
import type { ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';
import { ConfiguratorCell } from './ConfiguratorCell';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { ConfiguratorSubItemRow } from './ConfiguratorSubItemRow';
import { useBound, useOnDOMChange } from '../../hooks';
import { ConfiguratorAddItem } from './ConfiguratorAddItem';
import { ConfiguratorAddSlice } from './ConfiguratorAddSlice';
import type { OnShadowVisibleChangeEvent } from '../Scroller';
import { Tag } from '../Tag';

const useStyles = createStyles(({ shadows: { scroll: shadow } }, { applyTransition }) => ({
  configuratorRow: {
    width: 'fit-content',

    '&.is-header, &.is-footer': {
      position: 'sticky',
      zIndex: 3,
    },

    '&.is-header': {
      top: 0,
    },

    '&.is-footer': {
      bottom: 0,
    },

    '&.has-top-shadow': {
      '&::after': {
        position: 'absolute',
        content: '""',
        bottom: -30,
        left: -10,
        right: -10,
        height: 30,
        boxShadow: shadow(true),
        pointerEvents: 'none',
      }
    },
  },
  configuratorItemRow: {},
  configuratorSubItemRows: {
    height: 0,
    overflow: 'hidden',
    ...applyTransition('height'),

    '&.is-expanded': {
      height: 'var(--max-height)',
    },
  },
  configuratorRowTopShadow: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    width: '100%',
    height: 30,
    opacity: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    ...applyTransition('opacity'),

    '&::after': {
      content: '""',
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      height: 2,
      boxShadow: shadow(false),
    },

    '&.is-visible': {
      opacity: 1,
    },
  },
}));

interface Props {
  item: ConfiguratorItem;
  slices: ConfiguratorSlice<any>[];
  isHeader?: boolean;
  isFooter?: boolean;
  isOdd?: boolean;
  addSubItemLabel?: ReactNode;
  addSliceLabel?: ReactNode;
  visibleShadows?: OnShadowVisibleChangeEvent;
  onExpandItem?(item: ConfiguratorItem<any, any>): void;
  onAddSubItem?(item: ConfiguratorItem<any, any>): void;
  onAddSlice?(): void;
}

export const ConfiguratorItemRow = createComponent('ConfiguratorItemRow', ({
  item,
  slices,
  isHeader = false,
  isFooter = false,
  isOdd = false,
  addSubItemLabel,
  addSliceLabel,
  visibleShadows,
  onExpandItem,
  onAddSubItem,
  onAddSlice,
}: Props) => {
  const { css, join } = useStyles();
  const hasSubItems = item.subItems.length > 0 || onAddSubItem != null;
  const target = useOnDOMChange({ isEnabled: hasSubItems, onChange: () => updateHeightRef.current() });
  const updateHeightRef = useRef(() => void 0);

  const cells = useMemo(() => slices.map((slice, index) => (
    <ConfiguratorCell key={slice.id} columnIndex={index + 1} item={item} slice={slice} isHeader={isHeader} isFooter={isFooter}
      isOddItem={isOdd} isOddSlice={index % 2 === 0}
    />
  )), [slices, isHeader, isFooter, isOdd, onExpandItem]);

  const subItemRows = useMemo(() => item.subItems.map((subItem, index) => (
    <ConfiguratorSubItemRow key={subItem.id} item={subItem} slices={slices} isOdd={index % 2 === 0} />
  )), [item.subItems, slices]);

  const saveElement = useBound((element: HTMLDivElement) => {
    target(element);
    if (element == null) return;
    updateHeightRef.current = () => { element.parentElement?.style.setProperty('--max-height', `${element.scrollHeight}px`); };
    updateHeightRef.current();
  });


  const handleAddItem = useBound(() => onAddSubItem?.(item));

  return (
    <Flex tagName="configurator-row" className={join(css.configuratorRow, isHeader && 'is-header', isFooter && 'is-footer')} isVertical disableGrow>
      <Flex tagName="configurator-item-row" className={css.configuratorItemRow}>
        <ConfiguratorCell columnIndex={0} item={item} isHeader={isHeader} isFooter={isFooter} isOddItem={isOdd} isOddSlice={false}
          addShadowToRight={visibleShadows?.left} onExpandItem={hasSubItems ? onExpandItem : undefined} />
        {cells}
        {(onAddSlice != null && isHeader) && (
          <ConfiguratorAddSlice columnIndex={cells.length + 1} addSliceLabel={addSliceLabel} onAddSlice={onAddSlice} />
        )}
      </Flex>
      {hasSubItems && (
        <Flex ref={saveElement} tagName="configurator-sub-item-rows" className={join(css.configuratorSubItemRows, item.isExpanded && 'is-expanded')} isVertical>
          {subItemRows}
          <ConfiguratorAddItem isOdd={subItemRows.length % 2 === 0} isSubItem onAddItem={onAddSubItem != null ? handleAddItem : undefined}>{addSubItemLabel}</ConfiguratorAddItem>
        </Flex>
      )}
      {isHeader && (<Tag name="configurator-row-top-shadow" className={join(css.configuratorRowTopShadow, visibleShadows?.top && 'is-visible')} />)}
    </Flex>
  );
});