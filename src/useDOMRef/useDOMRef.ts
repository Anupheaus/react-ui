import { useRef, RefObject } from 'react';
import { is } from 'anux-common';
import { useForceUpdate } from '../useForceUpdate';
import { useBound } from '../hooks/useBound';
import { IAnuxRef } from '../anuxComponents';

type DOMRef = IAnuxRef<unknown> | { current: HTMLElement | null; } | ((instance: HTMLElement | null) => void) | null;

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
export function useDOMRef(refs: DOMRef[]): HTMLTargetDelegate;
export function useDOMRef(config: UseDOMConfig): HTMLTargetDelegate;
export function useDOMRef(arg?: UseDOMConfig | DOMRef[] | boolean): unknown {
  const elementRef = useRef<HTMLElement | undefined>(undefined);
  const forceUpdate = useForceUpdate();
  const config = is.plainObject<UseDOMConfig>(arg) ? arg : undefined;
  const forceRefresh = is.boolean(arg) ? arg : false;
  const refs = is.array(arg) ? arg : undefined;

  const setTarget = useBound((element: HTMLElement | null | undefined) => {
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
      if (refs != null) {
        refs.forEach(ref => {
          if (ref == null) return;
          if (is.function(ref)) ref(element ?? null);
          else ref.current = element ?? null;
        });
      }
      elementRef.current = element;
      if (forceRefresh) { forceUpdate(); }
    }
  });

  return config != null || refs != null ? setTarget : [elementRef, setTarget];
}
