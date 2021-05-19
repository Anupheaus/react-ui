import { useRef, RefObject } from 'react';
import { is } from 'anux-common';
import { useForceUpdate } from '../useForceUpdate';
import { useBound } from '../useBound';
import { useId } from '../useId';
import { useDelegatedBound } from '../useDelegatedBound';

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

  const updateElement = (element: HTMLElement | null | undefined) => {
    if (element === null) element = undefined;
    if (elementRef.current === element) return;
    if (config) {
      if (element != null) {
        elementRef.current = element;
        config.connected?.(elementRef.current);
      } else {
        config.disconnected?.(elementRef.current as HTMLElement);
        elementRef.current = undefined;
      }
    } else {
      elementRef.current = element;
      if (forceRefresh) { forceUpdate(); }
    }
  };

  const subDelegate = useDelegatedBound((handler: (element: HTMLElement | null) => void) => (element: HTMLElement | null) => {
    updateElement(element);
    handler(element);
  });

  const delegate = useBound((elementOrDelegate: HTMLElement | null | ((newElement: HTMLElement | null) => HTMLElement | null)) => {
    if (is.function(elementOrDelegate)) { return subDelegate(elementOrDelegate); }
    updateElement(elementOrDelegate);
  }) as HTMLTargetDelegate;

  return config ? delegate : [elementRef, delegate];
}
