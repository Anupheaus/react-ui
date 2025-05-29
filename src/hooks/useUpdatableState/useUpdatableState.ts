import { is } from '@anupheaus/common';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo, useRef } from 'react';
import { useForceUpdate } from '../useForceUpdate';
import { useBound } from '../useBound';

export function useUpdatableState<T>(delegate: (prevState?: T) => T, dependencies: unknown[]): [T, Dispatch<SetStateAction<T>>] {
  const stateRef = useRef(useMemo(() => delegate(), []));
  const lastDependenciesRef = useRef(dependencies);
  const update = useForceUpdate();

  if (!is.deepEqual(lastDependenciesRef.current, dependencies)) {
    lastDependenciesRef.current = dependencies;
    stateRef.current = delegate(stateRef.current);
  }

  const updateState = useBound((valueOrDelegate: SetStateAction<T>) => {
    const newValue = is.function(valueOrDelegate) ? valueOrDelegate(stateRef.current) : valueOrDelegate;
    if (newValue === stateRef.current) return;
    stateRef.current = newValue;
    update();
  });

  return [stateRef.current, updateState];
}
