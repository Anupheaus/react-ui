import { useContext, useState } from 'react';
import { anuxPureFC } from '../../anuxComponents';
import { DistributedState, useBound, useDistributedState } from '../../hooks';

const Context = DistributedState.createContext<string | undefined>();

export const CalendarEntryHighlightProvider = anuxPureFC('CalendarEntryHighlightProvider', ({
  children = null
}) => {
  const { state } = useDistributedState<string | undefined>(() => undefined);

  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  );
});

export function useCalendarEntryHighlighting(id: string) {
  const { modify, onChange } = useDistributedState(useContext(Context));
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const [isDehighlighted, setIsDehighlighted] = useState<boolean>(false);

  const setIsHighlightedInState = (newIsHighlighted: boolean) => modify(currentId => newIsHighlighted ? id : currentId === id ? undefined : currentId);

  const highlight = useBound(() => setIsHighlightedInState(true));
  const dehighlight = useBound(() => setIsHighlightedInState(false));

  onChange(currentId => {
    setIsHighlighted(currentId === id);
    setIsDehighlighted(currentId !== id && currentId != null);
  });

  return {
    highlight,
    dehighlight,
    isHighlighted,
    isDehighlighted,
  };
}