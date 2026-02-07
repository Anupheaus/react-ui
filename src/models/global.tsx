import type { ListItem } from '@anupheaus/common';
import { is as isCommon } from '@anupheaus/common';
import type { ReactNode } from 'react';
import type { IconName } from '../components/Icon/Icons';
import { Skeleton } from '../components/Skeleton';

export type ReactListItem<DataType = any, SubItemType extends ReactListItem = ReactListItem<any, any>> = ListItem & {
  label?: ReactNode;
  iconName?: IconName;
  tooltip?: ReactNode;
  help?: ReactNode;
  className?: string;
  isSelected?: boolean;
  isSelectable?: boolean;
  isExpanded?: boolean;
  subItems?: SubItemType[];
  disableRipple?: boolean;
  actions?: ReactNode;
  isDeletable?: boolean;
  data?: DataType | Promise<DataType>;
  onClick?(id: string, item: DataType, index: number): void;
  onDelete?(id: string, item: DataType, index: number): void;
  onSelectChange?(id: string, item: DataType, index: number, isSelected: boolean): void;
  onActiveChange?(id: string, item: DataType, index: number, isActive: boolean): void;
  render?(id: string, item: DataType, index: number): ReactNode;
  renderLoading?(id: string, index: number): ReactNode;
  renderError?(id: string, error: Error, index: number): ReactNode;
  renderItem?(item: ReactListItem<DataType>, index: number, resolvedData?: DataType): ReactNode;
};

export namespace ReactListItem {

  export function render<T extends ReactListItem>(item: T | Promise<T> | undefined): ReactNode {
    if (item != null && !isCommon.promise(item)) {
      if (item.label != null) return item.label;
      if (isCommon.not.empty(item.text)) return item.text;
    }
    return <Skeleton type="text" useRandomWidth isVisible />;
  }

  export function from(item: ListItemType): ReactListItem {
    if (isCommon.string(item)) return { id: item, text: item };
    if (isCommon.record(item)) return { id: item.id, text: item.id };
    return item;
  }

  export function is(item: unknown): item is ReactListItem {
    return isCommon.plainObject(item)
      && isCommon.not.empty(item.id)
      && isCommon.string(item.text);
  }
}

export type ListItemType = string | ListItem | ReactListItem;
