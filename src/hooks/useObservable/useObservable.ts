import type { Unsubscribe } from '@anupheaus/common';
import { is } from '@anupheaus/common';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useBound } from '../useBound';
import { useSet } from '../useSet';

export function useObservable<T>(target: T | (() => T), dependencies: unknown[] = []) {
  const updatedDependencies = (!is.function(target) && !dependencies.includes(target)) ? dependencies.concat(target) : dependencies;
  const targetRef = useRef(useMemo(() => is.function(target) ? target() : target, []));
  const callbacks = useSet<((value: T) => void)>();

  const invokeCallbacks = useBound(() => callbacks.forEach(callback => callback(targetRef.current)));

  useLayoutEffect(() => {
    const newTarget = is.function(target) ? target() : target;
    if (targetRef.current == newTarget) return;
    targetRef.current = newTarget;
    invokeCallbacks();
  }, updatedDependencies);

  return {
    get() { return targetRef.current; },
    set(value: T | ((value: T) => T)) {
      if (is.function(value)) value = value(targetRef.current);
      if (targetRef.current == value) return;
      targetRef.current = value;
      invokeCallbacks();
    },
    onChange(callback: (value: T) => void): Unsubscribe {
      if (!callbacks.has(callback)) callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
  };
}