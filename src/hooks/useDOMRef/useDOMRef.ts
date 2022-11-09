import { useRef, RefObject, Ref } from 'react';
import { AnyObject, is } from 'anux-common';
import { useForceUpdate } from '../useForceUpdate';
import { useBound } from '../useBound';

// type DOMRef = PureRef<unknown> | { current: HTMLElement | null; } | ((instance: HTMLElement | null) => void) | null;

export type HTMLTargetDelegate = (element: HTMLElement | null) => void;

interface UseDOMConfig {
  connected?(element: HTMLElement): void;
  disconnected?(element: HTMLElement): void;
}

export function useDOMRef(): [RefObject<HTMLElement>, HTMLTargetDelegate];
export function useDOMRef(forceRefresh: boolean): [RefObject<HTMLElement>, HTMLTargetDelegate];
export function useDOMRef(refs: (Ref<any> | undefined)[]): HTMLTargetDelegate;
export function useDOMRef(refs: (Ref<any> | undefined)[], config: UseDOMConfig): HTMLTargetDelegate;
export function useDOMRef(config: UseDOMConfig): HTMLTargetDelegate;
export function useDOMRef(arg?: UseDOMConfig | (Ref<any> | undefined)[] | boolean, config?: UseDOMConfig): unknown {
  const elementRef = useRef<HTMLElement | undefined>(undefined);
  const forceUpdate = useForceUpdate();
  config = config != null ? config : is.plainObject<UseDOMConfig>(arg) ? arg : undefined;
  const forceRefresh = is.boolean(arg) ? arg : false;
  const refs = is.array(arg) ? arg.removeNull() : undefined;

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
    }
    if (refs != null) {
      refs.forEach(ref => {
        if (ref == null) return;
        if (is.function(ref)) ref(element ?? null);
        else if ('current' in ref) (ref as AnyObject).current = element ?? null;
      });
    }
    elementRef.current = element;
    if (forceRefresh) forceUpdate();
  });

  return config != null || refs != null ? setTarget : [elementRef, setTarget];
}
