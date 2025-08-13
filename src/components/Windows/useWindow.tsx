import type { AnyFunction } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { InitialWindowState, ReactUIWindow, UseWindowApi, UseWindowApiWithId, WindowDefinitionProps } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useContext, useMemo, useRef } from 'react';
import { WindowManagerIdContext } from './WindowsContexts';
import { useBound, useId } from '../../hooks';
import { createComponent } from '../Component';

interface Props<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> {
  id?: string;
  window: ReactUIWindow<Name, Args, CloseResponseType>;
  managerId?: string;
}

// interface PropsWithId<Name extends string, Args extends unknown[]> extends Props<Name, Args> {
//   id: string;
// }

function getProps<Name extends string, Args extends unknown[]>(args: unknown[]): { window: ReactUIWindow<Name, Args>, id?: string, managerId?: string; } {
  if (args.length === 0) throw new Error('No arguments have been provided to the useWindow hook.');
  let id: string | undefined;
  if (args.length > 1) id = args[1] as string;
  if (is.reactComponent(args[0])) return { window: args[0] as unknown as ReactUIWindow<Name, Args>, id, managerId: undefined };
  return args[0] as any;
}

export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(props: Props<Name, Args, CloseResponseType>): UseWindowApi<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(window: ReactUIWindow<Name, Args, CloseResponseType>,
  id: string): UseWindowApi<Name, Args, CloseResponseType>;
// eslint-disable-next-line max-len
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(window: ReactUIWindow<Name, Args, CloseResponseType>): UseWindowApiWithId<Name, Args, CloseResponseType>;
export function useWindow<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(...args: unknown[]) {
  const hookId = useId();
  const { id: providedId, window, managerId: providedManagerId } = getProps<Name, Args>(args);
  const id = providedId ?? hookId;
  const definitionIdRef = useRef<string>(window.name);
  const contextManagerId = useContext(WindowManagerIdContext);
  const managerId = providedManagerId ?? contextManagerId;

  const executeSimpleMethod = async (funcName: keyof WindowsManager) => {
    const manager = WindowsManager.get(managerId);
    return (manager[funcName] as AnyFunction)(id);
  };

  const openWindow = useBound(async (...openArgs: Args) => {
    const manager = WindowsManager.get(managerId);
    const windowId = (openArgs.length > window.argsLength && providedId == null ? openArgs.shift() as string : undefined) ?? id;
    const initialState = (openArgs.length > window.argsLength ? openArgs.pop() : {}) as InitialWindowState;
    return manager.open({ id: windowId, definitionId: definitionIdRef.current, managerId, args: openArgs, ...initialState });
  });

  const closeWindow = useBound(async (reason: CloseResponseType | undefined) => {
    const manager = WindowsManager.get(managerId);
    return manager.close(id, reason);
  });

  const focusWindow = useBound(async () => executeSimpleMethod('focus'));
  const restoreWindow = useBound(async () => executeSimpleMethod('restore'));
  const maximizeWindow = useBound(async () => executeSimpleMethod('maximize'));

  const InstancedWindow = useMemo(() => createComponent(window.name, (props: WindowDefinitionProps) => {
    definitionIdRef.current = id;
    const Window = window as ((props: WindowDefinitionProps) => JSX.Element);
    return <Window {...props} doNotPersist={props.doNotPersist !== false} {...{ definitionId: id }} />;
  }), [window.name]);

  return {
    [`open${window.name}`]: openWindow,
    [`close${window.name}`]: closeWindow,
    [`focus${window.name}`]: focusWindow,
    [`restore${window.name}`]: restoreWindow,
    [`maximize${window.name}`]: maximizeWindow,
    [window.name]: InstancedWindow,
  } as UseWindowApiWithId<Name, Args, CloseResponseType> | UseWindowApi<Name, Args, CloseResponseType>;
}