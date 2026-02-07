import type { ReactListItem } from '../../models';

export type SelectorSubItem = ReactListItem;

export interface SelectorItem extends SelectorSubItem {
  maxSelectableItems?: number;
  subItems: SelectorSubItem[];
}
