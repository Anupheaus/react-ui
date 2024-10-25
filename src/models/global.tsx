import type { ListItem, Record } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { ReactNode } from 'react';
import type { IconName } from '../components/Icon/Icons';
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
