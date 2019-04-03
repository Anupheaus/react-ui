import { MutableRefObject } from 'react';
import { is } from 'anux-common';

export type HTMLElementRef = MutableRefObject<HTMLElement>;

// tslint:disable-next-line: interface-name
export interface HTMLTargetDelegate {
  (element: HTMLElement): HTMLElement;
  (delegate: (element: HTMLElement) => HTMLElement): (element: HTMLElement) => HTMLElement;
}

export namespace HTMLTargetDelegate {

  export function create(delegate: (element: HTMLElement) => HTMLElement): HTMLTargetDelegate {
    return ((delegateOrElement: HTMLElement | ((element: HTMLElement) => HTMLElement)): (HTMLElement | ((element: HTMLElement) => HTMLElement)) => {
      if (is.function(delegateOrElement)) {
        return element => delegateOrElement(delegate(element));
      } else {
        return delegate(delegateOrElement);
      }
    }) as HTMLTargetDelegate;
  }

  export function intercept(delegate: (element: HTMLElement) => HTMLElement, originalDelegate: HTMLTargetDelegate): HTMLTargetDelegate {
    return HTMLTargetDelegate.create(originalDelegate(delegate));
  }

}
