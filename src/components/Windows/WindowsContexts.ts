import type { DOMAttributes, ReactNode } from 'react';
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

/** Provided by Window around its header slot only. Consumed by WindowHeader to render the titlebar with the window's wiring. */
export interface WindowHeaderContextProps {
  /** The `title` prop given to the Window; a Header `title` and a `setTitle` title both take precedence over it. */
  title?: ReactNode;
  /** The `icon` prop given to the Window; a Header `icon` takes precedence over it. */
  icon?: ReactNode;
  /** The window controls and maximize/restore/close buttons, pinned to the end of the titlebar. */
  endAdornment: ReactNode;
  /** Drag-handle props spread onto the titlebar so the window can be moved by it. */
  dragTargetProps: Partial<DOMAttributes<HTMLElement>>;
}

export const WindowHeaderContext = createContext<WindowHeaderContextProps | undefined>(undefined);

/** Provided by InternalWindows (Windows). Consumed by useWindow to resolve manager when managerId is omitted. */
export const WindowsManagerContext = createContext<string | undefined>(undefined);

/** Provided by InternalWindows (Dialogs). Consumed by useDialog to resolve manager when managerId is omitted. */
export const DialogsManagerContext = createContext<string | undefined>(undefined);
