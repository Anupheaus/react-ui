import { ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import { WindowManagerIdContext, WindowContext, WindowContextProps } from './WindowsContexts';
import { WindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { useOnChange, useStorage } from '../../hooks';
import { windowsUtils } from './WindowsUtils';

interface Props<StateType extends WindowState = WindowState> {
  id?: string;
  className?: string;
  children?: ReactNode;
  states?: StateType[];
  localStorageKey?: string;
  onChange?(states: StateType[]): void;
  onCreate(state: StateType): ReactNode;
}

export const Windows = createComponent('Windows', function <StateType extends WindowState = WindowState>({
  id = 'default',
  className,
  children = null,
  states: providedStates,
  localStorageKey,
  onChange,
  onCreate,
}: Props<StateType>) {
  const manager = WindowsManager.get(id);
  const { state: localStorage, setState: setLocalStorage } = useStorage<StateType[]>(localStorageKey ?? `windows.${id}`, { type: 'local' });
  const [states, setStates] = useState<StateType[]>(useMemo(() => providedStates ?? localStorage ?? [], []));
  const lastOnChangeRef = useRef<StateType[]>(states);
  const orderedIdsRef = useRef<string[]>([]);

  const updateSavedStates = (newStates: StateType[]) => {
    if (localStorageKey != null) setLocalStorage(newStates);
    onChange?.(newStates);
  };

  useLayoutEffect(() => manager.subscribeToStateChanges((newStates, reason) => {
    if (reason === 'add' || reason === 'remove' || reason === 'reorder') setStates(newStates as StateType[]);
    lastOnChangeRef.current = newStates as StateType[];
    updateSavedStates(newStates as StateType[]);
  }), [manager]);

  useOnChange(() => {
    updateSavedStates(states);
  }, [states]);

  /** Only on startup */
  useMemo(() => {
    manager.add(states);
  }, []);

  /** Saved States Changes */
  useLayoutEffect(() => {
    const newStates = providedStates ?? localStorage;
    if (newStates == null || lastOnChangeRef.current === newStates) return;
    manager.add(newStates);
  }, [Object.hash(providedStates ?? localStorage ?? [])]);

  const windows = useMemo(() => {
    const [orderedWindows, newOrderedIds] = windowsUtils.reorderWindows(states, orderedIdsRef.current);
    orderedIdsRef.current = newOrderedIds;
    return orderedWindows.map(state => {
      const index = states.indexOf(state);
      const window = onCreate(state);
      if (window == null) return null;
      const context: WindowContextProps = {
        id: state.id,
        index,
        isFocused: index === states.length - 1,
      };
      return (
        <WindowContext.Provider key={state.id} value={context}>
          {onCreate?.(state) ?? null}
        </WindowContext.Provider>
      );
    });
  }, [states]);

  return (
    <Flex tagName="windows" className={className}>
      <WindowManagerIdContext.Provider value={id}>
        {children}
        {windows}
      </WindowManagerIdContext.Provider>
    </Flex>
  );
});
