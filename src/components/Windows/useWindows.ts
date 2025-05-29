import { useBound } from '../../hooks';
import { WindowsManager } from './WindowsManager';
import type { WindowState } from './WindowsModels';

export function useWindows<StateType extends WindowState = WindowState>(id = 'default') {
  const manager = WindowsManager.get(id);

  const closeWindow = manager.close;
  const openWindow = useBound((state: StateType) => manager.open(state));
  const focusWindow = manager.focus;
  const maximizeWindow = manager.maximize;
  const restoreWindow = manager.restore;

  return {
    closeWindow,
    focusWindow,
    openWindow,
    maximizeWindow,
    restoreWindow,
  };
}