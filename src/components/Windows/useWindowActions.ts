import { useContext } from 'react';
import { useBound } from '../../hooks';
import { WindowsProviderId } from './Windows';
import { WindowsActionsContext } from './WindowsContexts';
import { WindowState } from './WindowsModels';

export function useWindowActions() {
  const { isValid, invoke } = useContext(WindowsActionsContext);
  if (!isValid) throw new Error('You have used useWindowActions outside of a valid WindowsActionsProvider');

  const closeWindow = useBound((id: string) => invoke(id, 'close'));
  const focusWindow = useBound((id: string) => invoke(id, 'focus'));
  const addWindow = useBound(<T extends WindowState = WindowState>(config: T) => invoke(WindowsProviderId, 'open', config));

  return {
    closeWindow,
    focusWindow,
    addWindow,
  };
}