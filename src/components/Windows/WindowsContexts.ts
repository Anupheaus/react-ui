import { createContext, ReactNode } from 'react';
import { WindowProps } from './WindowRenderer';
import { WindowApi, WindowState } from './WindowsModels';

export interface WindowsContextWindowEvent {
  type: 'updated' | 'closed';
  state: WindowState;
}

export interface WindowsContextsUseWindowApi {
  addWindow(window: ReactNode): Promise<WindowApi>;
}

export type WindowsContextsRegisterWindow = (props: WindowProps, registerApi: (api: WindowApi) => void) => void;

export type WindowsContextsUpdateStates = (newStates: WindowState[]) => void;

export const WindowsContexts = {
  windows: createContext<ReactNode[]>([]),
  registerApi: createContext<(api: WindowApi) => void>(() => void 0),
  registerWindow: createContext<WindowsContextsRegisterWindow>(() => void 0),
  useWindows: createContext<WindowsContextsUseWindowApi>({ addWindow: () => Promise.resolve({} as WindowApi) }),
  initialStates: createContext<WindowState[]>([]),
  stateUpdates: createContext<WindowsContextsUpdateStates>(() => void 0),
};
