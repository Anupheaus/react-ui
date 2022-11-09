import { ReactNode, useContext, useState } from 'react';
import { createComponent } from '../Component';
import { DistributedState, useBound, useDistributedState } from '../../hooks';

const Context = DistributedState.createContext<string | undefined>();

interface Props {
  children?: ReactNode;
}

export const CalendarEntryHighlightProvider = createComponent({
  id: 'CalendarEntryHighlightProvider',

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

export function useCalendarEntryHighlighting(id: string) {
  const state = useContext(Context);
  if (state == null) throw new Error('No CalendarEntryHighlightProvider context found');
  const { modify, onChange } = useDistributedState(state);
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