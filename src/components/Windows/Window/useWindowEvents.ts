import { RefObject, useEffect, useLayoutEffect, useState } from 'react';
import { WindowsManager } from '../WindowsManager';
import { useOnUnmount } from '../../../hooks';
import { PromiseMaybe } from '@anupheaus/common';

interface Props {
  manager: WindowsManager;
  windowElementRef: RefObject<HTMLElement>;
  id: string;
  onClosing: (() => PromiseMaybe<void | boolean>) | undefined;
  onClosed: (() => void) | undefined;
  onFocus: ((isFocused: boolean) => void) | undefined;
}

export function useWindowEvents({ manager, windowElementRef, id, onClosing, onClosed, onFocus }: Props) {
  const [isClosing, setIsClosing] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const isUnmounted = useOnUnmount();

  useLayoutEffect(() => {
    return manager.subscribeToEventChanges(id, async events => {
      if (events.allowClosing != null) {
        const promise = events.allowClosing;
        const result = await onClosing?.();
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
      console.log('transitionend', { propertyName: event.propertyName, target: event.target, element: windowElementRef.current, isUnmounted: isUnmounted(), isCancelled: _isCancelled });
      if (event.target !== windowElementRef.current || windowElementRef.current == null || isUnmounted()) return;
      switch (event.propertyName) {
        case 'filter': {
          if (manager.endEvent(id, 'focusing')) onFocus?.(manager.isFocused(id));
          break;
        }
        case 'opacity': {
          if (manager.endEvent(id, 'closing')) onClosed?.();
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