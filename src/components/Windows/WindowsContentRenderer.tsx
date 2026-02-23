import { createComponent } from '../Component';
import { useLayoutEffect, useState } from 'react';
import { windowsDefinitionsManager } from './WindowDefinitionsManager';
import { WindowRenderer } from './WindowRenderer';
import { Dialog } from '../Dialog/Dialog';

interface Props {
  managerId: string;
  managerType?: 'windows' | 'dialogs';
}

export const WindowsContentRenderer = createComponent('WindowsContentRenderer', ({ managerId, managerType = 'windows' }: Props) => {
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    return windowsDefinitionsManager.subscribeToInstanceChanges(managerId, () => forceUpdate(n => n + 1));
  }, [managerId]);

  const instanceGroups = windowsDefinitionsManager.getInstancesForManager(managerId);
  const nodes: React.ReactNode[] = [];

  for (const { definitionId, windowTypeName, instances } of instanceGroups) {
    if (windowTypeName == null) continue;
    const hasLocalRenderer = windowsDefinitionsManager.getDefinition(definitionId, managerId) != null;
    if (hasLocalRenderer) continue;

    const globalDef = windowsDefinitionsManager.getGlobalDefinition(windowTypeName);
    if (globalDef == null) continue;

    const windowComponent = managerType === 'dialogs' ? Dialog : undefined;
    for (const state of instances) {
      nodes.push(
        <WindowRenderer
          key={state.windowId}
          windowId={state.windowId}
          managerId={state.managerId}
          definition={globalDef.definition}
          windowComponent={windowComponent}
        />,
      );
    }
  }

  return <>{nodes}</>;
});
