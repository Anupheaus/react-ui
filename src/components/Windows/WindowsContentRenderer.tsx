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

    // Only genuine dialog definitions (createDialog → dialogOnly) render through <Dialog> (no close
    // button by default). A window definition shown in the dialogs manager (e.g. a useWindow window
    // presented as a dialog on mobile) renders as a normal <Window> — it keeps the window chrome
    // (close button shown by default) and still slides up, since the bottom-sheet styling lives in
    // the Window component's mobile device styling, not in Dialog.
    const windowComponent = managerType === 'dialogs' && globalDef.dialogOnly ? Dialog : undefined;
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
