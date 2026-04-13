import { useMemo } from 'react';
import { createComponent } from '../Component';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import type { SelectorSelectionConfiguration } from './Selector';
import { SelectorSection } from './SelectorSection';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { useUIState } from '../../providers';
import { useBound, useUpdatableState } from '../../hooks';
import { processSelectedItemsWithSections } from './processSelectedItemsWithSections';

const fakeItems: SelectorItem[] = [
  { id: '1', text: 'Item 1', subItems: [{ id: '1-1', text: 'Sub Item 1' }, { id: '1-2', text: 'Sub Item 2' }] },
  { id: '2', text: 'Item 2', subItems: [{ id: '2-1', text: 'Sub Item 1' }, { id: '2-2', text: 'Sub Item 2' }, { id: '2-3', text: 'Sub Item 3' }] },
];

interface Props {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const InternalSelector = createComponent('InternalSelector', ({
  items,
  selectionConfiguration,
  onSelect,
}: Props) => {
  const { isLoading } = useUIState();
  const [ids, setIds] = useUpdatableState<string[]>(
    () => items.mapMany(item => item.subItems.mapWithoutNull(subItem => subItem?.isSelected ? subItem.id : undefined)),
    [items],
  );

  const onSelected = useBound((addId: string | undefined, removeIds: string[]) => {
    let newIds = ids.slice().removeMany([...removeIds, ...(addId != null ? [addId] : [])]);
    if (addId != null) newIds = newIds.concat(addId);
    if (selectionConfiguration != null) {
      const { totalSelectableItems, maxSectionsWithSelectableItems } = selectionConfiguration;
      if (totalSelectableItems != null && newIds.length > totalSelectableItems) newIds = newIds.slice(newIds.length - totalSelectableItems);
      if (maxSectionsWithSelectableItems != null) newIds = processSelectedItemsWithSections(newIds, maxSectionsWithSelectableItems, items);
    }
    setIds(newIds);
    onSelect?.(items.mapMany(item => item.subItems).filterByIds(newIds));
  });

  const sections = useMemo(() => {
    const itemsToRender = isLoading && items.length === 0 ? fakeItems : items;
    return itemsToRender.orderBy('ordinal').map(item => {
      const selectedIds = ids.filter(id => item.subItems.findById(id) != null);
      return (
        <SelectorSection key={item.id} item={item} hideHeader={items.length === 1} selectedIds={selectedIds} onSelect={onSelected} />
      );
    });
  }, [items, isLoading, ids]);

  return (
    <Scroller>
      <Flex tagName="selector-items" isVertical gap="fields">
        {sections}
      </Flex>
    </Scroller>
  );
});
