import { useLayoutEffect, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import type { WindowDefinitionUtils } from './WindowsModels';
import { type WindowDefinition } from './WindowsModels';
import { Window, WindowActions, WindowContent, WindowOkAction } from './Window';
import { WindowAction } from './Window/WindowAction';
import type { WindowDefinitionState } from './InternalWindowModels';
import { WindowsManager } from './WindowsManager';
import { useBound } from '../../hooks';
import type { WindowContextProps } from './WindowsContexts';
import { WindowContext } from './WindowsContexts';
import { createPortal } from 'react-dom';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> extends WindowDefinitionState {
  definition: WindowDefinition<Args, CloseResponseType>;
}

export const WindowRenderer = createComponent('WindowRenderer', <Args extends unknown[], CloseResponseType = string | undefined>({
  windowId,
  managerId,
  definition,
}: Props<Args, CloseResponseType>) => {
  const manager = WindowsManager.get(managerId);
  const args = manager.getArgs<Args>(windowId);
  const [element, setElement] = useState<HTMLElement>();
  const close = useBound((response?: CloseResponseType) => manager.close(windowId, response));
  const utils = useMemo<WindowDefinitionUtils<CloseResponseType>>(() => ({
    id: windowId,
    Window,
    Content: WindowContent,
    Actions: WindowActions,
    Action: WindowAction,
    OkButton: WindowOkAction,
    close,
  }), [windowId]);

  const context = useMemo<WindowContextProps>(() => ({
    id: windowId,
    managerId,
  }), [windowId, managerId]);

  const content = definition(utils)(...args);

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
    <WindowContext.Provider value={context}>
      {createPortal(content, element)}
    </WindowContext.Provider>
  );
});