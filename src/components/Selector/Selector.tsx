import { useMemo } from 'react';
import { createComponent } from '../Component';
import type { FieldProps } from '../Field';
import { Field } from '../Field';
import type { SelectorItem } from './selector-models';
import { SelectorSection } from './SelectorSection';
import { Flex } from '../Flex';
import { Scroller } from '../Scroller';
import type { ReactListItem } from '../../models';
import { useUIState } from '../../providers';

const fakeItems: SelectorItem[] = [
  { id: '1', text: 'Item 1', subItems: [{ id: '1-1', text: 'Sub Item 1' }, { id: '1-2', text: 'Sub Item 2' }] },
  { id: '2', text: 'Item 2', subItems: [{ id: '2-1', text: 'Sub Item 1' }, { id: '2-2', text: 'Sub Item 2' }, { id: '2-3', text: 'Sub Item 3' }] },
];

interface Props extends FieldProps {
  items: SelectorItem[];
  onSelect?(selectedItems: ReactListItem[]): void;
}

export const Selector = createComponent('Selector', ({
  items,
  onSelect,
  ...props
}: Props) => {
  const { isLoading } = useUIState();

  const sections = useMemo(() => {
    const itemsToRender = isLoading && items.length === 0 ? fakeItems : items;
    return itemsToRender.map(item => (
      <SelectorSection key={item.id} item={item} hideHeader={items.length === 1} onSelect={onSelect} />
    ));
  }, [items, isLoading, onSelect]);

  return (
    <Field tagName="selector" {...props} disableRipple wide fullHeight skeleton="outlineOnly">
      <Flex tagName="selector-items" isVertical gap="fields">
        <Scroller>
          {sections}
        </Scroller>
      </Flex>
    </Field>
  );
});
