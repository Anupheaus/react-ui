import { ReactElement, useContext } from 'react';
import { useBound, useId } from '../../hooks';
import { WindowsManagerContext } from './WindowsContexts';
import { WindowState } from './WindowsModels';

type WindowsManagerTarget = string | 'topMost' | 'latest';

export function useWindows(target: WindowsManagerTarget = 'latest') {
  const hookId = useId();
  const contexts = useContext(WindowsManagerContext);
  const contextsAsArray = Array.from(contexts.values());
  let addWindowCounter = 1;
  const { id: managerId, invoke } = (target === 'latest' ? contextsAsArray.last() : target === 'topMost' ? contextsAsArray.first() : contexts.get(target)) ?? {};
  if (managerId == null || invoke == null) throw new Error('You have used useWindows outside of a valid WindowsManager or the targetted WindowsManager is not available at this location.');

  const closeWindow = useBound((id: string) => invoke(id, 'close'));
  const focusWindow = useBound((id: string) => invoke(id, 'focus'));
  const openWindow = useBound(<T extends WindowState = WindowState>(config: T) => invoke(managerId, 'open', config));
  const addWindow = useBound((content: ReactElement | null) => {
    const promise = invoke(managerId, 'add', `${hookId}-${addWindowCounter}`, content);
    addWindowCounter++;
    return promise;
  });

  return {
    closeWindow,
    focusWindow,
    openWindow,
    addWindow,
  };
}