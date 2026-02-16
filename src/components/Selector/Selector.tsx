import { useMemo } from 'react';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import type { SelectorItem, SelectorSubItem } from './selector-models';
import { SelectorSection } from './SelectorSection';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import { useUIState, useValidation } from '../../providers';
import { useBound, useUpdatableState } from '../../hooks';
import { processSelectedItemsWithSections } from './processSelectedItemsWithSections';

const fakeItems: SelectorItem[] = [
  { id: '1', text: 'Item 1', subItems: [{ id: '1-1', text: 'Sub Item 1' }, { id: '1-2', text: 'Sub Item 2' }] },
  { id: '2', text: 'Item 2', subItems: [{ id: '2-1', text: 'Sub Item 1' }, { id: '2-2', text: 'Sub Item 2' }, { id: '2-3', text: 'Sub Item 3' }] },
];

interface SelectorSelectionConfiguration {
  totalSelectableItems?: number;
  maxSectionsWithSelectableItems?: number;

}

interface Props extends FieldProps {
  items: SelectorItem[];
  selectionConfiguration?: SelectorSelectionConfiguration;
  height?: string | number;
  fullHeight?: boolean;
  onSelect?(selectedItems: SelectorSubItem[]): void;
}

export const Selector = createComponent('Selector', ({
  items,
  selectionConfiguration,
  isOptional,
  requiredMessage,
  height,
  fullHeight,
  onSelect,
  ...props
}: Props) => {
  const { isLoading } = useUIState();
  const [ids, setIds] = useUpdatableState<string[]>(() => items.mapMany(item => item.subItems.mapWithoutNull(subItem => subItem?.isSelected ? subItem.id : undefined)), [items]);
  const { validate } = useValidation();

  const { error, enableErrors } = validate(({ validateRequired }) => validateRequired(ids.length > 0 ? 1 : undefined, isOptional !== true,
    requiredMessage ?? 'Please select at least one item'));

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
    enableErrors();
  });

  const sections = useMemo(() => {
    const itemsToRender = isLoading && items.length === 0 ? fakeItems : items;
    return itemsToRender.map(item => {
      const selectedIds = ids.filter(id => item.subItems.findById(id) != null);
      return (
        <SelectorSection key={item.id} item={item} hideHeader={items.length === 1} selectedIds={selectedIds} onSelect={onSelected} />
      );
    });
  }, [items, isLoading, ids]);


  return (
    <Field tagName="selector" disableRipple skeleton="outlineOnly" {...props} fullHeight={height == null} height={height} error={error ?? props.error}>
      <Flex tagName="selector-items" isVertical gap="fields">
        <Scroller fullHeight={fullHeight}>
          {sections}
        </Scroller>
      </Flex>
    </Field>
  );
});
