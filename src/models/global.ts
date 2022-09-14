import { ReactNode } from 'react';

export interface ListItem {
  id: string;
  text: string;
  label?: ReactNode;
  iconName?: string;
  tooltip?: ReactNode;
  isDisabled?: boolean;
}
