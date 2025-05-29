import type { ReactNode } from 'react';
import { createContext } from 'react';
import type { FlexProps } from '../Flex';

export interface UpsertTabProps {
  id: string;
  ordinalPosition?: number;
  className?: string;
  label: ReactNode;
  testId?: string;
  children: ReactNode;
  noPadding?: boolean;
  contentProps?: FlexProps;
}

export interface TabsContextProps {
  isValid: boolean;
  upsertTab(props: UpsertTabProps): void;
  removeTab(id: string): void;
}

export const TabsContext = createContext<TabsContextProps>({
  isValid: false,
  upsertTab: () => void 0,
  removeTab: () => void 0,
});