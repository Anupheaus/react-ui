import { useCallback, useRef } from 'react';
import { HTMLTargetDelegate } from './models';
import { is } from 'anux-common';

interface IDOMRef {
  key: string;
  element: HTMLElement;
  callback: HTMLTargetDelegate;
}

export interface IUseReusableDOMConfig<TData> {
  connected?(key: string, data: TData, element: HTMLElement): void;
  disconnected?(key: string, data: TData, element: HTMLElement): void;
}

export function useReusableDOMRef<TData = void>(config: IUseReusableDOMConfig<TData>): (key: string, data: TData) => HTMLTargetDelegate {
  const { connected, disconnected } = {
    connected: Function.empty(),
    disconnected: Function.empty(),
    ...config,
  };
  const domRefs = useRef<IDOMRef[]>([]);

  return useCallback((key: string, data: TData) => {
    let domRef = domRefs.current.find(item => item.key === key);
    if (!domRef) {
      domRef = { key, element: undefined, callback: undefined };
      domRefs.current.push(domRef);
    }
    if (!domRef.callback) {
      domRef.callback = ((elementOrDelegate: HTMLElement | ((element: HTMLElement) => HTMLElement)): (HTMLElement | ((element: HTMLElement) => HTMLElement)) => {
        const processElement = (delegate: (element: HTMLElement) => HTMLElement) => (element: HTMLElement): HTMLElement => {
          if (domRef.element && domRef.element !== element) { disconnected(key, data, domRef.element); }
          domRef.element = element;
          if (domRef.element) { connected(key, data, domRef.element); }
          return delegate(element);
        };
        return is.function(elementOrDelegate) ? processElement(elementOrDelegate) : processElement(element => element)(elementOrDelegate);
      }) as HTMLTargetDelegate;
    }
    return domRef.callback;
  }, []);
}
