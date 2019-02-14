import * as React from 'react';
import { IMap } from 'anux-common';

type ReactStyle = React.CSSProperties & IMap;

declare module 'react' {

  function createStyle(target: Object, style: ReactStyle): ReactStyle;

}

const memory = new WeakMap<Object, ReactStyle>();

Object.defineProperty(React, 'createStyle', {
  value(target: Object, style: ReactStyle): ReactStyle {
    const memoizedStyle = memory.get(target);
    if (memoizedStyle && Reflect.areShallowEqual(style, memoizedStyle)) { return memoizedStyle; }
    memory.set(target, style);
    return style;
  },
  enumerable: false,
  configurable: true,
});
