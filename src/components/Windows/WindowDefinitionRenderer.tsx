import { createComponent } from '../Component';
import type { WindowDefinition } from './WindowsModels';
import { WindowRenderer } from './WindowRenderer';
import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';

interface Props<Args extends unknown[]> {
  id: string;
  name: string;
  definition: WindowDefinition<Args>;
  definitionId: string;
}

export const WindowDefinitionRenderer = createComponent('WindowDefinitionRenderer', <Args extends unknown[]>({
  id,
  name,
  definition,
  definitionId,
}: Props<Args>) => {
  const [windows, setWindows] = useState<ReactNode[]>([]);

  useLayoutEffect(() => {
    windowsDefinitionsManager.register(definitionId, id, states => setWindows(states.map(state => (<WindowRenderer<Args> key={state.windowId} {...state} definition={definition} />))));
    return () => windowsDefinitionsManager.unregister(definitionId, id);
  }, [id, name, definitionId, definition]);

  return (<>
    {windows}
  </>);
});