import { ReactListItem } from '../../../models';
import { createComponent } from '../../Component';
import { UIState } from '../../../providers';
import { Flex } from '../../Flex';
import type { ListItemProps } from './ListItem';
import { ListItem } from './ListItem';
import { Checkbox } from '../../Checkbox';
import { useBound, useDelegatedBound } from '../../../hooks';

interface Props<T extends ReactListItem> extends Omit<ListItemProps<T>, 'onSelect'> {
  className?: string;
  onSelect?(item: T, index: number, isSelected: boolean): void;
}

export const SelectableListItem = createComponent('SelectableListItem', <T extends ReactListItem = ReactListItem>({
  className,
  onSelect,
}: Props<T>) => {

  const handleSelect = useDelegatedBound((item: T | undefined, index: number) => (isSelected: boolean) => {
    if (item == null) return;
    item.onSelect?.();
    onSelect?.(item, index, isSelected);
  });

  const renderItem = useBound((item: T | undefined, index: number, isLoading: boolean) => (
    <UIState isLoading={isLoading}>
      <Flex tagName="selectable-list-item" gap="fields">
        <Checkbox assistiveText={false} value={item?.isSelected ?? false} onChange={handleSelect(item, index)}>{ReactListItem.render(item)}</Checkbox>
      </Flex>
    </UIState>
  ));

  return (
    <ListItem className={className} disableRipple>
      {renderItem}
    </ListItem>
  );
});
