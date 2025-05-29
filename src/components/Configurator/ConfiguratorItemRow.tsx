import { createComponent } from '../Component';
import type { ConfiguratorItem, ConfiguratorSlice } from './configurator-models';
import { useMemo, useRef } from 'react';
import { ConfiguratorCell } from './ConfiguratorCell';
import { Flex } from '../Flex';
import { createStyles } from '../../theme';
import { ConfiguratorSubItemRow } from './ConfiguratorSubItem';
import { useBound, useOnDOMChange } from '../../hooks';

const useStyles = createStyles((_, { applyTransition }) => ({
  configuratorRow: {
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
  },
  configuratorItemRow: {},
  configuratorSubItemRows: {
    height: 0,
    contain: 'paint',
    ...applyTransition('height'),

    '&.is-expanded': {
      height: 'var(--max-height)',
    },
  },
}));

interface Props {
  item: ConfiguratorItem;
  slices: ConfiguratorSlice<any>[];
  isHeader?: boolean;
  isFooter?: boolean;
  isOdd?: boolean;
  onChangeItem?(item: ConfiguratorItem<any, any>): void;
}

export const ConfiguratorItemRow = createComponent('ConfiguratorItemRow', ({
  item,
  slices,
  isHeader = false,
  isFooter = false,
  isOdd = false,
  onChangeItem,
}: Props) => {
  const { css, join } = useStyles();
  const target = useOnDOMChange({ isEnabled: item.subItems.length > 0, onChange: () => updateHeightRef.current() });
  const updateHeightRef = useRef(() => void 0);

  const cells = useMemo(() => slices.map((slice, index) => (
    <ConfiguratorCell key={slice.id} columnIndex={index + 1} item={item} slice={slice} isHeader={isHeader} isFooter={isFooter}
      isOddItem={isOdd} isOddSlice={index % 2 === 0} onChangeItem={onChangeItem}
    />
  )), [slices, isHeader, isFooter, isOdd]);

  const subItemRows = useMemo(() => (item.subItems ?? []).map((subItem, index) => (
    <ConfiguratorSubItemRow key={subItem.id} item={subItem} slices={slices} isOdd={index % 2 === 0} onChangeItem={onChangeItem} />
  )), [item.subItems, slices, onChangeItem]);

  const saveElement = useBound((element: HTMLDivElement) => {
    target(element);
    if (element == null) return;
    updateHeightRef.current = () => { element.parentElement?.style.setProperty('--max-height', `${element.scrollHeight}px`); };
    updateHeightRef.current();
  });

  return (
    <Flex tagName="configurator-row" className={join(css.configuratorRow, isHeader && 'is-header', isFooter && 'is-footer')} isVertical>
      <Flex tagName="configurator-item-row" className={css.configuratorItemRow}>
        <ConfiguratorCell columnIndex={0} item={item} isHeader={isHeader} isFooter={isFooter} isOddItem={isOdd} isOddSlice={false} onChangeItem={onChangeItem} />
        {cells}
      </Flex>
      {subItemRows.length > 0 && (
        <Flex ref={saveElement} tagName="configurator-sub-item-rows" className={join(css.configuratorSubItemRows, item.isExpanded && 'is-expanded')} isVertical>
          {subItemRows}
        </Flex>
      )}
    </Flex>
  );
});