import type { AnyFunction } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import type { ReactUIWindow, UseDialogApi } from '../Windows/WindowsModels';
import { WindowsManager } from '../Windows/WindowsManager';
import { useRef } from 'react';
import { useBound, useId } from '../../hooks';

interface Props<Name extends string, Args extends unknown[], CloseResponseType = string | undefined> {
  id?: string;
  window: ReactUIWindow<Name, Args, CloseResponseType>;
  managerId?: string;
}

function getProps<Name extends string, Args extends unknown[]>(args: unknown[]): { window: ReactUIWindow<Name, Args>, id?: string, managerId?: string; } {
  if (args.length === 0) throw new Error('No arguments have been provided to the useDialog hook.');
  let id: string | undefined;
  if (args.length > 1) id = args[1] as string;
  if (is.reactComponent(args[0])) return { window: args[0] as unknown as ReactUIWindow<Name, Args>, id, managerId: undefined };
  return args[0] as any;
}

export function useDialog<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(props: Props<Name, Args, CloseResponseType>): UseDialogApi<Name, Args, CloseResponseType>;
export function useDialog<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(window: ReactUIWindow<Name, Args, CloseResponseType>,
  id: string): UseDialogApi<Name, Args, CloseResponseType>;
export function useDialog<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(
  window: ReactUIWindow<Name, Args, CloseResponseType>): UseDialogApi<Name, Args, CloseResponseType>;
export function useDialog<Name extends string, Args extends unknown[], CloseResponseType = string | undefined>(...args: unknown[]) {
  const hookId = useId();
  const { id: providedId, window, managerId: providedManagerId } = getProps<Name, Args>(args);
  const id = providedId ?? hookId;
  const lastOpenedWindowIdRef = useRef<string>(id);

  const getManager = () => WindowsManager.getManagerForType('dialogs', providedManagerId);

  const executeSimpleMethod = useBound(async (funcName: keyof WindowsManager, targetId?: string) => {
    const manager = getManager();
    return (manager[funcName] as AnyFunction)(targetId ?? lastOpenedWindowIdRef.current ?? id);
  });

  const openDialog = useBound(async (...openArgs: Args): Promise<CloseResponseType> => {
    const dialogManager = getManager();
    const windowId = id;
    lastOpenedWindowIdRef.current = windowId;
    const result = new Promise<CloseResponseType>(resolve => {
      const unsub = dialogManager.subscribeToStateChanges(windowId, (state, reason, hasChanged) => {
        if (reason === 'remove' && hasChanged) {
          unsub();
          resolve(state.closingResponse as CloseResponseType);
        }
      });
    });
    await dialogManager.open({
      id: windowId,
      definitionId: windowId,
      windowTypeName: window.name,
      managerId: dialogManager.id,
      args: openArgs,
    });
    return result;
  });

  const closeDialog = useBound(async (response?: CloseResponseType) => {
    const dialogManager = getManager();
    const targetId = lastOpenedWindowIdRef.current ?? id;
    return dialogManager.close(targetId, response);
  });

  const api = {
    [`open${window.name}`]: openDialog,
    [`close${window.name}`]: closeDialog,
    [`focus${window.name}`]: useBound(async (targetId?: string) => executeSimpleMethod('focus', targetId)),
    [`restore${window.name}`]: useBound(async (targetId?: string) => executeSimpleMethod('restore', targetId)),
    [`maximize${window.name}`]: useBound(async (targetId?: string) => executeSimpleMethod('maximize', targetId)),
  };
  return api as UseDialogApi<Name, Args, CloseResponseType>;
}
