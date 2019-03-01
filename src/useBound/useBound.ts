import { useCallback, useState } from 'react';
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

  if (!stub) { stub = (...args: any[]) => boundFuncs[id].func(...args); }

  boundFuncs[id] = { stub, func };
  return useCallback(stub, []) as TFunc;
}
