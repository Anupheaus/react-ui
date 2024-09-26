import { useLayoutEffect, useMemo, useState } from 'react';
import { createComponent } from '../Component';
import type { WindowDefinitionUtils } from './WindowsModels';
import { type WindowDefinition } from './WindowsModels';
import { Window, WindowContent } from './Window';
import { WindowActions } from './Window/WindowActions';
import { WindowAction } from './Window/WindowAction';
import type { WindowDefinitionState } from './InternalWindowModels';
import { WindowsManager } from './WindowsManager';
import { useBound } from '../../hooks';
import type { WindowContextProps } from './WindowsContexts';
import { WindowContext } from './WindowsContexts';
import { createPortal } from 'react-dom';

interface Props<Args extends unknown[]> extends WindowDefinitionState {
  definition: WindowDefinition<Args>;
}

export const WindowRenderer = createComponent('WindowRenderer', <Args extends unknown[]>({
  windowId,
  managerId,
  definition,
}: Props<Args>) => {
  const manager = WindowsManager.get(managerId);
  const args = manager.getArgs<Args>(windowId);
  const [element, setElement] = useState<HTMLElement>();
  const close = useBound((reason?: string) => manager.close(windowId, reason));

  const utils = useMemo<WindowDefinitionUtils>(() => ({
    id: windowId,
    Window,
    Content: WindowContent,
    Actions: WindowActions,
    Action: WindowAction,
    OkButton: WindowAction,
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