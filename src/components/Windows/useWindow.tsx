import type { AnyFunction } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { ReactUIWindowOnly, UseWindowApiCommands, UseWindowApiCommandsWithId } from './WindowsModels';
import { InitialWindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useRef } from 'react';
import { useBound, useId } from '../../hooks';

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

export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(props: Props<Name, Args, CloseResponseType>): UseWindowApiCommands<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(window: ReactUIWindowOnly<Name, Args, CloseResponseType>,
  id: string): UseWindowApiCommands<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  window: ReactUIWindowOnly<Name, Args, CloseResponseType>): UseWindowApiCommandsWithId<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(...args: unknown[]) {
  const hookId = useId();
  const { id: providedId, window, managerId: providedManagerId } = getProps<Name, Args>(args);
  if ((window as { dialogOnly?: boolean }).dialogOnly === true) {
    throw new Error(`Window "${window.name}" is dialog-only and cannot be used with useWindow. Use useDialog instead.`);
  }
  const id = providedId ?? hookId;
  const lastOpenedWindowIdRef = useRef<string>(id);

  const getManager = () => WindowsManager.getManagerForType('windows', providedManagerId);

  const executeSimpleMethod = useBound(async (funcName: keyof WindowsManager, targetId?: string) => {
    const manager = getManager();
    return (manager[funcName] as AnyFunction)(targetId ?? lastOpenedWindowIdRef.current ?? id);
  });

  const openWindow = useBound(async (...openArgs: unknown[]) => {
    const manager = getManager();
    const managerId = manager.id;
    let explicitId: string;
    let args: Args;
    if (providedId != null) {
      explicitId = id;
      args = openArgs as Args;
    } else {
      if (openArgs.length === 0 || typeof openArgs[0] !== 'string') {
        throw new Error(`useWindow(definition) requires id as first argument to open. Got: ${JSON.stringify(openArgs[0])}`);
      }
      explicitId = openArgs.shift() as string;
      args = openArgs as Args;
    }
    let initialState = (args.length > window.argsLength ? (args as unknown[]).pop() : undefined) as InitialWindowState;
    if (!InitialWindowState.isState(initialState)) {
      if (initialState !== undefined) (args as unknown[]).push(initialState);
      initialState = {};
    }
    const windowId = explicitId;
    lastOpenedWindowIdRef.current = windowId;
    return manager.open({
      id: windowId,
      definitionId: windowId,
      windowTypeName: window.name,
      managerId,
      args,
      ...initialState,
    });
  });

  const closeWindow = useBound(async (reasonOrId?: CloseResponseType | string, reason?: CloseResponseType) => {
    const manager = getManager();
    const targetId = providedId != null
      ? (lastOpenedWindowIdRef.current ?? id)
      : (typeof reasonOrId === 'string' ? reasonOrId : (lastOpenedWindowIdRef.current ?? id));
    const closeReason = providedId != null ? reasonOrId : (typeof reasonOrId === 'string' ? reason : reasonOrId);
    return manager.close(targetId, closeReason);
  });

  const focusWindow = useBound(async (targetId?: string) => executeSimpleMethod('focus', targetId));
  const restoreWindow = useBound(async (targetId?: string) => executeSimpleMethod('restore', targetId));
  const maximizeWindow = useBound(async (targetId?: string) => executeSimpleMethod('maximize', targetId));

  return {
    [`open${window.name}`]: openWindow,
    [`close${window.name}`]: closeWindow,
    [`focus${window.name}`]: focusWindow,
    [`restore${window.name}`]: restoreWindow,
    [`maximize${window.name}`]: maximizeWindow,
  } as UseWindowApiCommands<Name, Args, CloseResponseType> | UseWindowApiCommandsWithId<Name, Args, CloseResponseType>;
}