import type { AnyFunction } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { ReactUIWindowOnly, UseWindowApiCommands, UseWindowApiCommandsWithId, UseWindowCurrentWindowUtils } from './WindowsModels';
import { InitialWindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useContext, useRef } from 'react';
import { useBound, useId } from '../../hooks';
import { WindowRenderContext, WindowsManagerContext, DialogsManagerContext } from './WindowsContexts';
import { useDevice } from '../../theme/useDevice';

interface Props<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> {
  id?: string;
  window: ReactUIWindowOnly<Name, Args, CloseResponseType>;
  managerId?: string;
}

function getProps<Name extends string, Args extends unknown[]>(args: unknown[]): { window: ReactUIWindowOnly<Name, Args>, id?: string, managerId?: string; } {
  if (args.length === 0) throw new Error('No arguments have been provided to the useWindow hook.');
  let id: string | undefined;
  if (args.length > 1) id = args[1] as string;
  if (is.reactComponent(args[0])) return { window: args[0] as unknown as ReactUIWindowOnly<Name, Args>, id, managerId: undefined };
  return args[0] as any;
}

export function useWindow(): UseWindowCurrentWindowUtils;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(props: Props<Name, Args, CloseResponseType>): UseWindowApiCommands<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(window: ReactUIWindowOnly<Name, Args, CloseResponseType>,
  id: string): UseWindowApiCommands<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  window: ReactUIWindowOnly<Name, Args, CloseResponseType>): UseWindowApiCommandsWithId<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(...args: unknown[]) {
  if (args.length === 0) {
    // eslint-disable-next-line react-hooks/rules-of-hooks -- overloaded hook; each call site consistently uses the no-args form, so hook order is stable per usage
    const { setTitle, close } = useContext(WindowRenderContext);
    if (setTitle == null || close == null) {
      throw new Error('useWindow() with no arguments must be called from within window content. Ensure the component is rendered inside a window created with createWindow.');
    }
    return { setTitle, close } as UseWindowCurrentWindowUtils;
  }
  // The hooks below run only in the args form of this overloaded hook; each call site consistently uses one form, so hook order is stable per usage.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hookId = useId();
  const { id: providedId, window, managerId: providedManagerId } = getProps<Name, Args>(args);
  if ((window as { dialogOnly?: boolean; }).dialogOnly === true) {
    throw new Error(`Window "${window.name}" is dialog-only and cannot be used with useWindow. Use useDialog instead.`);
  }
  const id = providedId ?? hookId;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const lastOpenedWindowIdRef = useRef<string>(id);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contextManagerId = useContext(WindowsManagerContext);
  const effectiveManagerId = providedManagerId ?? contextManagerId;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const device = useDevice();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const contextDialogsManagerId = useContext(DialogsManagerContext);

  const getManager = () => device === 'mobile'
    ? WindowsManager.getManagerForType('dialogs', contextDialogsManagerId)
    : WindowsManager.getManagerForType('windows', effectiveManagerId);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const executeSimpleMethod = useBound(async (funcName: keyof WindowsManager, targetId?: string) => {
    const manager = getManager();
    return (manager[funcName] as AnyFunction)(targetId ?? lastOpenedWindowIdRef.current ?? id);
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const openWindow = useBound(async (...openArgs: unknown[]) => {
    const manager = getManager();
    const managerId = manager.id;
    let explicitId: string;
    let innerArgs: Args;
    if (providedId != null) {
      explicitId = id;
      innerArgs = openArgs as Args;
    } else {
      if (openArgs.length === 0 || typeof openArgs[0] !== 'string') {
        throw new Error(`useWindow(definition) requires id as first argument to open. Got: ${JSON.stringify(openArgs[0])}`);
      }
      explicitId = openArgs.shift() as string;
      innerArgs = openArgs as Args;
    }
    let initialState = (innerArgs.length > window.argsLength ? (innerArgs as unknown[]).pop() : undefined) as InitialWindowState;
    if (!InitialWindowState.isState(initialState)) {
      if (initialState !== undefined) (innerArgs as unknown[]).push(initialState);
      initialState = {};
    }
    const windowId = explicitId;
    lastOpenedWindowIdRef.current = windowId;
    return manager.open({
      id: windowId,
      definitionId: windowId,
      windowTypeName: window.name,
      managerId,
      args: innerArgs,
      ...initialState,
    });
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const closeWindow = useBound(async (reasonOrId?: CloseResponseType | string, reason?: CloseResponseType) => {
    const manager = getManager();
    const targetId = providedId != null
      ? (lastOpenedWindowIdRef.current ?? id)
      : (typeof reasonOrId === 'string' ? reasonOrId : (lastOpenedWindowIdRef.current ?? id));
    const closeReason = providedId != null ? reasonOrId : (typeof reasonOrId === 'string' ? reason : reasonOrId);
    return manager.close(targetId, closeReason);
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const focusWindow = useBound(async (targetId?: string) => executeSimpleMethod('focus', targetId));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const restoreWindow = useBound(async (targetId?: string) => executeSimpleMethod('restore', targetId));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const maximizeWindow = useBound(async (targetId?: string) => executeSimpleMethod('maximize', targetId));

  return {
    [`open${window.name}`]: openWindow,
    [`close${window.name}`]: closeWindow,
    [`focus${window.name}`]: focusWindow,
    [`restore${window.name}`]: restoreWindow,
    [`maximize${window.name}`]: maximizeWindow,
  } as UseWindowApiCommands<Name, Args, CloseResponseType> | UseWindowApiCommandsWithId<Name, Args, CloseResponseType>;
}