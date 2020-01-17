import { useRef, RefObject } from 'react';
import { useReusableDOMRef } from './useReusableDOMRef';
import { HTMLTargetDelegate } from './models';

interface IUseSingleDOMConfig {
  connected?(element: HTMLElement): void;
  disconnected?(element: HTMLElement): void;
}

export function useSingleDOMRef(): [RefObject<HTMLElement>, HTMLTargetDelegate];
export function useSingleDOMRef(config: IUseSingleDOMConfig): HTMLTargetDelegate;
export function useSingleDOMRef(config?: IUseSingleDOMConfig): any {
  if (!config) {
    const elementRef = useRef<HTMLElement>();
    const delegate = useSingleDOMRef({
      connected: element => elementRef.current = element,
      disconnected: () => elementRef.current = undefined,
    });
    return [elementRef, delegate];
  } else {
    const { connected, disconnected } = {
      connected: Function.empty(),
      disconnected: Function.empty(),
      ...config,
    };
    const keyRef = useRef(Math.uniqueId());
    return useReusableDOMRef({
      connected: (_key, _data, element) => connected(element),
      disconnected: (_key, _data, element) => disconnected(element),
    })(keyRef.current);
  }
}
