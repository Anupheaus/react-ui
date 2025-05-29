import { is } from '@anupheaus/common';
import type { ConfiguratorFirstCell, ConfiguratorItem, ConfiguratorSlice, ConfiguratorSubItem } from './configurator-models';
import type { ReactNode } from 'react';

const firstItems = new WeakSet<ConfiguratorItem>();

export function convertFirstCellIntoConfiguratorItem(firstCell: ConfiguratorFirstCell | undefined,
  renderFirstCell: (item: ConfiguratorSubItem<any, any, any>, slice: ConfiguratorSlice<any>) => ReactNode): ConfiguratorItem {
  const item: ConfiguratorItem = {
    id: 'first-cell',
    text: is.string(firstCell?.label) ? firstCell.label : 'Item',
    label: firstCell?.label,
    data: {},
    subItems: [],
    renderCell: renderFirstCell,
  };
  firstItems.add(item);
  return item;
}

export const isFirstItem = (item: ConfiguratorItem) => firstItems.has(item);
