import { ReactNode, useMemo, useState } from 'react';
import { useBound } from '../../hooks';
import { createComponent } from '../Component';
import { WindowsContexts, WindowsContextsUpdateStates, WindowsContextsUseWindowApi } from './WindowsContexts';
import { WindowApi, WindowState } from './WindowsModels';

interface Props {
  state?: WindowState[];
  onSaveState?(windowStates: WindowState[]): void;
  children: ReactNode;
}

export const WindowsProvider = createComponent('WindowsProvider', ({
  state: providedState,
  onSaveState,
  children,
}: Props) => {
  const state = useMemo(() => providedState ?? [], [providedState]);
  const [windows, setWindows] = useState<ReactNode[]>([]);

  const addWindow = useBound(async (window: ReactNode): Promise<WindowApi> => new Promise(resolve => setWindows(currentWindows => [...currentWindows, (
    <WindowsContexts.registerApi.Provider key={Math.uniqueId()} value={resolve}>
      {window}
    </WindowsContexts.registerApi.Provider>
  )])));

  const useWindowsContext = useMemo<WindowsContextsUseWindowApi>(() => ({
    addWindow,
  }), []);

  const windowStateUpdatesContext = useBound<WindowsContextsUpdateStates>(updates => onSaveState?.(updates));

  return (
    <WindowsContexts.useWindows.Provider value={useWindowsContext}>
      <WindowsContexts.windows.Provider value={windows}>
        <WindowsContexts.stateUpdates.Provider value={windowStateUpdatesContext}>
          <WindowsContexts.initialStates.Provider value={state}>
            {children}
          </WindowsContexts.initialStates.Provider>
        </WindowsContexts.stateUpdates.Provider>
      </WindowsContexts.windows.Provider>
    </WindowsContexts.useWindows.Provider>
  );
});
