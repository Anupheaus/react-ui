import { useReusableDOMRef } from './useReusableDOMRef';
import { useRef } from 'react';
import { HTMLTargetDelegate } from './models';

interface IUseSingleDOMConfig {
  connected?(element: HTMLElement): void;
  disconnected?(element: HTMLElement): void;
}

export function useSingleDOMRef(config: IUseSingleDOMConfig): HTMLTargetDelegate {
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
