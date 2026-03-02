import type { ReactNode } from 'react';
import { createContext } from 'react';

export interface WindowContextProps {
  id: string;
  managerId: string;
  /** Set by WindowRenderer when inside a window. Used by useWindow() with no args. */
  setTitle?: (title: ReactNode) => void;
  /** Set by WindowRenderer when inside a window. Used by useWindow() with no args. */
  close?: (response?: unknown) => Promise<void>;
  /** Current title from context (managed by WindowRenderer). Window uses this when set. */
  title?: ReactNode;
}

export const WindowContext = createContext<WindowContextProps>({ id: 'invalid', managerId: 'invalid' });

// export interface WindowContextProps {
//   id: string;
//   index: number;
//   isFocused: boolean;
// }
// export const WindowContext = createContext<WindowContextProps>({
//   id: '',
//   index: 0,
//   isFocused: false,
// });
