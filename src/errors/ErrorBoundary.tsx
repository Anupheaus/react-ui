import { memo, PropsWithChildren, useMemo, useRef } from 'react';
import { ErrorContexts, RecordErrorsContextProps } from './ErrorContexts';
import { useBound } from '../hooks/useBound';
import { useOnUnmount } from '../hooks/useOnUnmount';
import { Error } from '@anupheaus/common';

interface Props {
  onError?(error: Error): void;
}

export const ErrorBoundary = memo<PropsWithChildren<Props>>(({
  children = null,
  onError,
}) => {
  const isUnmounted = useOnUnmount();
  const hasErrorRef = useRef(false);

  const recordError = useBound((rawError: unknown) => {
    const error = rawError instanceof Error ? rawError : new Error({ error: rawError });
    hasErrorRef.current = true;
    setTimeout(() => { // get around setting any state during rendering
      if (isUnmounted()) return;
      onError?.(error);
    }, 0);
  });

  const recordErrorsContext = useMemo<RecordErrorsContextProps>(() => ({
    isValid: true,
    recordError,
  }), []);

  if (hasErrorRef.current) return null;

  return (
    <ErrorContexts.recordErrors.Provider value={recordErrorsContext}>
      {children}
    </ErrorContexts.recordErrors.Provider>
  );
});

ErrorBoundary.displayName = 'ErrorHandler';
