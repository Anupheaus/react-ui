import type { DeferredPromise } from '@anupheaus/common';
import type { Window, WindowAction, WindowActions, WindowContent, WindowOkAction } from './Window';
import type { ReactUIComponent } from '../Component';

export interface InitialWindowState {
  isMaximized?: boolean;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  isPersistable?: boolean;
}

export interface WindowState<Args extends unknown[] = any> extends InitialWindowState {
  id: string;
  definitionId: string;
  definitionInstanceId?: string;
  args: Args;
  closingReason?: string;
}

export type NewWindowState = Omit<WindowState, 'id'> & { id?: string; };

export interface WindowEvents {
  id: string;
  allowClosing?: DeferredPromise;
  closing?: DeferredPromise;
  restoring?: DeferredPromise;
  maximizing?: DeferredPromise;
  focusing?: DeferredPromise;
  opening?: DeferredPromise;
}

export type InitialWindowPosition = 'center';

export interface WindowDefinitionUtils {
  Content: typeof WindowContent;
  Actions: typeof WindowActions;
  Window: typeof Window;
  Action: typeof WindowAction;
  OkButton: typeof WindowOkAction;
  id: string;
  close(reason?: string): Promise<void>;
  // CancelButton: typeof DialogAction;
}

export type WindowDefinition<Args extends unknown[] = any> =
  (utils: WindowDefinitionUtils) => (...args: Args) => JSX.Element | null;

export interface WindowDefinitionProps {
  instanceId?: string;
}

export type UseWindowApiWithId<Name extends string, Args extends unknown[]> =
  { [key in `open${Name}`]: (id: string, ...args: [...Args, initialState?: InitialWindowState]) => Promise<string | undefined>; } &
  { [key in `close${Name}`]: (id: string, reason?: string) => Promise<void>; } &
  { [key in `focus${Name}`]: (id: string) => Promise<void>; } &
  { [key in `restore${Name}`]: (id: string) => Promise<void>; } &
  { [key in `maximize${Name}`]: (id: string) => Promise<void>; } &
  { [key in Name]: ReactUIComponent<(props: WindowDefinitionProps) => JSX.Element>; };

export type UseWindowApi<Name extends string, Args extends unknown[]> =
  { [key in `open${Name}`]: (...args: [...Args, initialState?: InitialWindowState]) => Promise<string | undefined>; } &
  { [key in `close${Name}`]: (reason?: string) => Promise<void>; } &
  { [key in `focus${Name}`]: () => Promise<void>; } &
  { [key in `restore${Name}`]: () => Promise<void>; } &
  { [key in `maximize${Name}`]: () => Promise<void>; } &
  { [key in Name]: ReactUIComponent<(props: WindowDefinitionProps) => JSX.Element>; };

export type ReactUIWindow<Name extends string = string, Args extends unknown[] = unknown[]> = ReactUIComponent<() => JSX.Element> & {
  name: Name,
  args: Args;
  argsLength: number;
  definitionId: string;
};