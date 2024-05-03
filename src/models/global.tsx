import { ListItem, Record, is } from '@anupheaus/common';
import { ReactNode } from 'react';
import { IconName } from '../components/Icon/Icons';
import { Skeleton } from '../components/Skeleton';

export interface ReactListItem extends ListItem {
  label?: ReactNode;
  iconName?: IconName;
  tooltip?: ReactNode;
  className?: string;
  onSelect?(): void;
}

export namespace ReactListItem {

  export function render<T extends ReactListItem>(item: T | Promise<T> | undefined): ReactNode {
    if (item != null && !is.promise(item)) {
      if (item.label != null) return item.label;
      if (is.not.empty(item.text)) return item.text;
    }
    return <Skeleton type="text" useRandomWidth isVisible />;
  }

}

export type ListItemType = string | Record | ReactListItem;
