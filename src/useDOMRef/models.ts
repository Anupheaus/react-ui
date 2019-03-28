import { MutableRefObject } from 'react';

export type HTMLElementRef = MutableRefObject<HTMLElement>;

// tslint:disable-next-line: interface-name
export interface HTMLTargetDelegate {
  (element: HTMLElement): HTMLElement;
  (delegate: (element: HTMLElement) => HTMLElement): (element: HTMLElement) => HTMLElement;
}
