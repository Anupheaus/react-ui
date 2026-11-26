import { createComponent } from '../Component';
import type { ComponentType, ReactNode } from 'react';
import type { WindowDefinition, WindowDefinitionProps } from './WindowsModels';
import { WindowRenderer } from './WindowRenderer';
import { useLayoutEffect, useState } from 'react';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import { WindowsManager } from './WindowsManager';

interface Props<Args extends unknown[], CloseResponseType = string | undefined> extends WindowDefinitionProps {
  name: string;
  definition: WindowDefinition<Args, CloseResponseType>;
  definitionId?: string;
  managerId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Window or Dialog, whose props differ; a component type is contravariant in its props, so only any accepts both
  windowComponent?: ComponentType<any>;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- registers once per definition; props is a new rest object every render, so listing it would re-register (and drop the open windows) on each render
  }, [definitionId, managerId, doNotPersist, definition]);

  return (<>
    {windows}
  </>);
});