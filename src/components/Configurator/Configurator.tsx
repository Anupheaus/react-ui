import { useMemo, useState, type ReactNode } from 'react';
import { createStyles } from '../../theme';
import { createComponent } from '../Component';
import { Field } from '../Field';
import { Flex } from '../Flex';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { useBound, useUpdatableState } from '../../hooks';
import { ConfiguratorItemRow } from './ConfiguratorItemRow';
import { ConfiguratorAddItem } from './ConfiguratorAddItem';
import { convertFirstCellIntoConfiguratorItem } from './configurator-column-utils';
import { ConfiguratorColumnWidthsProvider } from './column-widths';
import type { OnShadowVisibleChangeEvent } from '../Scroller';
import { Scroller } from '../Scroller';
import { Tag } from '../Tag';

const useStyles = createStyles(({ configurator: { borderRadius = 4 }, shadows: { scroll: shadow } }, { applyTransition }) => ({
  configurator: {
    width: 0,
    height: 0,
    minWidth: '100%',
    minHeight: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
  },
  configuratorGrid: {
    borderRadius,
    overflow: 'hidden',
  },
  configuratorScroller: {
    minHeight: 'fit-content',
    minWidth: 'fit-content',
  },
  configuratorShadow: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    pointerEvents: 'none',
    zIndex: 1000,
    boxShadow: shadow(false),
    opacity: 0,
    ...applyTransition('opacity'),

    '&.is-bottom': {
      height: 2,
      left: -2,
    },
    '&.is-right': {
      width: 2,
      top: -2,
    },

    '&.is-visible': {
      opacity: 1,
    },
  },
}));

interface Props {
  firstCell?: ConfiguratorFirstCell;
  items: ConfiguratorItem[];
  slices: ConfiguratorSlice[];
  footer?: ConfiguratorItem;
  addItemLabel?: ReactNode;
  addSubItemLabel?: ReactNode;
  addSliceLabel?: ReactNode;
  onAddItem?(): void;
  onAddSubItem?(item: ConfiguratorItem): void;
  onAddSlice?(): void;
}

export const Configurator = createComponent('Configurator', ({
  firstCell,
  items: providedItems,
  slices,
  footer,
  addItemLabel,
  addSubItemLabel,
  addSliceLabel,
  onAddItem,
  onAddSubItem,
  onAddSlice,
}: Props) => {
  const { css, join } = useStyles();
  const [items, setItems] = useUpdatableState(() => providedItems, [providedItems]);
  const [visibleShadows, setVisibleShadows] = useState<OnShadowVisibleChangeEvent>(() => ({ top: false, left: false, bottom: false, right: false }));

  const renderFirstCell = useBound((item: ConfiguratorSubItem, slice: ConfiguratorSlice) => {
    if (item === firstCell) return firstCell?.label ?? null;
    return slice.label ?? slice.text ?? null;
  });

  const headerRow = useMemo(() => (
    <ConfiguratorItemRow item={convertFirstCellIntoConfiguratorItem(firstCell, renderFirstCell)} slices={slices} isHeader addSliceLabel={addSliceLabel} visibleShadows={visibleShadows} onAddSlice={onAddSlice} />
  ), [firstCell, slices, addItemLabel, visibleShadows, onAddSlice]);

  const footerRow = useMemo(() => footer == null ? null : (
    <ConfiguratorItemRow item={footer} slices={slices} isFooter />
  ), [footer]);

  const expandItem = useBound((newItem: ConfiguratorItem) => {
    setItems(items.map(item => item.id === newItem.id ? newItem : item));
  });

  const renderedItems = useMemo(() => items.map((item, itemIndex) => (
    <ConfiguratorItemRow key={item.id} item={item} slices={slices} isOdd={itemIndex % 2 === 0} addSubItemLabel={addSubItemLabel}
      visibleShadows={visibleShadows} onExpandItem={expandItem} onAddSubItem={onAddSubItem} />
  )), [items, slices, addSubItemLabel, visibleShadows, onAddSubItem, expandItem]);

  const addItemRow = useMemo(() => (
    <ConfiguratorAddItem isOdd={items.length % 2 === 0} visibleShadows={visibleShadows} onAddItem={onAddItem}>{addItemLabel}</ConfiguratorAddItem>
  ), [items, addItemLabel, visibleShadows, onAddItem]);

  return (
    <Field
      tagName="configurator"
      className={css.configurator}
      disableRipple
      noContainer
    >
      <Flex tagName="configurator-grid" isVertical className={css.configuratorGrid} maxWidthAndHeight>
        <Scroller
          disableShadows
          containerContent={(<>
            <Tag name="configurator-bottom-shadow" className={join(css.configuratorShadow, 'is-bottom', visibleShadows?.bottom === true && 'is-visible')} />
            <Tag name="configurator-right-shadow" className={join(css.configuratorShadow, 'is-right', visibleShadows?.right === true && 'is-visible')} />
          </>)}
          className={css.configuratorScroller}
          onShadowVisibilityChange={setVisibleShadows}
        >
          <ConfiguratorColumnWidthsProvider itemMinWidth={firstCell?.minWidth} itemMaxWidth={firstCell?.maxWidth} slices={slices}>
            {headerRow}
            {renderedItems}
            {addItemRow}
            {footerRow}
          </ConfiguratorColumnWidthsProvider>
        </Scroller>
      </Flex>
    </Field>
  );
});
