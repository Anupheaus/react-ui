import { createContext } from 'react';
import type { TabButtonProps, TabContentProps } from './Tab';

export interface UpsertTabProps {
  id: string;
  hasLabel: boolean;
  Button(props: TabButtonProps): JSX.Element;
  Content(props: TabContentProps): JSX.Element;
}

export interface TabsContextProps {
  isValid: boolean;
  upsertTab(props: UpsertTabProps): void;
}

export const TabsContext = createContext<TabsContextProps>({
  isValid: false,
  upsertTab: () => void 0,
});