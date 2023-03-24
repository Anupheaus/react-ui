import { ListItem } from '@anupheaus/common';
import { ReactNode } from 'react';

export interface ReactListItem extends ListItem {
  label?: ReactNode;
  iconName?: string;
  tooltip?: ReactNode;
  onSelect?(): void;
}

// export namespace ListItems {
//   export function convertToReactListItems<T extends TypographyComponent<TypographyTypes>>(listItems: ListItem[], typographicType: TypographyTypeIds<T>): ReactListItem[] {
//     return listItems.map(listItem => {
//       return {
//         label: (
//           <Typography type={typographicType}>{listItem.text}</Typography>
//         ),
//         ...listItem,
//       };
// });
//   }
// }