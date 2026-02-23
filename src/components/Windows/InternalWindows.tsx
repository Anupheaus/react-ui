import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { WindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { WindowsContentRenderer } from './WindowsContentRenderer';
import { isSimpleArgs } from './WindowsUtils';
import { useId, useOnChange, useOnUnmount, useStorage, useUpdatableState } from '../../hooks';

export type ManagerType = 'windows' | 'dialogs';

export interface InternalWindowsProps {
  id?: string;
  className?: string;
}

interface Props<StateType extends WindowState = WindowState> extends InternalWindowsProps {
  managerType?: ManagerType;
  localStorageKey?: string;
  states?: StateType[];
  onChange?(states: StateType[]): void;
  children?: ReactNode;
}

export const InternalWindows = createComponent('InternalWindows', <StateType extends WindowState = WindowState>({
  id,
  className,
  children = null,
  states: providedStates,
  localStorageKey,
  onChange,
  managerType = 'windows',
}: Props<StateType>) => {
  const instanceId = useId();
  const defaultId = managerType === 'windows' ? WindowsManager.WINDOWS_DEFAULT_ID : WindowsManager.DIALOGS_DEFAULT_ID;
  const managerId = id ?? defaultId;
  const manager = WindowsManager.getOrCreate(managerId, instanceId, managerType);
  const persistenceEnabled = managerType === 'windows' && localStorageKey != null;
  const storageKey = localStorageKey ?? `windows.${managerId}`;
  const { state: localStorage, setState: setLocalStorage } = useStorage<StateType[]>(storageKey, { type: 'local', disabled: !persistenceEnabled });
  const [states, setStates] = useUpdatableState<StateType[]>(
    () => providedStates ?? (persistenceEnabled ? localStorage : undefined) ?? [],
    [providedStates],
  );
  const lastOnChangeRef = useRef<StateType[]>(states);

  const updateSavedStates = (newStates: StateType[]) => {
    const savableStates = newStates.mapWithoutNull(state => {
      const { isPersistable = true, args } = state;
      if (!isPersistable || !isSimpleArgs(args)) return undefined;
      const { isPersistable: _p, ...rest } = state;
      return rest as StateType;
    });
    if (persistenceEnabled) setLocalStorage(savableStates);
    onChange?.(newStates);
  };

  useLayoutEffect(() => manager.subscribeToStateChanges((newActiveStates, reason) => {
    const newStates = newActiveStates.map(({ index, isFocused, ...rest }) => rest as StateType);
    if (reason === 'add' || reason === 'remove' || reason === 'reorder') setStates(newStates);
    lastOnChangeRef.current = newStates;
    updateSavedStates(newStates);
  }), [manager]);

  useOnChange(() => {
    updateSavedStates(states);
  }, [states]);

  /** Only on startup */
  useLayoutEffect(() => {
    manager.add(states);
  }, []);

  /** Saved States Changes */
  useLayoutEffect(() => {
    const newStates = providedStates ?? (persistenceEnabled ? localStorage : undefined);
    if (newStates == null || lastOnChangeRef.current === newStates) return;
    manager.add(newStates);
  }, [Object.hash(providedStates ?? (persistenceEnabled ? localStorage : []) ?? [])]);

  useOnUnmount(() => {
    manager.clear();
    WindowsManager.remove(managerId);
  });

  return (
    <Flex tagName="windows" id={managerId} className={className} isVertical>
      {children}
      <WindowsContentRenderer managerId={managerId} managerType={managerType} />
    </Flex>
  );
});
