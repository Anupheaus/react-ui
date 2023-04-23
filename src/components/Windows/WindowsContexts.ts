import { PromiseMaybe } from '@anupheaus/common';
import { createContext, ReactNode } from 'react';
import { WindowState } from './WindowsModels';

export type WindowsActionTypes = {
  close(): Promise<void>;
  focus(): Promise<void>;
  closed(): Promise<void>;
  updateOrdinal(index: number, isFocused: boolean): Promise<void>;
  updateState(state: WindowState): Promise<void>;
  open<T extends WindowState>(config: T): Promise<void>;
  add(id: string, content: ReactNode): Promise<void>;
  link(id: string, newId: string): Promise<void>;
};

export interface WindowsManagerContextProps {
  id: string;
  invoke<K extends keyof WindowsActionTypes>(id: string, action: K, ...args: Parameters<WindowsActionTypes[K]>): Promise<void>;
  onAction<K extends keyof WindowsActionTypes>(id: string, action: K, delegate: (...args: Parameters<WindowsActionTypes[K]>) => PromiseMaybe<void>): void;
  onAction<K extends keyof WindowsActionTypes>(action: K, delegate: (id: string, ...args: Parameters<WindowsActionTypes[K]>) => PromiseMaybe<void>): void;
}

export const WindowsManagerContext = createContext<Map<string, WindowsManagerContextProps>>(new Map());

export interface WindowsContextProps {
  isValid: boolean;
  states: WindowState[];
}

export const WindowsContext = createContext<WindowsContextProps>({
  isValid: false,
  states: [],
});

export const WindowIdContext = createContext<string | undefined>(undefined);
export const WindowsManagerIdContext = createContext<string | undefined>(undefined);
