import { ReactNode, useContext, useState } from 'react';
import { createComponent } from '../Component';
import { DistributedState, useBound, useDistributedState } from '../../hooks';

const Context = DistributedState.createContext<string | undefined>();

interface Props {
  children: ReactNode;
}

export const CalendarEntrySelectionProvider = createComponent({
  id: 'CalendarEntrySelectionProvider',

  render({
    children = null
  }: Props) {
    const { state } = useDistributedState<string | undefined>(() => undefined);

    return (
      <Context.Provider value={state}>
        {children}
      </Context.Provider>
    );
  },
});

export function useCalendarEntrySelection(id: string) {
  const state = useContext(Context);
  if (!state) { throw new Error('No CalendarEntrySelectionProvider context found'); }
  const { modify, onChange } = useDistributedState(state);
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
