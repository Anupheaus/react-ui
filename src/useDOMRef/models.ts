import { MutableRefObject } from 'react';

export type HTMLElementRef = MutableRefObject<HTMLElement>;

export type HTMLTargetDelegate = (element: HTMLElement) => HTMLElement;
