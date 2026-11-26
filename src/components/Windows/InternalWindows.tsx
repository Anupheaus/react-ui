import type { ReactNode } from 'react';
import { useLayoutEffect, useRef } from 'react';
import { createComponent } from '../Component';
import { Flex } from '../Flex';
import type { WindowState } from './WindowsModels';
import { WindowsManager } from './WindowsManager';
import { WindowsContentRenderer } from './WindowsContentRenderer';
import { DialogsManagerContext, WindowsManagerContext } from './WindowsContexts';
import { isSimpleArgs } from './WindowsUtils';
import { useBound, useId, useOnChange, useStorage, useUpdatableState } from '../../hooks';

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
  const childrenAsSibling = managerType === 'dialogs';
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

  // Hold the manager while mounted. A layout effect, declared before the others here, so a Windows replaced in the same
  // commit has already released it (layout cleanups of removed components run before new layout effects) and its windows
  // have gone before this one's are added. The passive cleanup this replaces ran only after, and cleared and unregistered
  // the manager the new Windows had just filled.
  useLayoutEffect(() => {
    WindowsManager.claim(managerId, instanceId, managerType);
    return () => WindowsManager.release(managerId, instanceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- instanceId is fixed per mount and managerType is fixed per Windows host; only a new managerId should re-claim
  }, [managerId]);

  // Bound so the manager subscription below always saves through the latest onChange and persistence settings.
  const updateSavedStates = useBound((newStates: StateType[]) => {
    const savableStates = newStates.mapWithoutNull(state => {
      const { isPersistable = true, args } = state;
      if (!isPersistable || !isSimpleArgs(args)) return undefined;
      const { isPersistable: _p, ...rest } = state;
      return rest as StateType;
    });
    if (persistenceEnabled) setLocalStorage(savableStates);
    onChange?.(newStates);
  });

  useLayoutEffect(() => manager.subscribeToStateChanges((newActiveStates, reason) => {
    const newStates = newActiveStates.map(({ index: _index, isFocused: _isFocused, ...rest }) => rest as StateType);
    if (reason === 'add' || reason === 'remove' || reason === 'reorder') setStates(newStates);
    lastOnChangeRef.current = newStates;
    updateSavedStates(newStates);
  }), [manager, setStates, updateSavedStates]);

  useOnChange(() => {
    updateSavedStates(states);
  }, [states]);

  /** Only on startup */
  useLayoutEffect(() => {
    manager.add(states);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seeds the manager with the initial states once; later changes arrive via the effect below
  }, []);

  /** Saved States Changes */
  useLayoutEffect(() => {
    const newStates = providedStates ?? (persistenceEnabled ? localStorage : undefined);
    if (newStates == null || lastOnChangeRef.current === newStates) return;
    manager.add(newStates);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on a content hash of the saved states so an equal array with a new identity does not re-add them
  }, [Object.hash(providedStates ?? (persistenceEnabled ? localStorage : []) ?? [])]);

  const ManagerContext = managerType === 'windows' ? WindowsManagerContext : DialogsManagerContext;
  // The host clips its windows (disableOverflow) so a window dragged partly out of it never makes the page scroll.
  const overlayFlex = (
    <Flex tagName="windows" id={managerId} className={className} isVertical disableOverflow>
      {!childrenAsSibling ? children : null}
      <WindowsContentRenderer managerId={managerId} managerType={managerType} />
    </Flex>
  );
  return (
    <ManagerContext.Provider value={managerId}>
      {childrenAsSibling ? (
        <>
          {children}
          {overlayFlex}
        </>
      ) : (
        overlayFlex
      )}
    </ManagerContext.Provider>
  );
});
