import { useContext } from 'react';
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

  return {
    isLoading: isParentLoading || isLoading,
    isReadOnly,
    isCompact,
    isCompactAndReadOnly: isCompact && isReadOnly,
  };
}