import { useRef } from 'react';
import { DistributedStateApi } from '../../hooks';
import { useBound } from '../../hooks/useBound';
import { useOnUnmount } from '../../hooks/useOnUnmount';
import { RippleConfig, RippleState } from './RippleModels';

export function createRippleEventHandler(setState: (delegate: (currentState: RippleState) => RippleState) => void, rippleConfig: DistributedStateApi<RippleConfig>) {
  const unhookRef = useRef<() => void>(() => void 0);
  const isUnmounted = useOnUnmount();

  return useBound((element: HTMLElement | null) => {
    unhookRef.current();
    if (!element) return;

    const mouseDownEvent = (event: MouseEvent) => {
      if (isUnmounted()) return;
      setState(currentState => {
        if (currentState.isActive) return currentState;
        const { ignoreMouseCoords, rippleElement } = rippleConfig.get();
        if (ignoreMouseCoords) {
          const rect = rippleElement?.parentElement?.getBoundingClientRect();

          if (rect) return { x: Math.round(rect.width / 2), y: Math.round(rect.height / 2), isActive: true, useCoords: false };
        }
        let x = (event.offsetX ?? 0);
        let y = (event.offsetY ?? 0);
        const getOffsets = (target: HTMLElement | null) => {
          if (target == null || target == element || !element.contains(target)) return;
          x += (target.offsetLeft ?? 0);
          y += (target.offsetTop ?? 0);
          getOffsets((target.offsetParent ?? target.parentElement) as HTMLElement | null);
        };
        getOffsets(event.target as HTMLElement);
        return { x, y, isActive: true, useCoords: true };
      });
    };

    const handleFocus = () => {
      if (isUnmounted()) return;
      setState(currentState => {
        if (currentState.isActive) return currentState;
        return { ...currentState, isActive: true, useCoords: false };
      });
    };

    const handleBlur = (event: FocusEvent) => {
      if (isUnmounted()) return;
      setState(currentState => {
        const performBlur = () => {
          if (!currentState.isActive) return currentState;
          return { ...currentState, isActive: false, useCoords: false };
        };
        if (event.relatedTarget != null && element.contains(event.relatedTarget as Node)) {
          // the target is inside us, so ignore the blur event        
          return currentState;
        } else {
          return performBlur();
        }
      });
    };

    element.addEventListener('mousedown', mouseDownEvent);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('focusin', handleFocus);
    element.addEventListener('blur', handleBlur);
    element.addEventListener('focusout', handleBlur);
    unhookRef.current = () => {
      element.removeEventListener('mousedown', mouseDownEvent);
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('focusin', handleFocus);
      element.removeEventListener('blur', handleBlur);
      element.removeEventListener('focusout', handleBlur);
    };
  });
}