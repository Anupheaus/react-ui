import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { WindowManagerIdContext } from './WindowsContexts';
import type { WindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useId, useOnChange, useOnUnmount, useStorage, useUpdatableState } from '../../hooks';

interface Props<StateType extends WindowState = WindowState> {
  id?: string;
  className?: string;
  children?: ReactNode;
  states?: StateType[];
  localStorageKey?: string;
  onChange?(states: StateType[]): void;
}

export const Windows = createComponent('Windows', <StateType extends WindowState = WindowState>({
  id = 'default',
  className,
  children = null,
  states: providedStates,
  localStorageKey,
  onChange,
}: Props<StateType>) => {
  const instanceId = useId();
  const manager = WindowsManager.getOrCreate(id, instanceId);
  const { state: localStorage, setState: setLocalStorage } = useStorage<StateType[]>(localStorageKey ?? `windows.${id}`, { type: 'local' });
  const [states, setStates] = useUpdatableState<StateType[]>(() => providedStates ?? localStorage ?? [], [providedStates]);
  const lastOnChangeRef = useRef<StateType[]>(states);

  const updateSavedStates = (newStates: StateType[]) => {
    const savableStates = newStates.mapWithoutNull(({ isPersistable = true, ...rest }) => isPersistable ? rest as StateType : undefined);
    if (localStorageKey != null) setLocalStorage(savableStates);
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
    const newStates = providedStates ?? localStorage;
    if (newStates == null || lastOnChangeRef.current === newStates) return;
    manager.add(newStates);
  }, [Object.hash(providedStates ?? localStorage ?? [])]);

  useOnUnmount(() => {
    manager.clear();
    WindowsManager.remove(id);
  });

  return (
    <WindowManagerIdContext.Provider value={id}>
      <Flex tagName="windows" id={id} className={className}>
        {children}
      </Flex>
    </WindowManagerIdContext.Provider>
  );
});
