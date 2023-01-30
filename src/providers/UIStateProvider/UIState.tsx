import { Fragment, ReactNode, useContext } from 'react';
import { createComponent } from '../../components/Component';
import { UIStateContexts } from './UIStateContexts';

interface Props {
  isLoading?: boolean;
  isReadOnly?: boolean;
  isCompact?: boolean;
  children?: ReactNode;
}

export const UIState = createComponent('UIState', ({
  isLoading,
  isReadOnly,
  isCompact,
  children = null,
}: Props) => {
  const isParentLoading = useContext(UIStateContexts.isLoadingContext);

  const newIsLoading = isLoading === true || isParentLoading;

  let content = <>{children}</>;

  if (isLoading != null) content = (
    <UIStateContexts.isLoadingContext.Provider value={newIsLoading}>
      {content}
    </UIStateContexts.isLoadingContext.Provider>
  );

  if (isReadOnly != null) content = (
    <UIStateContexts.isReadOnlyContext.Provider value={isReadOnly}>
      {content}
    </UIStateContexts.isReadOnlyContext.Provider>
  );

  if (isCompact != null) content = (
    <UIStateContexts.isCompactContext.Provider value={isCompact}>
      {content}
    </UIStateContexts.isCompactContext.Provider>
  );

  return content;
});
