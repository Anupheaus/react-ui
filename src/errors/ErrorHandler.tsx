import { memo, PropsWithChildren, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Context, ContextProps, OptionalOnErrorHandler } from './context';
import { AnuxError } from './types';
import { ErrorHandlerProps } from './models';
import { useBound } from '../useBound';
import { useId } from '../useId';

interface Props extends ErrorHandlerProps {
  error: Error | undefined;
  onClearError(): void;
}

const boundErrorsToHandler = new WeakMap<AnuxError, string>();

export const AnuxErrorHandler = memo<PropsWithChildren<Props>>(({
  error: reactError,
  children,
  onError,
  onRender,
  onClearError,
}) => {
  const handlerId = useId();
  const onErrorCallbacks = useRef(new Set<OptionalOnErrorHandler>()).current;
  const onResetCallbacks = useRef(new Set<() => void>()).current;
  const { isParentAvailable, bubbleError: bubbleErrorToParent, tryRenderingError: tryRenderingErrorInParent, resetError: resetParentError,
    registerOnReset: registerOnResetWithParent } = useContext(Context);
  const errorRef = useRef<AnuxError>();
  const [renderedError, setRenderedError] = useState<ReactNode>(null);
  const isUnmountedRef = useRef(false);

  useEffect(() => () => { isUnmountedRef.current = true; }, []);

  useLayoutEffect(() => reactError ? onClearError() : void 0, [reactError]);

  const registerOnError = useBound((onErrorDelegate: OptionalOnErrorHandler) => {
    onErrorCallbacks.add(onErrorDelegate);
    return () => onErrorCallbacks.delete(onErrorDelegate);
  });

  const clearError = useBound(() => {
    if (isUnmountedRef.current) return;
    if (renderedError != null) setRenderedError(undefined);
    if (errorRef.current != null) {
      errorRef.current = undefined;
      onErrorCallbacks.forEach(callback => callback());
    }
    onResetCallbacks.forEach(callback => callback());
  });

  useEffect(() => {
    if (!isParentAvailable) return;
    return registerOnResetWithParent(clearError);
  }, [isParentAvailable, registerOnResetWithParent]);

  const registerOnReset = useBound((onResetDelegate: () => void) => {
    onResetCallbacks.add(onResetDelegate);
    return () => onResetCallbacks.delete(onResetDelegate);
  });

  const handleInThisBoundary = useBound((error: AnuxError) => {
    if (boundErrorsToHandler.has(error)) return;
    boundErrorsToHandler.set(error, handlerId);
  });

  const bubbleError = useBound((error: AnuxError, occurredWithinThisBoundary = false) => {
    const allCallbacks = [onError].concat(Array.from(onErrorCallbacks)).removeNull();
    allCallbacks.forEach(callback => callback({ error, occurredWithinThisBoundary, handleInThisBoundary }));
    if (isParentAvailable) bubbleErrorToParent(error);
  });

  const captureError = useBound((error: Error, isAsync = false) => {
    if (isUnmountedRef.current) return;
    const anuxError = error instanceof AnuxError ? error : new AnuxError({ error, isAsync });
    bubbleError(anuxError, true);
    tryRenderingError(anuxError);
    errorRef.current = anuxError;
  });

  const tryRenderingError = useBound((error: AnuxError) => {
    if (error.hasBeenHandled) return;
    const rendererId = boundErrorsToHandler.get(error);
    if (rendererId == null || rendererId === handlerId) {
      if (onRender) {
        const newRenderedError = onRender({ error, children });
        if (newRenderedError == null) return;
        error.markAsHandled();
        setRenderedError(newRenderedError);
        return;
      }
    }
    if (isParentAvailable) tryRenderingErrorInParent(error);
    if (error.hasBeenHandled) return;
    // eslint-disable-next-line no-console
    console.error('Unable to render error.', { error });
  });

  const resetError = useBound(() => {
    // send to parent if we have one and it should filter down from there
    if (isParentAvailable) { resetParentError(); } else { clearError(); }
  });

  if (reactError != null) captureError(reactError, false);

  const context = useMemo<ContextProps>(() => ({
    isParentAvailable: true,
    getError: () => errorRef.current,
    registerOnError,
    registerOnReset,
    captureError,
    bubbleError,
    tryRenderingError,
    resetError,
  }), []);

  return (
    <Context.Provider value={context}>
      {renderedError ?? children ?? null}
    </Context.Provider>
  );
});

AnuxErrorHandler.displayName = 'ErrorHandler';
