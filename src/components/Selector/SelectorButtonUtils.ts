import type { ReactNode } from 'react';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';

export function getButtonLabel(selectedItems: SelectorSubItem[]): ReactNode {
  if (selectedItems.length === 0) return 'Not Set';
  if (selectedItems.length === 1) return selectedItems[0].label ?? selectedItems[0].text;
  return `${selectedItems.length} selected`;
}

export function isSingleSelect(items: SelectorItem[], config?: SelectorSelectionConfiguration): boolean {
  if (config?.totalSelectableItems === 1) return true;
  if (items.length === 1 && items[0].maxSelectableItems === 1) return true;
  return false;
}
