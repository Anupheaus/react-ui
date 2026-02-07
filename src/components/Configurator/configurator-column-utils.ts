import { is } from '@anupheaus/common';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import type { ReactNode } from 'react';

const firstItems = new WeakSet<ConfiguratorItem>();

export function convertFirstCellIntoConfiguratorItem(firstCell: ConfiguratorFirstCell | undefined,
  renderFirstCell: (item: ConfiguratorSubItem, slice: ConfiguratorSlice) => ReactNode): ConfiguratorItem {
  const item: ConfiguratorItem = {
    ...firstCell,
    id: 'first-cell',
    text: is.string(firstCell?.label) ? firstCell.label : 'Item',
    data: {},
    subItems: [] as ConfiguratorSubItem[],
    renderCell: renderFirstCell,
  };
  firstItems.add(item);
  return item;
}

export const isFirstItem = (item: ConfiguratorItem) => firstItems.has(item);
