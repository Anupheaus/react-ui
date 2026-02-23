import { createComponent } from '../Component';
import type { WindowDefinition, WindowDefinitionProps } from './WindowsModels';
import { WindowRenderer } from './WindowRenderer';
import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import { WindowsManager } from './WindowsManager';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> extends WindowDefinitionProps {
  name: string;
  definition: WindowDefinition<Args, CloseResponseType>;
  definitionId?: string;
  managerId?: string;
  windowComponent?: import('react').ComponentType<any>;
}

export const WindowDefinitionRenderer = createComponent('WindowDefinitionRenderer', <Args extends unknown[], CloseResponseType = string | undefined>({
  name,
  definition,
  definitionId = name,
  doNotPersist = false,
  managerId: propsManagerId,
  windowComponent,
  ...props
}: Props<Args, CloseResponseType>) => {
  const managerId = propsManagerId ?? WindowsManager.getDefaultManagerId('windows');
  const [windows, setWindows] = useState<ReactNode[]>([]);

  useLayoutEffect(() => {
    windowsDefinitionsManager.register({ managerId, definitionId, doNotPersist },
      states => setWindows(states.map(state => (<WindowRenderer<Args, CloseResponseType> key={state.windowId} {...props}{...state} definition={definition} windowComponent={windowComponent} />))));
    return () => windowsDefinitionsManager.unregister(definitionId, managerId);
  }, [definitionId, managerId, doNotPersist, definition]);

  return (<>
    {windows}
  </>);
});