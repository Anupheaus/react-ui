import type { ReactNode } from 'react';
import { createContext } from 'react';

/** Provided by WindowRenderer. Consumed by Window, useWindow(), WindowAction. */
export interface WindowRenderContextProps {
  id: string;
  managerId: string;
  setTitle?: (title: ReactNode) => void;
  close?: (response?: unknown) => Promise<void>;
  title?: ReactNode;
}

export const WindowRenderContext = createContext<WindowRenderContextProps>({ id: 'invalid', managerId: 'invalid' });

/** Provided by Window. Consumed by WindowContent (e.g. disableScrolling). */
export interface WindowContextProps {
  disableScrolling?: boolean;
}

export const WindowContext = createContext<WindowContextProps>({});
