import { createWindow } from '../Windows/createWindow';
import { type WindowDefinition, type WindowDefinitionUtils } from '../Windows';
import { useWindow } from '../Windows/useWindow';
import { Dialog } from './Dialog';
import { useBound, useId, useOnUnmount } from '../../hooks';
import { useContext, useMemo, useRef } from 'react';
import { DialogsManagerIdContext } from './DialogsContext';
import type { UseDialogApi } from './DialogModels';
import type { ReactUIComponent } from '../Component';
import { createComponent } from '../Component';
import type { AnyObject } from '@anupheaus/common';
import { WindowsManager } from '../Windows/WindowsManager';
import { WindowManagerIdContext } from '../Windows/WindowsContexts';

export interface DialogDefinitionUtils<CloseResponseType = string | undefined> extends Omit<WindowDefinitionUtils<CloseResponseType>, 'Window'> {
  Dialog: typeof Dialog;
}

type DialogDefinition<DialogProps extends {}, OpenArgs extends unknown[], CloseResponseType = string | undefined> =
  (utils: DialogDefinitionUtils<CloseResponseType>) => (props: DialogProps) => (...args: OpenArgs) => JSX.Element | null;

export function createDialog<Name extends string, DialogProps extends {}, OpenArgs extends unknown[], CloseResponseType = string | undefined>(name: Name,
  dialogDefinition: DialogDefinition<DialogProps, OpenArgs, CloseResponseType>) {
  const dialogProps = new Map<string, DialogProps>();
  const windowDefinition: WindowDefinition<OpenArgs, CloseResponseType> = ({ Window: ignored, id, ...rest }) => dialogDefinition({ Dialog, id, ...rest })(dialogProps.get(id) ?? {} as DialogProps);
  const Window = createWindow(name, windowDefinition);

  const openDialogName = `open${name}`;
  const closeDialogName = `close${name}`;

  return () => {
    const id = useId();
    const closeRef = useRef<(response?: CloseResponseType) => void>(() => void 0);
    const windowApiRef = useRef(useMemo(() => Promise.createDeferred<AnyObject>(), []));

    const openDialog = useBound(async (...args: unknown[]) => {
      const api = await windowApiRef.current;
      return new Promise(resolve => {
        api[openDialogName](...args);
        closeRef.current = resolve;
      });
    });

    const closeDialog = useBound(async (...args: unknown[]) => {
      const api = await windowApiRef.current;
      api[closeDialogName](...args);
    });

    const DialogComponent = useMemo(() => createComponent(name, (props: DialogProps) => {
      dialogProps.set(id, props);
      const managerId = useContext(DialogsManagerIdContext);
      const manager = WindowsManager.get(managerId);
      const windowApi = useWindow({ window: Window, id, managerId });
      const WindowComponent = windowApi[name] as unknown as ReactUIComponent;
      useMemo(() => { windowApiRef.current.resolve(windowApi); }, []);

      const unsubscribe = useMemo(() => manager.subscribeToStateChanges(id, (state, reason, hasChanged) => {
        if (reason === 'remove' && hasChanged) closeRef.current?.(state.closingResponse as CloseResponseType);
      }), [id]);

      useOnUnmount(unsubscribe);

      return (
        <WindowManagerIdContext.Provider value={managerId}>
          <WindowComponent />
        </WindowManagerIdContext.Provider>
      );
    }), []);

    return {
      [openDialogName]: openDialog,
      [closeDialogName]: closeDialog,
      [name]: DialogComponent,
    } as UseDialogApi<Name, DialogProps, OpenArgs, CloseResponseType>;
  };
}
