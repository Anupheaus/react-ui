import { useCallback, useState, useEffect } from 'react';
import { IMap } from 'anux-common';

type Func = (...args: any[]) => any;

interface IBoundFunc {
  stub: Func;
  func: Func;
}

const boundFuncs: IMap<IBoundFunc> = {};

export function useBound<TFunc extends Func>(func: TFunc): TFunc {
  const [id] = useState(Math.uniqueId());
  let { stub } = boundFuncs[id] = boundFuncs[id] || { stub: undefined, func: undefined };

  if (!stub) {
    stub = (...args: any[]) => {
      if (!boundFuncs[id]) { throw new Error('The component for which this bound function has been created has since been unmounted.'); }
      return boundFuncs[id].func(...args);
    };
  }

  boundFuncs[id] = { stub, func };

  useEffect(() => {
    boundFuncs[id] = { stub, func };
    return () => {
      delete boundFuncs[id];
    };
  });

  return useCallback(stub, []) as TFunc;
}
