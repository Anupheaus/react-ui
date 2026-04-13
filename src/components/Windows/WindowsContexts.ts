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

/** Provided by InternalWindows (Windows). Consumed by useWindow to resolve manager when managerId is omitted. */
export const WindowsManagerContext = createContext<string | undefined>(undefined);

/** Provided by InternalWindows (Dialogs). Consumed by useDialog to resolve manager when managerId is omitted. */
export const DialogsManagerContext = createContext<string | undefined>(undefined);
