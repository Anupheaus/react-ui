import { IMap } from 'anux-common';
import { CSSProperties } from 'react';

type ReactStyle = CSSProperties & IMap;

const memory = new WeakMap<Object, ReactStyle>();

export function createStyle(target: Object, style: ReactStyle): ReactStyle {
  const memoizedStyle = memory.get(target);
  if (memoizedStyle && Reflect.areShallowEqual(style, memoizedStyle)) { return memoizedStyle; }
  memory.set(target, style);
  return style;
}
