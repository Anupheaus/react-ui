import { createContext } from 'react';

export interface StorybookContextProps {
  isTestBorderVisible: boolean;
  registerHookExecutor: (register: (delegate: (renderCount: number) => void) => void) => void;
}

export const StorybookContext = createContext<StorybookContextProps>({
  isTestBorderVisible: true,
  registerHookExecutor: () => void 0,
});
