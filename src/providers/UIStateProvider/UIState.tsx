import { useContext } from 'react';
import { pureFC } from '../../anuxComponents';
import { UIStateContexts } from './UIStateContexts';

interface Props {
  isLoading?: boolean;
  isReadOnly?: boolean;
  isCompact?: boolean;
}

export const UIState = pureFC<Props>()('UIState', ({
  isLoading = false,
  isReadOnly,
  isCompact,
  children = null,
}) => {
  const isParentLoading = useContext(UIStateContexts.isLoadingContext);
  const isParentReadOnly = useContext(UIStateContexts.isReadOnlyContext);
  const isParentCompact = useContext(UIStateContexts.isReadOnlyContext);

  const newIsLoading = isLoading || isParentLoading;

  let content = <>{children}</>;

  if (isParentLoading !== newIsLoading) content = (
    <UIStateContexts.isLoadingContext.Provider value={newIsLoading}>
      {content}
    </UIStateContexts.isLoadingContext.Provider>
  );

  if (isReadOnly != null && isReadOnly !== isParentReadOnly) content = (
    <UIStateContexts.isReadOnlyContext.Provider value={isReadOnly}>
      {content}
    </UIStateContexts.isReadOnlyContext.Provider>
  );

  if (isCompact != null && isCompact !== isParentCompact) content = (
    <UIStateContexts.isCompactContext.Provider value={isCompact}>
      {content}
    </UIStateContexts.isCompactContext.Provider>
  );

  return content;
});
