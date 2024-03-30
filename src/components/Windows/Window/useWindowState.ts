import { useLayoutEffect } from 'react';
import { WindowsManager } from '../WindowsManager';
import { useUpdatableState } from '../../../hooks';
import { WindowState } from '../WindowsModels';
import { is } from '@anupheaus/common';

export function useWindowState(manager: WindowsManager, id: string, width: number | string | undefined, height: number | string | undefined) {
  const [state, setState] = useUpdatableState<WindowState>(() => {
    const initialState = manager.get(id);
    return {
      ...initialState,
      width: width ?? initialState.width,
      height: height ?? initialState.height,
    };
  }, [manager, id]);


  useLayoutEffect(() => manager.subscribeToStateChanges(id, newState => setState(newState)), [manager]);

  useLayoutEffect(() => {
    manager.updateStateWithoutNotifications(state);
  }, [state]);

  const updateState = (newState: Partial<WindowState>) => setState(currentState => {
    const nextState = { ...currentState, ...newState };
    if (is.deepEqual(nextState, currentState)) return currentState;
    return nextState;
  });

  return [state, updateState] as const;
}
