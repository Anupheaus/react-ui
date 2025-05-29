import type { ReactListItem } from '../../models';


export interface SelectorItem extends ReactListItem {
  allowMultiSelect?: boolean;
  subItems: ReactListItem[];
}
