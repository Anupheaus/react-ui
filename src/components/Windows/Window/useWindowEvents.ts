import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import type { WindowsManager } from '../WindowsManager';
import { useBound, useOnUnmount } from '../../../hooks';
import type { PromiseMaybe } from '@anupheaus/common';

interface Props {
  manager: WindowsManager;
  windowElementRef: RefObject<HTMLElement>;
  id: string;
  onClosing?(response?: unknown): PromiseMaybe<void | boolean>;
  onClosed?(response?: unknown): void;
  onFocus?(isFocused: boolean): void;
}

export function useWindowEvents({ manager, windowElementRef, id, onClosing, onClosed, onFocus }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const isUnmounted = useOnUnmount();
  // Bound so the subscriptions below, made once per window, always call the latest handlers passed in.
  const handleClosing = useBound((response?: unknown) => onClosing?.(response));
  const handleClosed = useBound((response?: unknown) => onClosed?.(response));
  const handleFocus = useBound((isFocused: boolean) => onFocus?.(isFocused));

  useLayoutEffect(() => {
    return manager.subscribeToEventChanges(id, async events => {
      if (events.allowClosing != null) {
        const promise = events.allowClosing;
        const state = manager.get(id);
        const result = await handleClosing(state.closingResponse);
        if (result === false) promise.reject();
        else promise.resolve();
      }
      if (events.closing != null) {
        setIsClosing(true);
      }
    });
  }, [manager, id, handleClosing]);

  useLayoutEffect(() => {
    const { current: windowElement } = windowElementRef;
    if (windowElement == null) return;

    const genericHandler = (_isCancelled: boolean) => (event: TransitionEvent) => {
      if (event.target !== windowElementRef.current || windowElementRef.current == null || isUnmounted()) return;
      const state = manager.has(id) ? manager.get(id) : null;
      switch (event.propertyName) {
        case 'filter': {
          if (manager.endEvent(id, 'focusing')) handleFocus(manager.isFocused(id));
          break;
        }
        case 'opacity': {
          if (manager.endEvent(id, 'closing')) handleClosed(state?.closingResponse);
          break;
        }
        case 'transform': {
          manager.endEvent(id, 'opening');
          break;
        }
        case 'width': case 'height': case 'left': case 'top': {
          manager.endEvent(id, 'maximizing');
          manager.endEvent(id, 'restoring');
          break;
        }
      }
    };
    const normalHandler = genericHandler(false);
    const cancelledHandler = genericHandler(true);
    windowElement.addEventListener('transitionend', normalHandler);
    windowElement.addEventListener('transitioncancel', cancelledHandler);
    return () => {
      windowElement.removeEventListener('transitionend', normalHandler);
      windowElement.removeEventListener('transitioncancel', cancelledHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-attaches when the window element itself changes; isUnmounted only reads a ref and the handlers are bound
  }, [windowElementRef.current, id]);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  const isVisible = hasRendered && !isClosing;

  return {
    isVisible,
  };
}