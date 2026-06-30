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
  // Every hook below is called unconditionally so the hook order is identical on every render regardless of
  // which overload is used. The no-args form simply ignores the window-command hooks it doesn't need; all of
  // them (useRef/useBound/useContext/useId/useDevice) are side-effect-free at call time, so creating them in
  // the no-args form is harmless. getProps is a plain function (not a hook), so calling it conditionally is fine.
  const currentWindowUtils = useContext(WindowRenderContext);
  const hookId = useId();
  const contextManagerId = useContext(WindowsManagerContext);
  const contextDialogsManagerId = useContext(DialogsManagerContext);
  const device = useDevice();

  const props = args.length > 0 ? getProps<Name, Args>(args) : undefined;
  const providedId = props?.id;
  const window = props?.window;
  const effectiveManagerId = props?.managerId ?? contextManagerId;
  const id = providedId ?? hookId;

  const lastOpenedWindowIdRef = useRef<string>(id);

  const getManager = () => device === 'mobile'
    ? WindowsManager.getManagerForType('dialogs', contextDialogsManagerId)
    : WindowsManager.getManagerForType('windows', effectiveManagerId);

  // The command closures below only ever run in the command (args) form, where `window` is defined — hence the
  // non-null assertions on it.
  const executeSimpleMethod = useBound(async (funcName: keyof WindowsManager, targetId?: string) => {
    const manager = getManager();
    return (manager[funcName] as AnyFunction)(targetId ?? lastOpenedWindowIdRef.current ?? id);
  });

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
    let initialState = (innerArgs.length > window!.argsLength ? (innerArgs as unknown[]).pop() : undefined) as InitialWindowState;
    if (!InitialWindowState.isState(initialState)) {
      if (initialState !== undefined) (innerArgs as unknown[]).push(initialState);
      initialState = {};
    }
    const windowId = explicitId;
    lastOpenedWindowIdRef.current = windowId;
    return manager.open({
      id: windowId,
      definitionId: windowId,
      windowTypeName: window!.name,
      managerId,
      args: innerArgs,
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

  // No-args form: return the current window's controls, available only from within window content.
  if (props == null) {
    const { setTitle, close } = currentWindowUtils;
    if (setTitle == null || close == null) {
      throw new Error('useWindow() with no arguments must be called from within window content. Ensure the component is rendered inside a window created with createWindow.');
    }
    return { setTitle, close } as UseWindowCurrentWindowUtils;
  }

  // Command form: validate the window definition and return its open/close/focus/restore/maximize commands.
  if ((window as { dialogOnly?: boolean; }).dialogOnly === true) {
    throw new Error(`Window "${window!.name}" is dialog-only and cannot be used with useWindow. Use useDialog instead.`);
  }

  return {
    [`open${window!.name}`]: openWindow,
    [`close${window!.name}`]: closeWindow,
    [`focus${window!.name}`]: focusWindow,
    [`restore${window!.name}`]: restoreWindow,
    [`maximize${window!.name}`]: maximizeWindow,
  } as UseWindowApiCommands<Name, Args, CloseResponseType> | UseWindowApiCommandsWithId<Name, Args, CloseResponseType>;
}
