import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import { createComponent } from '../Component';
import type { WindowDefinitionUtils } from './WindowsModels';
import { type WindowDefinition } from './WindowsModels';
import { Window, WindowActions, WindowContent, WindowOkAction } from './Window';
import { WindowAction } from './Window/WindowAction';
import type { WindowDefinitionState } from './InternalWindowModels';
import { WindowsManager } from './WindowsManager';
import { useBound } from '../../hooks';
import type { WindowRenderContextProps } from './WindowsContexts';
import { WindowRenderContext } from './WindowsContexts';
import { createPortal } from 'react-dom';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> extends WindowDefinitionState {
  definition: WindowDefinition<Args, CloseResponseType>;
  /** When provided (e.g. for dialogs), used instead of Window in utils. */
  windowComponent?: ComponentType<any>;
}

export const WindowRenderer = createComponent('WindowRenderer', <Args extends unknown[], CloseResponseType = string | undefined>({
  windowId,
  managerId,
  definition,
  windowComponent: WindowOrDialog = Window,
}: Props<Args, CloseResponseType>) => {
  const manager = WindowsManager.get(managerId);
  const args = manager.getArgs<Args>(windowId);
  const [element, setElement] = useState<HTMLElement>();
  const close = useBound((response?: CloseResponseType) => manager.close(windowId, response));
  const [title, setTitle] = useState<ReactNode | undefined>(undefined);
  const utils = useMemo<WindowDefinitionUtils<CloseResponseType>>(() => ({
    id: windowId,
    Window: WindowOrDialog,
    Content: WindowContent,
    Actions: WindowActions,
    Action: WindowAction,
    OkButton: WindowOkAction,
    close,
  }), [windowId, WindowOrDialog]);

  const setTitleStable = useBound((newTitle: ReactNode) => setTitle(newTitle));
  const closeWithUnknown = useBound((response?: unknown) => close(response as CloseResponseType));
  const context = useMemo<WindowRenderContextProps>(() => ({
    id: windowId,
    managerId,
    close: closeWithUnknown,
    setTitle: setTitleStable,
    title,
  }), [windowId, managerId, closeWithUnknown, setTitleStable, title]);

  const firstCall = definition(utils);
  const content: JSX.Element | null = typeof firstCall === 'function'
    ? (firstCall as (...a: unknown[]) => JSX.Element | null)(...(args as unknown[]))
    : firstCall as JSX.Element | null;

  useLayoutEffect(() => {
    let stopFindingElement = false;
    const timeStarted = Date.now();
    const findElement = () => {
      const foundElement = document.getElementById(managerId);
      if (foundElement != null) { setElement(foundElement); return; }
      if (stopFindingElement) return;
      if (Date.now() - timeStarted > 5000) throw new Error(`Could not find Windows component with id "${managerId}".`);
      setTimeout(findElement, 100);
    };

    findElement();

    return () => {
      stopFindingElement = true;
    };
  }, []);

  if (element == null) return null;

  return (
    <WindowRenderContext.Provider value={context}>
      {createPortal(content, element)}
    </WindowRenderContext.Provider>
  );
});