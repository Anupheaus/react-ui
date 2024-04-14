import { ReactNode, createContext } from 'react';
// import type { TabButtonProps, TabContentProps } from './Tab/Tab';

export interface UpsertTabProps {
  id: string;
  // hasLabel: boolean;
  ordinalPosition?: number;
  className?: string;
  label: ReactNode;
  children: ReactNode;

  // Button(props: TabButtonProps): JSX.Element;
  // Content(props: TabContentProps): JSX.Element;
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