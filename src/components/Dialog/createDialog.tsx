import { createWindow } from '../Windows/createWindow';
import { type WindowDefinition, type WindowDefinitionUtils } from '../Windows';
import { useWindow } from '../Windows/useWindow';
import { Dialog } from './Dialog';
import { useId, useOnUnmount, useTimeout } from '../../hooks';
import { useContext, useMemo, useRef } from 'react';
import { DialogsManagerIdContext } from './DialogsContext';
import type { UseDialogApi } from './DialogModels';
import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';
import type { AnyObject } from '@anupheaus/common';
import { PromiseState } from '@anupheaus/common';
import { WindowsManager } from '../Windows/WindowsManager';

export interface DialogDefinitionUtils extends Omit<WindowDefinitionUtils, 'Window'> {
  Dialog: typeof Dialog;
}

type DialogDefinition<Args extends unknown[]> = (utils: DialogDefinitionUtils) => ReturnType<WindowDefinition<Args>>;

export function createDialog<Name extends string, Args extends unknown[]>(name: Name, dialogDefinition: DialogDefinition<Args>) {
  const windowDefinition: WindowDefinition<Args> = ({ Window: ignored, ...rest }) => dialogDefinition({ Dialog, ...rest });
  const Window = createWindow(name, windowDefinition);

  const openDialogName = `open${name}`;
  const closeDialogName = `close${name}`;

  return () => {
    const id = useId();
    const closeRef = useRef<(reason?: string) => void>(() => void 0);
    const windowApiRef = useRef(useMemo(() => Promise.createDeferred<AnyObject>(), []));
    const isUnmounted = useOnUnmount();

    useTimeout(() => {
      if (isUnmounted()) return;
      if (windowApiRef.current.state === PromiseState.Pending) windowApiRef.current.reject(new Error(`Dialog "${id}" not rendered.`));
    }, 5000);

    const openDialog = async (...args: unknown[]) => {
      const api = await windowApiRef.current;
      return new Promise(resolve => {
        api[openDialogName](...args);
        closeRef.current = resolve;
      });
    };

    const closeDialog = async (...args: unknown[]) => {
      const api = await windowApiRef.current;
      api[closeDialogName](...args);
    };

    const DialogComponent = useMemo(() => createComponent(name, () => {
      const managerId = useContext(DialogsManagerIdContext);
      const manager = WindowsManager.get(managerId);
      const windowApi = useWindow({ window: Window, id, managerId, instanceId: id });
      const WindowComponent = windowApi[name] as unknown as ReactUIComponent;
      useMemo(() => { windowApiRef.current.resolve(windowApi); }, []);

      const unsubscribe = useMemo(() => manager.subscribeToStateChanges(id, (state, reason) => {
        if (reason === 'remove') closeRef.current?.(state.closingReason);
      }), [id]);

      useOnUnmount(unsubscribe);

      return <WindowComponent />;
    }), []);

    return {
      [openDialogName]: openDialog,
      [closeDialogName]: closeDialog,
      [name]: DialogComponent,
    } as UseDialogApi<Name, Args>;
  };
}
