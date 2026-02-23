import type { ComponentType } from 'react';
import { is, type DeferredPromise } from '@anupheaus/common';
import type { Window, WindowAction, WindowContent, WindowOkAction } from './Window';
import type { ReactUIComponent } from '../Component';
import type { ActionsToolbar } from '../ActionsToolbar';

export interface InitialWindowState {
  isMaximized?: boolean;
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
}

export namespace InitialWindowState {
  export function isState(target: unknown): target is InitialWindowState {
    if (!is.plainObject(target)) return false;
    const template: Required<InitialWindowState> = { isMaximized: false, x: 0, y: 0, width: 0, height: 0 };
    return Object.entries(template).some(([key, value]) => {
      if (Reflect.has(target, key) && typeof target[key] === typeof value) return true;
      return false;
    });
  }
}

export interface WindowState<Args extends unknown[] = any> extends InitialWindowState {
  id: string;
  definitionId: string;
  /** Window type name from createWindow - used to look up definition from global registry when restoring from storage */
  windowTypeName?: string;
  managerId?: string;
  args: Args;
  closingResponse?: unknown;
  isPersistable?: boolean;
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

export interface WindowDefinitionUtils<CloseResponseType = string | undefined> {
  Content: typeof WindowContent;
  Actions: typeof ActionsToolbar;
  Window: typeof Window | ComponentType<any>;
  Action: typeof WindowAction;
  OkButton: typeof WindowOkAction;
  id: string;
  close(response?: CloseResponseType): Promise<void>;
}

export type WindowDefinition<Args extends unknown[] = any, CloseResponseType = string | undefined> =
  (utils: WindowDefinitionUtils<CloseResponseType>) => (...args: Args) => JSX.Element | null;

/** Definition with props-through-component: (utils) => (props) => (args) => JSX */
export type WindowDefinitionWithProps<Props extends {} = {}, Args extends unknown[] = any, CloseResponseType = string | undefined> =
  (utils: WindowDefinitionUtils<CloseResponseType>) => (props: Props) => (...args: Args) => JSX.Element | null;

export interface WindowDefinitionProps {
  doNotPersist?: boolean;
  /** When provided (e.g. for dialogs), used instead of Window for rendering. */
  windowComponent?: ComponentType<any>;
  /** Internal: passed by useWindow/useDialog. */
  definitionId?: string;
  /** Internal: passed by useWindow/useDialog. */
  managerId?: string;
}

export type UseWindowApiWithId<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  { [key in `open${Name}`]: (id: string, ...args: [...Args, initialState?: InitialWindowState]) => Promise<CloseResponseType>; } &
  { [key in `close${Name}`]: (id: string, response?: CloseResponseType) => Promise<void>; } &
  { [key in `focus${Name}`]: (id: string) => Promise<void>; } &
  { [key in `restore${Name}`]: (id: string) => Promise<void>; } &
  { [key in `maximize${Name}`]: (id: string) => Promise<void>; } &
  { [key in Name]: ReactUIComponent<(props: WindowDefinitionProps) => JSX.Element>; };

export type UseWindowApi<Name extends string, Args extends unknown[], CloseResponseType = string | undefined, WindowProps extends {} = {}> =
  { [key in `open${Name}`]: (...args: [...Args, initialState?: InitialWindowState]) => Promise<CloseResponseType>; } &
  { [key in `close${Name}`]: (response?: CloseResponseType) => Promise<void>; } &
  { [key in `focus${Name}`]: () => Promise<void>; } &
  { [key in `restore${Name}`]: () => Promise<void>; } &
  { [key in `maximize${Name}`]: () => Promise<void>; } &
  { [key in Name]: ReactUIComponent<(props: WindowDefinitionProps & WindowProps) => JSX.Element>; };

/** useDialog return type - single instance per hook, open(args) only. */
export type UseDialogApi<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  { [key in `open${Name}`]: (...args: Args) => Promise<CloseResponseType>; } &
  { [key in `close${Name}`]: (response?: CloseResponseType) => Promise<void>; } &
  { [key in `focus${Name}`]: () => Promise<void>; } &
  { [key in `restore${Name}`]: () => Promise<void>; } &
  { [key in `maximize${Name}`]: () => Promise<void>; };

/** useWindow(definition, id) return type - id at hook level, open(args) only. */
export type UseWindowApiCommands<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  { [key in `open${Name}`]: (...args: [...Args, initialState?: InitialWindowState]) => Promise<CloseResponseType>; } &
  { [key in `close${Name}`]: (response?: CloseResponseType) => Promise<void>; } &
  { [key in `focus${Name}`]: () => Promise<void>; } &
  { [key in `restore${Name}`]: () => Promise<void>; } &
  { [key in `maximize${Name}`]: () => Promise<void>; };

/** useWindow(definition) return type - id required in open, open(id, args). */
export type UseWindowApiCommandsWithId<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> =
  { [key in `open${Name}`]: (id: string, ...args: [...Args, initialState?: InitialWindowState]) => Promise<CloseResponseType>; } &
  { [key in `close${Name}`]: (id: string, response?: CloseResponseType) => Promise<void>; } &
  { [key in `focus${Name}`]: (id: string) => Promise<void>; } &
  { [key in `restore${Name}`]: (id: string) => Promise<void>; } &
  { [key in `maximize${Name}`]: (id: string) => Promise<void>; };

export type ReactUIWindow<Name extends string = string, Args extends unknown[] = unknown[], CloseResponseType = string | undefined> = ReactUIComponent<() => JSX.Element> & {
  name: Name,
  args: Args;
  argsLength: number;
  definitionId: string;
  closeResponseType: CloseResponseType;
};

/** Window that can only be used with useDialog, never useWindow (e.g. confirmation dialogs). */
export type ReactUIDialogOnlyWindow<Name extends string = string, Args extends unknown[] = unknown[], CloseResponseType = string | undefined> =
  ReactUIWindow<Name, Args, CloseResponseType> & { readonly dialogOnly: true };

/** Window that can be used with useWindow. Excludes dialog-only definitions. */
export type ReactUIWindowOnly<Name extends string = string, Args extends unknown[] = unknown[], CloseResponseType = string | undefined> =
  ReactUIWindow<Name, Args, CloseResponseType> & { dialogOnly?: false };