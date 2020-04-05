/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, JSXElementConstructor } from 'react';
import { useBound } from '../useBound';

type OnlyFunctionsOf<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never; }[keyof T]>;

type ReplaceFunctionsWithHandlers<T extends { [key: string]: (...args: any[]) => any }> = {
  [K in keyof T]: (handler: (...args: Parameters<T[K]>) => ReturnType<T[K]>) => ((...args: Parameters<T[K]>) => ReturnType<T[K]>);
};

export function useCallbackFor<T extends JSXElementConstructor<any>>(_component: T): ReplaceFunctionsWithHandlers<OnlyFunctionsOf<ComponentProps<T>>> {
  return new Proxy({}, {
    get: () => (delegate: (...args: any[]) => any) => useBound(delegate),
  }) as any;
}
