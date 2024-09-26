import type { ReactNode } from 'react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { WindowManagerIdContext } from './WindowsContexts';
import type { WindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useId, useOnChange, useOnUnmount, useStorage } from '../../hooks';

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
  const [states, setStates] = useState<StateType[]>(useMemo(() => providedStates ?? localStorage ?? [], []));
  const lastOnChangeRef = useRef<StateType[]>(states);
  // const orderedIdsRef = useRef<string[]>([]);
  // const [allowRenderingOfWindows, setAllowRenderingOfWindows] = useState(false);

  const updateSavedStates = (newStates: StateType[]) => {
    if (localStorageKey != null) setLocalStorage(newStates);
    onChange?.(newStates);
  };

  useLayoutEffect(() => manager.subscribeToStateChanges((newActiveStates, reason) => {
    const newStates = newActiveStates.map(({ index, isFocused, ...rest }) => rest) as StateType[];
    if (reason === 'add' || reason === 'remove' || reason === 'reorder') setStates(newStates);
    lastOnChangeRef.current = newStates;
    updateSavedStates(newStates);
  }), [manager]);

  useOnChange(() => {
    updateSavedStates(states);
  }, [states]);

  /** Only on startup */
  useMemo(() => {
    manager.add(states);
  }, []);

  // const onClose = useBound((windowId: string, reason?: string) => manager.close(windowId, reason));

  /** Saved States Changes */
  useLayoutEffect(() => {
    const newStates = providedStates ?? localStorage;
    if (newStates == null || lastOnChangeRef.current === newStates) return;
    manager.add(newStates);
  }, [Object.hash(providedStates ?? localStorage ?? [])]);

  // const windows = useMemo(() => {
  //   if (!allowRenderingOfWindows) return null;
  //   const [orderedWindows, newOrderedIds] = windowsUtils.reorderWindows(states, orderedIdsRef.current);
  //   orderedIdsRef.current = newOrderedIds;
  //   return orderedWindows.map(state => {
  //     const index = states.indexOf(state);
  //     const definition = manager.getDefinitionFor(state.name);
  //     return (
  //       <WindowRenderer
  //         key={`${state.id}-${state.name}`}
  //         state={state}
  //         definition={definition}
  //         index={index}
  //         isFocused={index === states.length - 1}
  //         onClose={onClose}
  //       />
  //     );
  //   });
  // }, [states, allowRenderingOfWindows]);

  useOnUnmount(() => {
    manager.clear();
    WindowsManager.remove(id);
  });

  // useEffect(() => {
  //   // do this when the Windows component has been mounted
  //   setAllowRenderingOfWindows(true);
  // }, []);

  return (
    <WindowManagerIdContext.Provider value={id}>
      <Flex tagName="windows" id={id} className={className}>
        {children}
      </Flex>
    </WindowManagerIdContext.Provider>
  );
});
