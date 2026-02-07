// import type { ComponentProps } from 'react';
// import { createComponent } from '../../Component';
// import { SimpleListItem } from '../../InternalList/InternalListItem';
// import type { ListItemType, ReactListItem } from '../../../models';
// import { useListItem } from '../../InternalList';
// import { is } from '@anupheaus/common';
// import { ExpandableListItem } from './ExpandableListItem';

// export type Props<T extends ListItemType = ListItemType> = ComponentProps<typeof SimpleListItem<T>>;

// export const ListItem = createComponent('ListItem', <T extends ListItemType = ListItemType>(props: Props<T>) => {
//   const { item, index, isLoading } = useListItem<T>(props.item);

//   const reactListItem = is.plainObject<ReactListItem>(item) ? item : undefined;

//   if (reactListItem?.subItems != null && reactListItem.subItems.length > 0) {
//     return <ExpandableListItem {...props} />;
//   }

//   return <SimpleListItem {...props} />;
// });
