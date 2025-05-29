import { createComponent } from '../Component';
import type { WindowDefinition, WindowDefinitionProps } from './WindowsModels';
import { WindowRenderer } from './WindowRenderer';
import type { ReactNode } from 'react';
import { useContext, useLayoutEffect, useState } from 'react';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import { WindowManagerIdContext } from './WindowsContexts';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> extends WindowDefinitionProps {
  name: string;
  definition: WindowDefinition<Args, CloseResponseType>;
  definitionId?: string;
}

export const WindowDefinitionRenderer = createComponent('WindowDefinitionRenderer', <Args extends unknown[], CloseResponseType = string | undefined>({
  name,
  definition,
  definitionId = name,
  doNotPersist = false,
  ...props
}: Props<Args, CloseResponseType>) => {
  const managerId = useContext(WindowManagerIdContext);
  const [windows, setWindows] = useState<ReactNode[]>([]);

  useLayoutEffect(() => {
    windowsDefinitionsManager.register({ managerId, definitionId, doNotPersist },
      states => setWindows(states.map(state => (<WindowRenderer<Args, CloseResponseType> key={state.windowId} {...props}{...state} definition={definition} />))));
    return () => windowsDefinitionsManager.unregister(definitionId, managerId);
  }, [definitionId, managerId, doNotPersist, definition]);

  return (<>
    {windows}
  </>);
});