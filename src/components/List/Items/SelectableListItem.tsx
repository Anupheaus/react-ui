// import { ReactListItem } from '../../../models';
// import { createComponent } from '../../Component';
// import { UIState } from '../../../providers';
// import { Flex } from '../../Flex';
// import type { ListItemProps } from './ListItem';
// import { ListItem } from './ListItem';
// import { Checkbox } from '../../Checkbox';
// import { useDelegatedBound } from '../../../hooks';
// import { useCallback, useLayoutEffect } from 'react';
// import { useSelectableList } from '../SelectableListContext';
// import { is } from '@anupheaus/common';

// interface Props<T extends ReactListItem> extends Omit<ListItemProps<T>, 'onSelect'> {
//   className?: string;
//   item?: T;
//   selectedItems?: T[] | string[];
//   onSelect?(item: T, index: number, isSelected: boolean): void;
// }

// export const SelectableListItem = createComponent('SelectableListItem', <T extends ReactListItem = ReactListItem>({
//   className,
//   item: providedItem,
//   onSelect,
//   children,
// }: Props<T>) => {
//   const { selectedItems, setSelectedItems } = useSelectableList();

//   const handleSelect = useDelegatedBound((item: T | undefined, index: number) => (newIsSelected: boolean) => {
//     item = providedItem ?? item;
//     if (item == null) return;
//     item.isSelected = newIsSelected;
//     if (newIsSelected) item.onSelect?.();
//     onSelect?.(item, index, newIsSelected);
//     setSelectedItems(item.id, newIsSelected);
//   });

//   useLayoutEffect(() => {
//     if (providedItem == null) return;
//     const isSelected = selectedItems.includes(providedItem.id);
//     if (isSelected === providedItem.isSelected) return;
//     onSelect?.(providedItem, 0, isSelected);
//   }, [selectedItems, providedItem, onSelect]);

//   const renderItem = useCallback((item: T | undefined, index: number, isLoading: boolean) => {
//     item = providedItem ?? item;
//     const isSelected = item != null ? selectedItems.includes(item.id) : false;
//     if (item != null && isSelected !== item.isSelected) {
//       item.isSelected = isSelected;
//       if (isSelected) item.onSelect?.();
//       onSelect?.(item, index, isSelected);
//     }
//     const renderedChildren = children != null ? (is.function(children) ? children(item, index, isLoading) : children) : undefined;
//     return (
//       <UIState isLoading={isLoading}>
//         <Flex tagName="selectable-list-item" gap="fields">
//           <Checkbox assistiveHelp={false} value={isSelected} onChange={handleSelect(item, index)}>{renderedChildren ?? ReactListItem.render(item)}</Checkbox>
//         </Flex>
//       </UIState>
//     );
//   }, [selectedItems]);

//   return (
//     <ListItem className={className} disableRipple data-whitelist-functions={['children']}>
//       {renderItem}
//     </ListItem>
//   );
// });
