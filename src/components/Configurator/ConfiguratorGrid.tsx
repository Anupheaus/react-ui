import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import { ConfiguratorItemRow } from './ConfiguratorItemRow';
import { convertFirstCellIntoConfiguratorItem } from './configurator-column-utils';
import type { AnyObject } from '@anupheaus/common';
import { useBound, useUpdatableState } from '../../hooks';
import { ColumnWidthsContext } from './configurator-contexts';
import { createStyles } from '../../theme';

const useStyles = createStyles(({ configurator: { borderRadius = 4 } }) => ({
  configuratorGrid: {
    borderRadius,
    overflow: 'hidden',
  },
}));

interface Props {
  firstCell: ConfiguratorFirstCell | undefined;
  items: ConfiguratorItem[];
  slices: ConfiguratorSlice<any>[];
  footer?: ConfiguratorItem;
}

export const ConfiguratorGrid = createComponent('ConfiguratorGrid', ({
  firstCell,
  items: providedItems,
  slices,
  footer,
}: Props) => {
  const { css } = useStyles();
  const [items, setItems] = useUpdatableState(() => providedItems, [providedItems]);

  const renderFirstCell = useBound((item: ConfiguratorSubItem<AnyObject, AnyObject, AnyObject>, slice: ConfiguratorSlice<AnyObject>) => {
    if (item === firstCell) return firstCell?.label ?? null;
    return slice.label ?? slice.text ?? null;
  });

  const headerRow = useMemo(() => (
    <ConfiguratorItemRow item={convertFirstCellIntoConfiguratorItem(firstCell, renderFirstCell)} slices={slices} isHeader />
  ), [firstCell, slices]);

  const footerRow = useMemo(() => footer == null ? null : (
    <ConfiguratorItemRow item={footer} slices={slices} isFooter />
  ), [footer]);

  const handleOnChangeItem = useBound((newItem: ConfiguratorItem<AnyObject, AnyObject>) => {
    setItems(items.map(item => item.id === newItem.id ? newItem : item));
  });

  const renderedItems = useMemo(() => items.map((item, itemIndex) => (
    <ConfiguratorItemRow key={item.id} item={item} slices={slices} isOdd={itemIndex % 2 === 0} onChangeItem={handleOnChangeItem} />
  )), [items, slices]);

  const columnWidths = useMemo(() => {
    return [firstCell?.minWidth ?? 80, ...slices.map(slice => slice.minWidth ?? 80)];
  }, [firstCell, slices]);

  return (
    <Flex tagName="configurator-grid" isVertical className={css.configuratorGrid}>
      <ColumnWidthsContext.Provider value={columnWidths}>
        {headerRow}
        {renderedItems}
        {footerRow}
      </ColumnWidthsContext.Provider>
    </Flex>
  );
});