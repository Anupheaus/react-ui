import type { RefObject } from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import type { WindowsManager } from '../WindowsManager';
import { useOnUnmount } from '../../../hooks';
import type { PromiseMaybe } from '@anupheaus/common';

interface Props {
  manager: WindowsManager;
  windowElementRef: RefObject<HTMLElement>;
  id: string;
  onClosing?(reason?: string): PromiseMaybe<void | boolean>;
  onClosed?(reason?: string): void;
  onFocus?(isFocused: boolean): void;
}

export function useWindowEvents({ manager, windowElementRef, id, onClosing, onClosed, onFocus }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const isUnmounted = useOnUnmount();

  useLayoutEffect(() => {
    return manager.subscribeToEventChanges(id, async events => {
      if (events.allowClosing != null) {
        const promise = events.allowClosing;
        const state = manager.get(id);
        const result = await onClosing?.(state.closingReason);
        if (result === false) promise.reject();
        else promise.resolve();
      }
      if (events.closing != null) {
        setIsClosing(true);
      }
    });
  }, [manager, id]);

  useLayoutEffect(() => {
    if (windowElementRef.current == null) return;

    const genericHandler = (_isCancelled: boolean) => (event: TransitionEvent) => {
      if (event.target !== windowElementRef.current || windowElementRef.current == null || isUnmounted()) return;
      const state = manager.has(id) ? manager.get(id) : null;
      switch (event.propertyName) {
        case 'filter': {
          if (manager.endEvent(id, 'focusing')) onFocus?.(manager.isFocused(id));
          break;
        }
        case 'opacity': {
          if (manager.endEvent(id, 'closing')) onClosed?.(state?.closingReason);
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
    windowElementRef.current.addEventListener('transitionend', normalHandler);
    windowElementRef.current.addEventListener('transitioncancel', cancelledHandler);
    return () => {
      windowElementRef.current?.removeEventListener('transitionend', normalHandler);
      windowElementRef.current?.removeEventListener('transitioncancel', cancelledHandler);
    };
  }, [windowElementRef.current, id]);

  useEffect(() => {
    setHasRendered(true);
  }, []);

  const isVisible = hasRendered && !isClosing;

  return {
    isVisible,
  };
}