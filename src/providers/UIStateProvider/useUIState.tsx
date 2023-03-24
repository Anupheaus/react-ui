import { ComponentProps, useContext, useMemo } from 'react';
import { createComponent } from '../../components/Component';
import { useBound, useDistributedState } from '../../hooks';
import { UIState } from './UIState';
import { UIStateContexts } from './UIStateContexts';

interface Props {
  isLoading?: boolean;
  isReadOnly?: boolean;
  isCompact?: boolean;
}

export function useUIState({ isLoading = false, isReadOnly: isProvidedReadOnly, isCompact: isProvidedCompact }: Props = {}) {
  const isParentLoading = useContext(UIStateContexts.isLoadingContext);
  const isParentReadOnly = useContext(UIStateContexts.isReadOnlyContext);
  const isParentCompact = useContext(UIStateContexts.isCompactContext);

  const isReadOnly = isProvidedReadOnly ?? isParentReadOnly;
  const isCompact = isProvidedCompact ?? isParentCompact;

  const useManagedUIState = () => {
    const { state: managedUIState, set } = useDistributedState(() => false);

    const waitOnProcess = useBound(async (delegate: () => Promise<void>) => {
      try {
        set(true);
        await delegate();
      } finally {
        set(false);
      }
    });

    const ManagedUIState = useMemo(() => createComponent('ManagedUIState', (props: ComponentProps<typeof UIState>) => {
      const { getAndObserve } = useDistributedState(managedUIState);
      const managedIsLoading = getAndObserve();
      return (<UIState {...props} isLoading={props.isLoading === true || managedIsLoading === true} />);
    }), []);

    return {
      waitOnProcess,
      ManagedUIState,
    };
  };

  return {
    isLoading: isParentLoading || isLoading,
    isReadOnly,
    isCompact,
    isCompactAndReadOnly: isCompact && isReadOnly,
    useManagedUIState,
  };
}