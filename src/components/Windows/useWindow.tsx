import type { AnyFunction } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { InitialWindowState, ReactUIWindow, UseWindowApi, UseWindowApiWithId, WindowDefinitionProps } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useContext, useMemo, useRef } from 'react';
import { WindowManagerIdContext } from './WindowsContexts';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';

interface Props<Name extends string, Args extends unknown[]> {
  window: ReactUIWindow<Name, Args>;
  managerId?: string;
  /** The instance id applied to the rendered window. */
  instanceId?: string;
}

interface PropsWithId<Name extends string, Args extends unknown[]> extends Props<Name, Args> {
  id: string;
}

function getProps<Name extends string, Args extends unknown[]>(args: unknown[]): { window: ReactUIWindow<Name, Args>, id?: string, managerId?: string; instanceId?: string; } {
  if (args.length === 0) throw new Error('No arguments have been provided to the useWindow hook.');
  let id: string | undefined;
  if (args.length > 1) id = args[1] as string;
  if (is.reactComponent(args[0])) return { window: args[0] as unknown as ReactUIWindow<Name, Args>, id, managerId: undefined, instanceId: undefined };
  return args[0] as any;
}

export function useWindow<Name extends string, Args extends unknown[]>(props: Props<Name, Args>): UseWindowApiWithId<Name, Args>;
export function useWindow<Name extends string, Args extends unknown[]>(props: PropsWithId<Name, Args>): UseWindowApi<Name, Args>;
export function useWindow<Name extends string, Args extends unknown[]>(window: ReactUIWindow<Name, Args>): UseWindowApiWithId<Name, Args>;
export function useWindow<Name extends string, Args extends unknown[]>(window: ReactUIWindow<Name, Args>, id: string): UseWindowApi<Name, Args>;
export function useWindow<Name extends string, Args extends unknown[]>(...args: unknown[]) {
  const { window, id, managerId, instanceId: definitionInstanceId } = getProps<Name, Args>(args);
  const definitionInstanceIdRef = useRef(definitionInstanceId ?? 'default');
  const contextManagerId = useContext(WindowManagerIdContext);
  const hasId = is.string(id);
  if (hasId && id.length === 0) throw new Error(`An empty window id has been provided for "${window.name}".`);

  if (definitionInstanceId != null && definitionInstanceIdRef.current !== definitionInstanceId) definitionInstanceIdRef.current = definitionInstanceId;

  const executeSimpleMethod = async (providedId: string | undefined, funcName: keyof WindowsManager) => {
    const manager = WindowsManager.get(managerId ?? contextManagerId);
    const localId = providedId ?? id;
    if (localId == null) throw new Error(`No window id has been provided for "${window.name}".`);
    return (manager[funcName] as AnyFunction)(localId);
  };

  const openWindow = useBound(async (...openArgs: Args) => {
    const manager = WindowsManager.get(managerId ?? contextManagerId);
    const localId = hasId ? id : openArgs.shift() as string;
    const initialState = (openArgs.length > window.argsLength ? openArgs.pop() : {}) as InitialWindowState;
    return manager.open({ id: localId, definitionId: window.definitionId, definitionInstanceId: definitionInstanceIdRef.current, args: openArgs, ...initialState });
  });

  const closeWindow = useBound(async (...closeArgs: unknown[]) => {
    const manager = WindowsManager.get(managerId ?? contextManagerId);
    const localId = hasId ? id : closeArgs.shift() as string;
    const reason = closeArgs.shift() as string | undefined;
    if (localId == null) throw new Error(`No window id has been provided when closing "${window.name}".`);
    return manager.close(localId, reason);
  });

  const focusWindow = useBound(async (providedId?: string) => executeSimpleMethod(providedId, 'focus'));
  const restoreWindow = useBound(async (providedId?: string) => executeSimpleMethod(providedId, 'restore'));
  const maximizeWindow = useBound(async (providedId?: string) => executeSimpleMethod(providedId, 'maximize'));

  const makeDefinitionInstanceIdUnique = () => {
    if (definitionInstanceIdRef.current !== 'default') return;
    definitionInstanceIdRef.current = Math.uniqueId();
  };

  const InstancedWindow = useMemo(() => createComponent(window.name, ({ instanceId }: WindowDefinitionProps) => {
    const Window = window as ((props: WindowDefinitionProps) => JSX.Element);
    return <Window instanceId={instanceId ?? definitionInstanceIdRef.current} />;
  }), [window.name]);

  return {
    [`open${window.name}`]: openWindow,
    [`close${window.name}`]: closeWindow,
    [`focus${window.name}`]: focusWindow,
    [`restore${window.name}`]: restoreWindow,
    [`maximize${window.name}`]: maximizeWindow,
    get [window.name]() { makeDefinitionInstanceIdUnique(); return InstancedWindow; },
  } as UseWindowApiWithId<Name, Args> | UseWindowApi<Name, Args>;
}