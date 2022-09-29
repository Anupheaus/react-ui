import { useContext, useState } from 'react';
import { pureFC } from '../../anuxComponents';
import { DistributedState, useBound, useDistributedState } from '../../hooks';

const Context = DistributedState.createContext<string | undefined>();

export const CalendarEntrySelectionProvider = pureFC()('CalendarEntrySelectionProvider', ({
  children = null
}) => {
  const { state } = useDistributedState<string | undefined>(() => undefined);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
});

export function useCalendarEntrySelection(id: string) {
  const { modify, onChange } = useDistributedState(useContext(Context));
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const setIsSelectedInState = (newIsSelected: boolean) => modify(currentId => newIsSelected ? id : currentId === id ? undefined : currentId);

  const select = useBound(() => setIsSelectedInState(true));
  const deselect = useBound(() => setIsSelectedInState(false));

  onChange(currentId => {
    setIsSelected(currentId === id);
  });

  return {
    select,
    deselect,
    isSelected,
  };
}
