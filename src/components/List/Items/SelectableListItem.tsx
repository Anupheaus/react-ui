import { ReactListItem } from '../../../models';
import { createComponent } from '../../Component';
import { UIState } from '../../../providers';
import { Flex } from '../../Flex';
import type { ListItemProps } from './ListItem';
import { ListItem } from './ListItem';
import { Checkbox } from '../../Checkbox';
import { useDelegatedBound } from '../../../hooks';
import { useCallback, useState } from 'react';

interface Props<T extends ReactListItem> extends Omit<ListItemProps<T>, 'onSelect'> {
  className?: string;
  selectedItems?: T[] | string[];
  onSelect?(item: T, index: number, isSelected: boolean): void;
}

export const SelectableListItem = createComponent('SelectableListItem', <T extends ReactListItem = ReactListItem>({
  className,
  onSelect,
}: Props<T>) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleSelect = useDelegatedBound((item: T | undefined, index: number) => (newIsSelected: boolean) => {
    if (item == null) return;
    setIsSelected(newIsSelected);
    item.isSelected = newIsSelected;
    item.onSelect?.();
    onSelect?.(item, index, newIsSelected);
  });

  const renderItem = useCallback((item: T | undefined, index: number, isLoading: boolean) => (
    <UIState isLoading={isLoading}>
      <Flex tagName="selectable-list-item" gap="fields">
        <Checkbox assistiveText={false} value={item?.isSelected ?? isSelected} onChange={handleSelect(item, index)}>{ReactListItem.render(item)}</Checkbox>
      </Flex>
    </UIState>
  ), [isSelected]);

  return (
    <ListItem className={className} disableRipple>
      {renderItem}
    </ListItem>
  );
});
