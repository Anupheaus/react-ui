import { createContext } from 'react';

export interface StorybookContextProps {
  isTestBorderVisible: boolean;
}

export const StorybookContext = createContext<StorybookContextProps>({
  isTestBorderVisible: true,
});
