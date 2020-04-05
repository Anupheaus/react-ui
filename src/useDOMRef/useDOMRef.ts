import { useRef, RefObject } from 'react';
import { is } from 'anux-common';
import { useForceUpdate } from '../useForceUpdate';
import { useBound } from '../useBound';

export interface HTMLTargetDelegate {
  (element: HTMLElement | null): void;
  (delegate: (element: HTMLElement | null) => void): (element: HTMLElement | null) => void;
}

interface UseDOMConfig {
  connected?(element: HTMLElement): void;
  disconnected?(element: HTMLElement): void;
}

export function useDOMRef(): [RefObject<HTMLElement>, HTMLTargetDelegate];
export function useDOMRef(forceRefresh: boolean): [RefObject<HTMLElement>, HTMLTargetDelegate];
export function useDOMRef(config: UseDOMConfig): HTMLTargetDelegate;
export function useDOMRef(forceRefreshOrConfig?: UseDOMConfig | boolean): unknown {
  const elementRef = useRef<HTMLElement | undefined>(undefined);
  const forceUpdate = useForceUpdate();
  const config = is.plainObject(forceRefreshOrConfig) ? forceRefreshOrConfig : undefined;
  const forceRefresh = is.boolean(forceRefreshOrConfig) ? forceRefreshOrConfig : false;

  const updateElement = (element: HTMLElement) => {
    if (config) {
      if (element != null) {
        elementRef.current = element;
        config.connected?.(elementRef.current);
      } else {
        config.disconnected?.(elementRef.current as HTMLElement);
        elementRef.current = undefined;
      }
    } else {
      if (elementRef.current === element) return;
      elementRef.current = element ?? undefined;
      if (forceRefresh) { forceUpdate(); }
    }
  };

  const delegate = useBound((elementOrDelegate: HTMLElement | ((newElement: HTMLElement) => HTMLElement)) => {
    if (is.function(elementOrDelegate)) {
      return (element: HTMLElement) => {
        updateElement(element);
        elementOrDelegate(element);
      };
    } else {
      updateElement(elementOrDelegate);
    }
  }) as HTMLTargetDelegate;

  return config ? delegate : [elementRef, delegate];

}
