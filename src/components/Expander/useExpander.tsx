import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { createComponent } from '../Component';
import { Expander as ExpanderComponent } from './Expander';
import { useBound, useDistributedState } from '../../hooks';
import { is } from '@anupheaus/common';

type Props = Omit<ComponentProps<typeof ExpanderComponent>, 'isExpanded'>;

export function useExpander(initialState: boolean | (() => boolean) = false, onExpand?: (isExpanded: boolean) => void) {
  const { state, set, get, getAndObserve } = useDistributedState(() => is.function(initialState) ? initialState() : initialState);

  const toggle = useBound(() => {
    const isExpanded = get();
    set(!isExpanded);
    onExpand?.(!isExpanded);
  });

  const Expander = useMemo(() => createComponent('UseExpander', ({ children, ...props }: Props) => {
    const { getAndObserve: localGetAndObserve } = useDistributedState(state);
    const isExpanded = localGetAndObserve();

    return (
      <ExpanderComponent {...props} isExpanded={isExpanded}>
        {children}
      </ExpanderComponent>
    );
  }), []);

  return {
    Expander,
    get isExpanded() { return getAndObserve(); },
    setExpanded: set,
    toggle,
  };
}