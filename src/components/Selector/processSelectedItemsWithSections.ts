import type { SelectorItem } from './selector-models';

export function processSelectedItemsWithSections(selectedIds: string[], maxSectionsWithSelectableItems: number, items: SelectorItem[]): string[] {
  const sectionIds = new Set<string>();
  return selectedIds
    .slice()
    .reverse()
    .filter(id => {
      const item = items.find(i => i.id === id || i.subItems.findById(id) != null);
      if (item == null) return false;
      sectionIds.add(item.id);
      if (sectionIds.size >= maxSectionsWithSelectableItems) return false;
      return true;
    })
    .reverse();
}
